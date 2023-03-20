import React, { useContext, useEffect } from "react";
import { GameContext } from "./GameContext";

interface IAudioContext {}

const initialContextValues = {};

export const AudioContext =
  React.createContext<IAudioContext>(initialContextValues);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const { players, gameRoom } = useContext(GameContext);

  useEffect(() => {
    console.log("players changed");
  }, [players]);

  return <AudioContext.Provider value={{}}>{children}</AudioContext.Provider>;
}
