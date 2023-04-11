import chroma from "chroma-js";

import { ITrack } from "../../../common/types";
import { usePatch, usePlayer } from "../hooks/hooks";
import Avatar from "./Avatar";
import { Icon } from "./Icon";
import { Popover } from "./Popover";
import { TrackPopoverMenu } from "./TrackPopoverMenu";

interface Props {
  track: ITrack;
  onClick?: (track: ITrack) => void;
}

export function TrackHead({ track, onClick }: Props) {
  const patch = usePatch(track.patch);

  const player = usePlayer(track.playerId);

  return (
    <Popover
      popoverContent={<TrackPopoverMenu track={track} />}
      style={{
        backgroundColor: player ? player.color : "none",
      }}
      className="h-[10rem] group cursor-pointer hover:bg-shade-100 bg-shade-300 w-[20rem] flex flex-col"
    >
      <div className="text-md p-1 px-3  bg-black bg-opacity-10">
        {track.name}
      </div>

      <div className="flex items-center grow px-4">
        {patch && (
          <div className="relative  bg-black bg-opacity-10  p-5 rounded-full mr-4  ">
            <Icon
              name={patch.category.icon}
              className="h-10 w-10 block fill-white"
            ></Icon>
            {player && (
              <Avatar
                className="mr-2 absolute -top-2 -left-2"
                seed={player.avatarSeed}
                size={24}
                background
                circle
              ></Avatar>
            )}
          </div>
        )}

        <div>
          <div>{patch?.name}</div>
        </div>
      </div>
    </Popover>
  );
}

export default TrackHead;
