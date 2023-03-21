import React, { useContext, useEffect } from "react";
import { GameContext } from "./GameContext";
import { MidiContext } from "./MidiContext";
import { IPlayerNote } from "../../types";
interface IAudioContext {}

const initialContextValues = {};

export const AudioContext =
  React.createContext<IAudioContext>(initialContextValues);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const { players } = useContext(GameContext);
  const { midiBus$ } = useContext(MidiContext);

  useEffect(() => {
    function onNoteOn(e: IPlayerNote) {
      console.log("noteon", e);
    }

    function onNoteOff(e: IPlayerNote) {
      console.log("noteoff", e);
    }

    midiBus$?.on("noteon", onNoteOn);
    midiBus$?.on("noteoff", onNoteOff);

    return () => {
      midiBus$?.off("noteon", onNoteOn);
      midiBus$?.off("noteoff", onNoteOff);
    };
  }, [midiBus$]);

  useEffect(() => {
    console.log("players changed");
  }, [players]);

  return <AudioContext.Provider value={{}}>{children}</AudioContext.Provider>;
}
