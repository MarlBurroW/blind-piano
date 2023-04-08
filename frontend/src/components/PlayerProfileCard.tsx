import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { HiOutlinePencil } from "react-icons/hi";
import { RxExit } from "react-icons/rx";
import { TbCrown } from "react-icons/tb";

import { IPlayer } from "../../../common/types";
import {
  useGameActions,
  useIdentityModalControl,
  useLeader,
  useMe,
  usePlayerPatch,
} from "../hooks/hooks";
import { Avatar } from "./Avatar";
import { Icon } from "./Icon";
import { PlayerVolumeSlider } from "./PlayerVolumeSlider";

interface Props {
  player: IPlayer;
}

export function PlayerProfileCard({ player }: Props) {
  const { t } = useTranslation();
  const { kickPlayer, promoteGameLeader } = useGameActions();
  const playerPatch = usePlayerPatch(player.id);
  const me = useMe();
  const leader = useLeader();
  const { openIdentityModal } = useIdentityModalControl();

  const isMe = useMemo(() => {
    return me?.id === player.id;
  }, [me, player]);

  const meIsLeader = useMemo(() => {
    return leader?.id === me?.id;
  }, [leader, me]);

  return (
    <div className=" w-[30rem] drop-shadow-md rounded-md overflow-hidden  z-10 bg-gradient-to-b from-shade-200 to-shade-300">
      <div className="px-5 py-8 flex justify-center items-center flex-col mb-8">
        <div className="text-3xl mb-5 w-full flex justify-center items-center">
          <Avatar
            background={true}
            circle
            size={60}
            seed={player.avatarSeed}
            className="mr-5"
          ></Avatar>

          {player.nickname}
        </div>
        {playerPatch && (
          <>
            <div className="flex items-center text-md justify-center mb-2 w-full">
              <Icon
                className="h-10 w-10 mr-4 fill-white"
                name={playerPatch.category.icon}
              ></Icon>

              {playerPatch.name}
            </div>
            <div className="flex justify-center items-center gap-2 w-full">
              <SpeakerXMarkIcon className="h-8 w-8" />
              <PlayerVolumeSlider player={player}></PlayerVolumeSlider>
              <SpeakerWaveIcon className="h-8 w-8" />
            </div>
          </>
        )}
      </div>

      {isMe && (
        <div
          className="px-5 py-4 cursor-pointer  bg-shade-200 hover:bg-primary-400 flex justify-start "
          onClick={openIdentityModal}
        >
          <HiOutlinePencil className="text-2xl mr-4"></HiOutlinePencil>{" "}
          {t("generic.edit_my_identity")}
        </div>
      )}
      {meIsLeader && !isMe && (
        <>
          <div
            className="px-5  py-4 cursor-pointer  bg-shade-200 hover:bg-primary-400  flex items-center justify-start"
            onClick={() => promoteGameLeader(player.id)}
          >
            <TbCrown className="text-2xl mr-4" />{" "}
            {t("generic.promote_game_leader")}
          </div>
          <div
            className="px-5 py-4 cursor-pointer text-red-300  bg-shade-200 hover:bg-primary-400 flex justify-start "
            onClick={() => kickPlayer(player.id)}
          >
            <RxExit className="text-2xl mr-4"></RxExit> {t("generic.kick")}
          </div>
        </>
      )}
    </div>
  );
}
