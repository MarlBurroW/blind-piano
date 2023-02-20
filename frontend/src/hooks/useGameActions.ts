import { GameContext } from "../components/context/GameContext";
import { useContext } from "react";

export const useGameActions = () => {
  const { gameRoom } = useContext(GameContext);

  return {
    kickPlayer: (playerId: string) => {
      if (gameRoom) {
        gameRoom.send("kick-player", playerId);
      }
    },
    promoteGameLeader: (playerId: string) => {
      if (gameRoom) {
        gameRoom.send("promote-game-leader", playerId);
      }
    },

    sendChatMessage: (message: string) => {
      if (gameRoom) {
        gameRoom.send("chat-message", message);
      }
    },
  };
};
export default useGameActions;
