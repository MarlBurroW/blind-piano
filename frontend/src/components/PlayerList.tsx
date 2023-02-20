import { PlayerItem } from "./PlayerItem";

import { GameContext } from "../components/context/GameContext";
import { useContext } from "react";

export function PlayerList(): JSX.Element {
  const { me, leader, isLeader, players } = useContext(GameContext);

  return (
    <div>
      {players.map((player) => {
        return (
          <PlayerItem
            key={player.id}
            className="mb-4"
            player={player}
            isMe={player.id === me?.id}
            isLeader={player.id === leader?.id}
            meIsLeader={isLeader}
          ></PlayerItem>
        );
      })}
    </div>
  );
}
export default PlayerList;
