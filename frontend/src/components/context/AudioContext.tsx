import React, {
  useEffect,
  useContext,
  useRef,
  useCallback,
  useState,
  useMemo,
} from "react";

import { IPlayerNote, IPatch } from "../../../../common/types";

import { useImmer } from "use-immer";

import { useTranslation } from "react-i18next";

import instrumentManager from "../../classes/InstrumentManager";

import { GameContext } from "./GameContext";
import { MidiContext } from "./MidiContext";
import EventEmitter from "eventemitter3";

import { Instruments } from "../Instruments";

interface IAudioContext {
  masterAudioContext: AudioContext | null;
  setMasterVolume: (value: number) => void;
  masterVolume: number;
  playersVolumes: Map<string, number>;
  playersPatches: Map<string, IPatch>;
  setPlayerVolume: (playerId: string, value: number) => void;
  patches: Map<string, IPatch>;
  playersBuses: Map<string, EventEmitter>;
}

const DEFAULT_MASTER_VOLUME = 1;
const DEFAULT_PLAYER_VOLUME = 1;

const initialContextValues = {
  masterAudioContext: null,
  setMasterVolume: (value: number) => {},
  masterVolume: DEFAULT_MASTER_VOLUME,
  playersVolumes: new Map<string, number>(),
  playersPatches: new Map<string, IPatch>(),
  playersBuses: new Map<string, EventEmitter>(),
  setPlayerVolume: (playerId: string, value: number) => {},
  patches: new Map<string, IPatch>(),
};

type State = {
  playersPatches: Map<string, IPatch>;
  playersGainNodes: Map<string, AudioNode>;
  playersGainValues: Map<string, number>;
  playersBuses: Map<string, EventEmitter>;
};

const initialState = {
  playersPatches: new Map<string, IPatch>(),
  playersGainNodes: new Map<string, AudioNode>(),
  playersGainValues: new Map<string, number>(),
  playersBuses: new Map<string, EventEmitter>(),
};

export const AudioContext =
  React.createContext<IAudioContext>(initialContextValues);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { players } = useContext(GameContext);

  const { midiBus$: midiBus } = useContext(MidiContext);

  const [state, setState] = useImmer<State>(initialState);

  const { playersPatches, playersGainValues, playersBuses, playersGainNodes } =
    state;

  const masterAudioContextRef = useRef<AudioContext>(new window.AudioContext());
  const masterGainRef = useRef<GainNode>(
    masterAudioContextRef.current.createGain()
  );
  const [masterGainValue, setMasterGainValue] = useState<number>(
    DEFAULT_MASTER_VOLUME
  );

  useEffect(() => {
    masterGainRef.current.connect(masterAudioContextRef.current.destination);

    return () => {
      masterGainRef.current.disconnect(
        masterAudioContextRef.current.destination
      );
    };
  }, [masterAudioContextRef.current, masterGainRef.current]);

  useEffect(() => {
    masterGainRef.current.gain.value = masterGainValue;
  }, [masterGainValue, masterGainRef.current, masterAudioContextRef.current]);

  useEffect(() => {
    midiBus?.on("noteon", (note: IPlayerNote) => {
      // Emit on player bus
      const playerBus = playersBuses.get(note.playerId);

      if (playerBus) {
        playerBus.emit("noteon", note);
      }
    });

    midiBus?.on("noteoff", (note: IPlayerNote) => {
      // Emit on player bus
      const playerBus = playersBuses.get(note.playerId);

      if (playerBus) {
        playerBus.emit("noteoff", note);
      }
    });

    return () => {
      midiBus?.off("noteon");
      midiBus?.off("noteoff");
    };
  }, [playersBuses, midiBus]);

  const setPlayerVolume = useCallback(
    (playerId: string, value: number) => {
      setState((draft) => {
        draft.playersGainValues.set(playerId, value);
      });
    },
    [setState]
  );

  const patches = useMemo(() => {
    return instrumentManager.getPatches();
  }, []);

  useEffect(() => {
    for (const player of players) {
      const { id: playerId, patch: patchIdentifier } = player;

      // Set player volume if not set
      if (playersGainValues.get(playerId) === undefined) {
        setState((draft) => {
          draft.playersGainValues.set(playerId, DEFAULT_PLAYER_VOLUME);
        });
      }

      // Set event emitter if not set
      if (state.playersBuses.get(playerId) === undefined) {
        const eventEmitter = new EventEmitter();

        setState((draft) => {
          draft.playersBuses.set(playerId, eventEmitter);
        });
      }

      // Set player patch if not set
      if (playersPatches.get(playerId) === undefined) {
        const patch = patches.get(patchIdentifier);

        if (patch) {
          setState((draft) => {
            draft.playersPatches.set(playerId, patch);
          });
        }
      }

      // Check if patch has changed
      if (playersPatches.get(playerId)?.identifier !== patchIdentifier) {
        const patch = patches.get(patchIdentifier);

        if (patch) {
          setState((draft) => {
            draft.playersPatches.set(playerId, patch);
          });
        }
      }

      // Set player GainNode if not set
      if (state.playersGainNodes.get(playerId) === undefined) {
        const playerGainNode = masterAudioContextRef.current.createGain();

        playerGainNode.connect(masterGainRef.current);

        setState((draft) => {
          draft.playersGainNodes.set(playerId, playerGainNode);
        });
      }
    }

    // Remove audio items fro players that are not in the game anymore

    for (const [playerId, playerGainNode] of state.playersGainNodes) {
      if (!players.find((player) => player.id === playerId)) {
        playerGainNode.disconnect();
        setState((draft) => {
          draft.playersGainNodes.delete(playerId);
          draft.playersGainValues.delete(playerId);
          draft.playersPatches.delete(playerId);
          draft.playersBuses.delete(playerId);
        });
      }
    }
  }, [players]);

  return (
    <AudioContext.Provider
      value={{
        masterAudioContext: masterAudioContextRef.current,
        masterVolume: masterGainValue,
        setMasterVolume: setMasterGainValue,
        playersVolumes: playersGainValues,
        setPlayerVolume,
        playersPatches,
        patches,
        playersBuses,
      }}
    >
      <>
        <Instruments
          buses={playersBuses}
          patches={playersPatches}
          outputs={playersGainNodes}
        ></Instruments>
        {children}
      </>
    </AudioContext.Provider>
  );
}

export default AudioProvider;

// export function AudioProvider({ children }: { children: React.ReactNode }) {
//   const { t } = useTranslation();

//   const { players } = useContext(GameContext);
//   const { midiBus$: midiBus } = useContext(MidiContext);

//   const [state, setState] = useImmer<State>(initialState);

//   const patches = useMemo(() => {
//     return [...getSPFPatches(), ...getWAFPatches(), ...getWAFDrumPatches()];
//   }, []);

//   const stateRef = useRef(state);

//   const [masterGainValue, setMasterGainValue] = useState<number>(
//     DEFAULT_MASTER_VOLUME
//   );

//   const setPlayerVolume = useCallback(
//     (playerId: string, value: number) => {
//       setState((draft) => {
//         draft.playersGainValues[playerId] = value;
//       });
//     },
//     [setState]
//   );

//   useEffect(() => {
//     stateRef.current = state;
//   }, [state]);

//   const masterAudioContextRef = useRef<AudioContext>(new window.AudioContext());
//   const masterGainRef = useRef<GainNode>(
//     masterAudioContextRef.current.createGain()
//   );

//   useEffect(() => {
//     masterGainRef.current.connect(masterAudioContextRef.current.destination);
//     return () => {
//       masterGainRef.current.disconnect(
//         masterAudioContextRef.current.destination
//       );
//     };
//   }, [masterAudioContextRef.current, masterGainRef.current]);

//   useEffect(() => {
//     masterGainRef.current.gain.value = masterGainValue;
//   }, [masterGainValue, masterGainRef.current, masterAudioContextRef.current]);

//   useEffect(() => {
//     function onNoteOn(note: IPlayerNote) {
//       const playerInstument =
//         stateRef.current.playersInstruments[note.playerId];
//       if (playerInstument) {
//         playerInstument.playNote(note);
//       }
//     }

//     function onNoteOff(note: IPlayerNote) {
//       const playerInstument =
//         stateRef.current.playersInstruments[note.playerId];
//       if (playerInstument) {
//         playerInstument.stopNote(note);
//       }
//     }

//     midiBus?.on("noteon", onNoteOn);
//     midiBus?.on("noteoff", onNoteOff);

//     return () => {
//       midiBus?.off("noteon", onNoteOn);
//       midiBus?.off("noteoff", onNoteOff);
//     };
//   }, [midiBus]);

//   function createInstrument(instrumentIdentifier: string): IInstrument | null {
//     const patch = patches.find(
//       (patch) => patch.identifier === instrumentIdentifier
//     );

//     if (patch) {
//       switch (patch.type) {
//         case "SFPInstrument":
//           return new SFPInstrument(patch);
//         case "WAFInstrument":
//           return new WAFInstrument(patch);
//         case "WAFDrumInstrument":
//           return new WAFDrumInstrument(patch);
//       }
//     }

//     return null;
//   }

//   useEffect(() => {
//     // Remove instrument if player is no longer in the room
//     for (const playerId in stateRef.current.playersInstruments) {
//       const player = players.find((p) => p.id === playerId);

//       if (!player) {
//         stateRef.current.playersInstruments[playerId].dispose();
//         stateRef.current.playersGainNodes[playerId].disconnect();

//         setState((draft) => {
//           delete draft.playersInstruments[playerId];
//           delete draft.playersGainNodes[playerId];
//           delete draft.playersGainValues[playerId];
//           delete draft.playersLoading[playerId];
//         });
//       }
//     }

//     // If a player instrument has changed or not instanciated, instanciate it

//     for (const player of players) {
//       const playerInstrument = stateRef.current.playersInstruments[player.id];
//       let playerGainNode = state.playersGainNodes[player.id];

//       if (!playerGainNode) {
//         playerGainNode = masterAudioContextRef.current.createGain();
//         playerGainNode.gain.value =
//           state.playersGainValues[player.id] || DEFAULT_PLAYER_VOLUME;
//         playerGainNode.connect(masterGainRef.current);
//         setState((draft) => {
//           draft.playersGainNodes[player.id] = playerGainNode;
//           draft.playersGainValues[player.id] = DEFAULT_PLAYER_VOLUME;
//         });
//       }

//       if (
//         !playerInstrument ||
//         playerInstrument.getIdentifier() !== player.instrument
//       ) {
//         const instrument = createInstrument(player.instrument);

//         if (instrument) {
//           if (state.playersLoading[player.id]) return;

//           instrument.setOutputNode(playerGainNode);

//           setState((draft) => {
//             draft.playersLoading[player.id] = true;
//           });

//           const loadingPromise = instrument
//             .load()
//             .then(() => {
//               setState((draft) => {
//                 draft.playersInstruments[player.id] = instrument;
//               });

//               if (playerInstrument) {
//                 playerInstrument.dispose();
//               }
//             })
//             .finally(() => {
//               setState((draft) => {
//                 draft.playersLoading[player.id] = false;
//               });
//             });

//           toast.promise(loadingPromise, {
//             loading: t("loading_messages.loading_instrument", {
//               name: instrument.getName(),
//             }),
//             success: t("success_messages.instrument_loaded", {
//               name: instrument.getName(),
//             }),
//             error: t("client_error_messages.instrument_loading_failed", {
//               name: instrument.getName(),
//             }),
//           });
//         }
//       }
//     }
//   }, [players, masterAudioContextRef.current]);

//   useEffect(() => {
//     Object.entries(state.playersGainValues).forEach(([playerId, gainValue]) => {
//       const playerGainNode = state.playersGainNodes[playerId];
//       if (playerGainNode) {
//         playerGainNode.gain.value = gainValue;
//       }
//     });
//   }, [state.playersGainValues]);

//   return (
//     <AudioContext.Provider
//       value={{
//         playersInstruments: state.playersInstruments,
//         patches: patches,
//         masterAudioContext: masterAudioContextRef.current,
//         setMasterVolume: setMasterGainValue,
//         masterVolume: masterGainValue,
//         playersVolumes: state.playersGainValues,
//         setPlayerVolume: setPlayerVolume,
//       }}
//     >
//       {children}
//     </AudioContext.Provider>
//   );
// }
