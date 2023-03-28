import { PlayerItem } from "./PlayerItem";

import { useMe, useLeader, usePlayers } from "../hooks/hooks";

export function PlayerList(): JSX.Element {
  const me = useMe();
  const leader = useLeader();
  const players = usePlayers();

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
