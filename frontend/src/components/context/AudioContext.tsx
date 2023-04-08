import EventEmitter from "eventemitter3";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useImmer } from "use-immer";

import { IPatch, IPlayerNote } from "../../../../common/types";
import instrumentManager from "../../classes/InstrumentManager";
import { Instruments } from "../Instruments";
import { GameContext } from "./GameContext";
import { MidiContext } from "./MidiContext";

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
  playersGainNodes: Map<string, GainNode>;
  playersGainValues: Map<string, number>;
  playersBuses: Map<string, EventEmitter>;
};

const initialState = {
  playersPatches: new Map<string, IPatch>(),
  playersGainNodes: new Map<string, GainNode>(),
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
    for (const [playerId, gainValue] of state.playersGainValues) {
      const playerGainNode = state.playersGainNodes.get(playerId);

      if (playerGainNode) {
        playerGainNode.gain.value = gainValue;
      }
    }
  }, [state.playersGainValues, state.playersGainNodes]);

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
      setState(draft => {
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
        setState(draft => {
          draft.playersGainValues.set(playerId, DEFAULT_PLAYER_VOLUME);
        });
      }

      // Set event emitter if not set
      if (state.playersBuses.get(playerId) === undefined) {
        const eventEmitter = new EventEmitter();

        setState(draft => {
          draft.playersBuses.set(playerId, eventEmitter);
        });
      }

      // Set player patch if not set
      if (playersPatches.get(playerId) === undefined) {
        const patch = patches.get(patchIdentifier);

        if (patch) {
          setState(draft => {
            draft.playersPatches.set(playerId, patch);
          });
        }
      }

      // Check if patch has changed
      if (playersPatches.get(playerId)?.identifier !== patchIdentifier) {
        const patch = patches.get(patchIdentifier);

        if (patch) {
          setState(draft => {
            draft.playersPatches.set(playerId, patch);
          });
        }
      }

      // Set player GainNode if not set
      if (state.playersGainNodes.get(playerId) === undefined) {
        const playerGainNode = masterAudioContextRef.current.createGain();

        playerGainNode.connect(masterGainRef.current);

        setState(draft => {
          draft.playersGainNodes.set(playerId, playerGainNode);
        });
      }
    }

    // Remove audio items fro players that are not in the game anymore

    for (const [playerId, playerGainNode] of state.playersGainNodes) {
      if (!players.find(player => player.id === playerId)) {
        playerGainNode.disconnect();
        setState(draft => {
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
