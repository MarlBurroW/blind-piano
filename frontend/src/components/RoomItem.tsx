import { Link } from "react-router-dom";
import { RoomAvailable } from "colyseus.js";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { UsersIcon } from "@heroicons/react/24/outline";

interface Props {
  room: RoomAvailable;
  className?: string;
}

export function RoomItem({ room, className }: Props) {
  return (
    <Link
      to={`/games/${room.roomId}`}
      key={room.roomId}
      className={`${className} flex group justify-between px-5 py-5  text-white rounded-3xl transition-all duration-500 bg-gradient-to-b from-primary-400 via-primary-500 to-primary-600  bg-size-200 bg-pos-0 hover:bg-pos-100`}
    >
      <div className="font-semibold block self-center grow">
        {room.metadata.name}
      </div>

      <div className="font-semibold block self-center flex mr-8">
        <UsersIcon className="w-7  mr-2 group-hover:text-white  transition:all ease-in-out duration-300"></UsersIcon>
        {room.clients} / {room.maxClients}
      </div>
      <ArrowRightIcon className="w-7    group-hover:text-white group-hover:translate-x-3 transition:all ease-in-out duration-300"></ArrowRightIcon>
    </Link>
  );
}
export default RoomItem;
