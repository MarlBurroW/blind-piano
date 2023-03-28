import { PlayerItem } from "./PlayerItem";

import { GameContext } from "../components/context/GameContext";
import { useContext } from "react";

export function PlayerList(): JSX.Element {
  const { me, leader, isLeader, players } = useContext(GameContext);

  return (
    <div>
      {players.map((player) => {
        return (
          <div className="mb-4">
            <PlayerItem
              key={player.id}
              player={player}
              isMe={player.id === me?.id}
              isLeader={player.id === leader?.id}
            ></PlayerItem>
          </div>
        );
      })}
    </div>
  );
}
export default PlayerList;
