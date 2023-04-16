import { Room } from "colyseus.js";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { Game } from "../../../backend/schemas/Game";

type State = {
  theme: string;
  gameRoom: Room<Game> | null;
};

type Actions = {
  storeTheme: (theme: string) => void;
  storeGameRoom: (gameRoom: Room<Game> | null) => void;
};

export const useAppStore = create(
  devtools(
    immer<State & Actions>(set => ({
      theme: "light",
      gameRoom: null,
      storeGameRoom: gameRoom =>
        set(state => {
          state.gameRoom = gameRoom;
        }),

      storeTheme: theme =>
        set(state => {
          state.theme = theme;
        }),
    }))
  )
);

export default useAppStore;
