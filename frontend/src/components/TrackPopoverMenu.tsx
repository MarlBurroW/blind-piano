import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { RxTrash } from "react-icons/rx";
import { SlClose } from "react-icons/sl";
import { TfiHandStop } from "react-icons/tfi";
import { TfiPencil } from "react-icons/tfi";

import { ITrack } from "../../../common/types";
import { useGameActions, useMe, usePatch } from "../hooks/hooks";
import { Icon } from "./Icon";

interface Props {
  track: ITrack;
  onChangePatchClicked: (track: ITrack) => void;
}

export function TrackPopoverMenu({ track, onChangePatchClicked }: Props) {
  const { t } = useTranslation();
  const { removeTrack, takeTrackControl, leaveTrackControl, setTrackName } =
    useGameActions();
  const me = useMe();
  const patch = usePatch(track.patch);
  const [isTrackNameEditing, setIsTrackNameEditing] = useState(false);
  const [tmpTrackName, setTmpTrackName] = useState(track.name);

  const handleValidateTrackName = () => {
    setTrackName(track.id, tmpTrackName);
    setIsTrackNameEditing(false);
  };

  useEffect(() => {
    if (isTrackNameEditing) {
      setTmpTrackName(track.name);
    }
  }, [track.name, isTrackNameEditing]);

  return (
    <div className="w-[20rem] flex flex-col items-center">
      <div className="text-xl uppercase p-3 flex items-center">
        {isTrackNameEditing ? (
          <>
            <input
              className="bg-shade-100 p-2 px-3 rounded-full text-white text-xl w-full mr-2"
              value={tmpTrackName}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  handleValidateTrackName();
                }
              }}
              onChange={e => {
                setTmpTrackName(e.target.value);
              }}
            ></input>
            <AiOutlineCheckCircle
              onClick={handleValidateTrackName}
              className="text-3xl cursor-pointer text-green-300"
            ></AiOutlineCheckCircle>
            <AiOutlineCloseCircle
              onClick={() => setIsTrackNameEditing(false)}
              className="text-3xl cursor-pointer text-red-300"
            ></AiOutlineCloseCircle>
          </>
        ) : (
          <>
            <div className="mr-2">{track.name}</div>
            <TfiPencil
              onClick={() => setIsTrackNameEditing(true)}
              className="cursor-pointer"
            ></TfiPencil>
          </>
        )}
      </div>

      <div
        className="px-5 w-full py-4 cursor-pointer   bg-shade-200 hover:bg-primary-400 flex justify-start "
        onClick={() => onChangePatchClicked(track)}
      >
        <Icon
          name={patch?.category.icon}
          className="fill-white block h-6 w-6 mr-2"
        />
        {t("tracks.change_instrument")}
      </div>

      {track.playerId === me?.id ? (
        <div
          className="px-5 w-full py-4 cursor-pointer   bg-shade-200 hover:bg-primary-400 flex justify-start "
          onClick={() => leaveTrackControl(track.id)}
        >
          <SlClose className="text-2xl mr-4"></SlClose>{" "}
          {t("tracks.stop_control")}
        </div>
      ) : (
        <div
          className="px-5 w-full py-4 cursor-pointer   bg-shade-200 hover:bg-primary-400 flex justify-start "
          onClick={() => takeTrackControl(track.id)}
        >
          <TfiHandStop className="text-2xl mr-4"></TfiHandStop>{" "}
          {t("tracks.take_control")}
        </div>
      )}

      <div
        className="px-5 w-full py-4 cursor-pointer text-red-300  bg-shade-200 hover:bg-primary-400 flex justify-start "
        onClick={() => removeTrack(track.id)}
      >
        <RxTrash className="text-2xl mr-4"></RxTrash> {t("tracks.remove_track")}
      </div>
    </div>
  );
}
