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
      className={`${className} flex group justify-between px-5 py-5 bg-base-100 dark:bg-base-800 dark:border-primary-500 border-primary-700 border-2 hover:shadow-lg hover:bg-primary-700 dark:hover:bg-primary-500 hover:text-white rounded-md shadow-md cursor-pointer transition:all ease-in-out duration-300`}
    >
      <div className="font-semibold block self-center grow">
        {room.metadata.name}
      </div>
      <div className="font-semibold block self-center flex mr-8">
        <UsersIcon className="w-7 text-primary-700 dark:text-primary-500 mr-2 group-hover:text-white  transition:all ease-in-out duration-300"></UsersIcon>
        {room.clients} / {room.maxClients}
      </div>
      <ArrowRightIcon className="w-7  text-primary-700 dark:text-primary-500 group-hover:text-white group-hover:translate-x-3 transition:all ease-in-out duration-300"></ArrowRightIcon>
    </Link>
  );
}
export default RoomItem;
