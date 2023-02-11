import { create } from "zustand";
import { Room } from "colyseus.js";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";

type State = {
  gameRoom: Room | null;
  theme: string;
};

type Actions = {
  storeRoom: (gameRoom: Room) => void;
  storeTheme: (theme: string) => void;
};

export const useAppStore = create(
  devtools(
    immer<State & Actions>((set) => ({
      gameRoom: null,
      theme: "light",

      storeRoom: (gameRoom) =>
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
