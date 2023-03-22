import React, { useContext, useEffect, useRef } from "react";
import { GameContext } from "./GameContext";
import { MidiContext } from "./MidiContext";
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

interface IAudioContext {}

const instrumentItems = [...SFPInstrumentsItems, ...WAFInstrumentItems];

const initialContextValues = {};

type State = {
  playersInstruments: {
    [playerId: string]: IInstrument;
  };
};

const initialState = {
  playersInstruments: {},
};

export const AudioContext =
  React.createContext<IAudioContext>(initialContextValues);

// créer un contexte AudioContext
var audioContext = new (window.AudioContext || window.webkitAudioContext)();

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
  const { players } = useContext(GameContext);
  const { midiBus$ } = useContext(MidiContext);

  const [state, setState] = useImmer<State>(initialState);

  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

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

    midiBus$?.on("noteon", onNoteOn);
    midiBus$?.on("noteoff", onNoteOff);

    return () => {
      midiBus$?.off("noteon", onNoteOn);
      midiBus$?.off("noteoff", onNoteOff);
    };
  }, [midiBus$]);

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

      if (
        playerInstrument &&
        playerInstrument.getIdentifier() === player.instrument
      ) {
        continue;
      } else {
        if (playerInstrument) {
          playerInstrument.dispose();
        }

        const instrument = createInstrument(player.instrument);

        if (instrument) {
          instrument.setAudioContext(audioContext);

          instrument.load().then(() => {
            setState((draft) => {
              draft.playersInstruments[player.id] = instrument;
            });
          });
        }
      }
    }
  }, [players]);

  return <AudioContext.Provider value={{}}>{children}</AudioContext.Provider>;
}
