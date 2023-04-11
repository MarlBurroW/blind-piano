import { useTranslation } from "react-i18next";
import { RxTrash } from "react-icons/rx";

import { ITrack } from "../../../common/types";
import { useGameActions } from "../hooks/hooks";

interface Props {
  track: ITrack;
}

export function TrackPopoverMenu({ track }: Props) {
  const { t } = useTranslation();
  const { removeTrack } = useGameActions();

  return (
    <div className="w-[20rem] flex flex-col items-center">
      <div className="text-xl uppercase p-3">{track.name}</div>

      <div
        className="px-5 w-full py-4 cursor-pointer text-red-300  bg-shade-200 hover:bg-primary-400 flex justify-start "
        onClick={() => removeTrack(track.id)}
      >
        <RxTrash className="text-2xl mr-4"></RxTrash> {t("tracks.remove_track")}
      </div>
    </div>
  );
}
