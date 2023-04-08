import { useLeader, useMe, usePlayers } from "../hooks/hooks";
import { PlayerItem } from "./PlayerItem";

export function PlayerList(): JSX.Element {
  const me = useMe();
  const leader = useLeader();
  const players = usePlayers();

  return (
    <div>
      {players.map(player => {
        return (
          <div className="mb-4" key={player.id}>
            <PlayerItem
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
