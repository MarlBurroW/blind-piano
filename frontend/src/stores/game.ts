import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";

import { Game } from "../../../backend/schemas/Game";
import { Player } from "../../../backend/schemas/Player";
import { Room } from "colyseus.js";

type State = {
  players: Array<Player>;
  gameRoom: Room | null;
  gameState: Game | null;
  computed: {
    me: Player | undefined;
  };
};

type Actions = {
  storeGameRoom: (gameRoom: Room) => void;
  storeGameState: (gameState: Game) => void;
};

export const useGameStore = create(
  devtools(
    immer<State & Actions>((set, get) => ({
      players: [],
      gameRoom: null,
      gameState: null,

      storeGameRoom: (gameRoom) => {
        set((state) => {
          state.gameRoom = gameRoom;
        });
      },
      storeGameState: (gameState) => {
        set((state) => {
          state.gameState = gameState;
        });

        if (gameState.players) {
          set((state) => {
            state.players = Array.from(gameState.players.entries()).map(
              (p) => p[1]
            );
          });
        }
      },
      computed: {
        get me() {
          return get().players.find((p) => p.id === get().gameRoom?.sessionId);
        },
      },
    }))
  )
);

export default useGameStore;
