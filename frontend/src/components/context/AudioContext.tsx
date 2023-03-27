import React, { useEffect, useRef, useCallback, useState } from "react";

import { IPlayerNote, IInstrumentItem, IInstrument } from "../../types";
import {
  SFPInstrument,
  instrumentsItems as SFPInstrumentsItems,
} from "../../classes/SFPInstrument";

import {
  WAFInstrument,
  instrumentsItems as WAFInstrumentItems,
} from "../../classes/WAFInstrument";

import { useImmer } from "use-immer";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { usePlayers, useMe, useMidiBus } from "../../hooks/hooks";

interface IAudioContext {
  instrumentItems: Array<IInstrumentItem>;

  playersInstruments: {
    [playerId: string]: IInstrument;
  };
  masterAudioContext: AudioContext | null;
  setMasterVolume: (value: number) => void;
  masterVolume: number;
  playersVolumes: {
    [playerId: string]: number;
  };
  setPlayerVolume: (playerId: string, value: number) => void;
}

const instrumentItems = [...SFPInstrumentsItems, ...WAFInstrumentItems].map(
  (instrumentItem, index) => {
    instrumentItem.name = `${index}. ${instrumentItem.name}`;
    return instrumentItem;
  }
);

const DEFAULT_MASTER_VOLUME = 1;
const DEFAULT_PLAYER_VOLUME = 1;

const initialContextValues = {
  instrumentItems,

  playersInstruments: {},
  masterAudioContext: null,
  setMasterVolume: (value: number) => {},
  masterVolume: DEFAULT_MASTER_VOLUME,
  playersVolumes: {},
  setPlayerVolume: (playerId: string, value: number) => {},
};

type State = {
  playersInstruments: {
    [playerId: string]: IInstrument;
  };
  playersGainNodes: {
    [playerId: string]: GainNode;
  };
  playersGainValues: {
    [playerId: string]: number;
  };
};

const initialState = {
  playersInstruments: {},
  playersGainNodes: {},
  playersGainValues: {},
};

export const AudioContext =
  React.createContext<IAudioContext>(initialContextValues);

export function getInstrumentItemFromIdentifier(
  instrumentIdentifier: string
): IInstrumentItem | null {
  return (
    instrumentItems.find(
      (instrumentItem) => instrumentItem.identifier === instrumentIdentifier
    ) || null
  );
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();

  const players = usePlayers();
  const midiBus = useMidiBus();

  const [state, setState] = useImmer<State>(initialState);

  const stateRef = useRef(state);

  const [masterGainValue, setMasterGainValue] = useState<number>(
    DEFAULT_MASTER_VOLUME
  );

  const setPlayerVolume = useCallback(
    (playerId: string, value: number) => {
      setState((draft) => {
        draft.playersGainValues[playerId] = value;
      });
    },
    [setState]
  );

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const masterAudioContextRef = useRef<AudioContext>(new window.AudioContext());
  const masterGainRef = useRef<GainNode>(
    masterAudioContextRef.current.createGain()
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
    function onNoteOn(note: IPlayerNote) {
      const playerInstument =
        stateRef.current.playersInstruments[note.playerId];
      if (playerInstument) {
        playerInstument.playNote(note);
      }
    }

    function onNoteOff(note: IPlayerNote) {
      const playerInstument =
        stateRef.current.playersInstruments[note.playerId];
      if (playerInstument) {
        playerInstument.stopNote(note);
      }
    }

    midiBus?.on("noteon", onNoteOn);
    midiBus?.on("noteoff", onNoteOff);

    return () => {
      midiBus?.off("noteon", onNoteOn);
      midiBus?.off("noteoff", onNoteOff);
    };
  }, [midiBus]);

  function createInstrument(instrumentIdentifier: string): IInstrument | null {
    const instrumentItem =
      getInstrumentItemFromIdentifier(instrumentIdentifier);

    if (instrumentItem) {
      switch (instrumentItem.type) {
        case "SFPInstrument":
          return new SFPInstrument(instrumentItem);
        case "WAFInstrument":
          return new WAFInstrument(instrumentItem);
      }
    }

    return null;
  }

  useEffect(() => {
    for (const player of players) {
      const playerInstrument = stateRef.current.playersInstruments[player.id];

      let playerGainNode = state.playersGainNodes[player.id];
      if (!playerGainNode) {
        playerGainNode = masterAudioContextRef.current.createGain();
        playerGainNode.gain.value =
          state.playersGainValues[player.id] || DEFAULT_PLAYER_VOLUME;
        playerGainNode.connect(masterGainRef.current);
        setState((draft) => {
          draft.playersGainNodes[player.id] = playerGainNode;
          draft.playersGainValues[player.id] = DEFAULT_PLAYER_VOLUME;
        });
      }

      if (
        playerInstrument &&
        playerInstrument.getIdentifier() === player.instrument
      ) {
        // Update outputNode with the player's GainNode
        playerInstrument.setOutputNode(playerGainNode);
        continue;
      } else {
        const instrument = createInstrument(player.instrument);

        if (instrument) {
          // Set the player's GainNode as outputNode
          instrument.setOutputNode(playerGainNode);

          const loadingPromise = instrument.load().then(() => {
            setState((draft) => {
              draft.playersInstruments[player.id] = instrument;
            });

            if (playerInstrument) {
              playerInstrument.dispose();
            }
          });

          toast.promise(loadingPromise, {
            loading: t("loading_messages.loading_instrument", {
              name: instrument.getName(),
            }),
            success: t("success_messages.instrument_loaded", {
              name: instrument.getName(),
            }),
            error: t("client_error_messages.instrument_loading_failed", {
              name: instrument.getName(),
            }),
          });
        }
      }
    }
  }, [players, masterAudioContextRef.current]);

  useEffect(() => {
    Object.entries(state.playersGainValues).forEach(([playerId, gainValue]) => {
      const playerGainNode = state.playersGainNodes[playerId];
      if (playerGainNode) {
        playerGainNode.gain.value = gainValue;
      }
    });
  }, [state.playersGainValues]);

  return (
    <AudioContext.Provider
      value={{
        playersInstruments: state.playersInstruments,
        instrumentItems: instrumentItems,
        masterAudioContext: masterAudioContextRef.current,
        setMasterVolume: setMasterGainValue,
        masterVolume: masterGainValue,
        playersVolumes: state.playersGainValues,
        setPlayerVolume: setPlayerVolume,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}
