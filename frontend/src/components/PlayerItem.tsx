import { Avatar } from "./Avatar";
import { Player } from "../../../backend/schemas/Player";
import { useTranslation } from "react-i18next";
import { IPlayerNote } from "../types";

import { Popover, Transition } from "@headlessui/react";
import { Fragment, useContext, useEffect, useMemo, useCallback } from "react";

import { useGameActions } from "../hooks/useGameActions";
import { TbCrown } from "react-icons/tb";
import { RxExit } from "react-icons/rx";
import { HiOutlinePencil } from "react-icons/hi";
import { GameContext } from "../components/context/GameContext";
import { AudioContext } from "../components/context/AudioContext";
import { NoteBubbleEmitter } from "./NoteBubbleEmitter";

import { PlayerVolumeSlider } from "./PlayerVolumeSlider";
import {
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/outline";
interface Props {
  player: Player;
  className?: string;
  isMe: boolean;
  isLeader: boolean;
  meIsLeader: boolean;
}

interface State {
  latestPlayedNotes: {
    [key: string]: IPlayerNote;
  };
}

export function PlayerItem({
  player,
  className,
  isMe,
  isLeader,
  meIsLeader,
}: Props) {
  const { t } = useTranslation();
  const { kickPlayer, promoteGameLeader } = useGameActions();
  const { setState: setGameState } = useContext(GameContext);
  const { playersInstruments } = useContext(AudioContext);

  const playerInstrument = useMemo(() => {
    return playersInstruments[player.id];
  }, [playersInstruments[player.id], player]);

  return (
    <Popover className={`${className} relative w-full`}>
      {({ open }) => (
        <>
          <Popover.Button
            style={{ borderColor: player.color }}
            className={` ${
              isMe ? "border-primary-400" : ""
            } p-3 flex w-full items-center relative ${
              open ? "ring-4 ring-primary-400 " : ""
            } border-l-4 cursor-pointer bg-gradient-to-b from-shade-200 to-shade-300  rounded-3xl shadow-md`}
          >
            <Avatar
              background={true}
              circle
              size={60}
              seed={player.avatarSeed}
              className="mr-4"
            ></Avatar>

            {isMe && (
              <div className="absolute top-0 right-0 overflow-hidden rounded-tr-3xl rounded-bl-3xl flex">
                {isMe && (
                  <div className="text-xs   bg-secondary-400  py-1 uppercase px-8 text-white ">
                    {t("generic.you")}
                  </div>
                )}
              </div>
            )}

            <div className="w-full text-left ">
              <div className="font-bold mb-1">{player.nickname}</div>

              <div className="flex gap-2">
                {isLeader && (
                  <div className="text-xs border-2 border-secondary-400 text-secondary-400 px-3 py-1 text-white rounded-md flex">
                    <TbCrown className="mr-2 text-lg" />
                    {t("generic.leader")}
                  </div>
                )}
              </div>

              <NoteBubbleEmitter player={player} />
            </div>
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-0 opacity-0  translate-x-0"
            enterTo="transform scale-100 opacity-100 translate-x-full"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100 translate-x-full"
            leaveTo="transform scale-0 opacity-0 translate-x-0"
          >
            <Popover.Panel className="absolute w-[30rem] drop-shadow-md rounded-md overflow-hidden  z-10 top-0 -right-9 bg-gradient-to-b from-shade-200 to-shade-300 transform ">
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
                {playerInstrument && (
                  <>
                    <div className="flex items-center text-md justify-center mb-2 w-full">
                      <MusicalNoteIcon className="h-6 w-6 mr-2" />
                      {playerInstrument.getName()}
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
                  onClick={() =>
                    setGameState((draft) => {
                      draft.isIdentityModalOpen = true;
                    })
                  }
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
                    <RxExit className="text-2xl mr-4"></RxExit>{" "}
                    {t("generic.kick")}
                  </div>
                </>
              )}
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
export default PlayerItem;
