import { Avatar } from "./Avatar";
import { Player } from "../../../backend/schemas/Player";
import { useTranslation } from "react-i18next";
import { StarIcon } from "@heroicons/react/24/outline";
import { Popover, Transition } from "@headlessui/react";
import { Fragment, useContext } from "react";
import { Button } from "./form/Button";
import { useGameActions } from "../hooks/useGameActions";
import { TbCrown } from "react-icons/tb";
import { RxExit } from "react-icons/rx";
import { HiOutlinePencil } from "react-icons/hi";
import { GameContext } from "../components/context/GameContext";

interface Props {
  player: Player;
  className?: string;
  isMe: boolean;
  isLeader: boolean;
  meIsLeader: boolean;
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
  const { setState } = useContext(GameContext);

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

            <div className="w-full text-left">
              <div className="font-bold mb-1">{player.nickname}</div>

              <div className="flex gap-2">
                {isLeader && (
                  <div className="text-xs border-2 border-secondary-400 text-secondary-400 px-3 py-1 text-white rounded-md flex">
                    <TbCrown className="mr-2 text-lg" />
                    {t("generic.leader")}
                  </div>
                )}
              </div>
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
            <Popover.Panel className="absolute w-80 drop-shadow-md rounded-md overflow-hidden  z-10 top-0 -right-9 bg-gradient-to-b from-shade-200 to-shade-300 transform ">
              {isMe && (
                <div
                  className="px-5 py-4 cursor-pointer  hover:bg-primary-400 flex justify-start "
                  onClick={() =>
                    setState((draft) => {
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
                    className="px-5  py-4 cursor-pointer  hover:bg-primary-400  flex items-center justify-start"
                    onClick={() => promoteGameLeader(player.id)}
                  >
                    <TbCrown className="text-2xl mr-4" />{" "}
                    {t("generic.promote_game_leader")}
                  </div>
                  <div
                    className="px-5 py-4 cursor-pointer text-red-300  hover:bg-primary-400 flex justify-start "
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
