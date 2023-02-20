import { create } from "zustand";

import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import { Room } from "colyseus.js";
type State = {
  theme: string;
  gameRoom: Room | null;
};

type Actions = {
  storeTheme: (theme: string) => void;
  storeGameRoom: (gameRoom: Room | null) => void;
};

export const useAppStore = create(
  devtools(
    immer<State & Actions>((set) => ({
      theme: "light",
      gameRoom: null,
      storeGameRoom: (gameRoom) =>
        set((state) => {
          state.gameRoom = gameRoom;
        }),

      storeTheme: (theme) =>
        set((state) => {
          state.theme = theme;
        }),
    }))
  )
);

export default useAppStore;
