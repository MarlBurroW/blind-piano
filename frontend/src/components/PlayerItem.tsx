import { RoomAvailable } from "colyseus.js";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { UsersIcon } from "@heroicons/react/24/outline";
import { Avatar } from "./Avatar";
import { Player } from "../classes/Player";

interface Props {
  player: Player;
  className?: string;
}

export function PlayerItem({ player, className }: Props) {
  return (
    <div
      className={`${className} p-3 flex items-center bg-base-100 dark:bg-base-900  border-primary-700 rounded-md`}
    >
      <Avatar
        background={true}
        circle
        size={60}
        seed={player.avatarSeed}
        className="mr-4"
      ></Avatar>
      <span className="font-bold">{player.nickname}</span>
    </div>
  );
}
export default PlayerItem;
