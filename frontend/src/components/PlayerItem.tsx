import { useAnimationControls } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TbCrown } from "react-icons/tb";
import { useOnClickOutside } from "usehooks-ts";

import { IPlayer, IPlayerNote } from "../../../common/types";
import { useMidiBus } from "../hooks/hooks";
import { Avatar } from "./Avatar";
import { PlayerProfileCard } from "./PlayerProfileCard";
import { Popover } from "./Popover";

interface Props {
  player: IPlayer;
  isMe: boolean;
  isLeader: boolean;
}

interface State {
  latestPlayedNotes: {
    [key: string]: IPlayerNote;
  };
}

export function PlayerItem({ player, isMe, isLeader }: Props) {
  const { t } = useTranslation();

  const midiBus = useMidiBus();

  const [isCardOpen, setIsCardOpen] = useState(false);

  const playerCardRef = useRef(null);

  const controls = useAnimationControls();

  const handleClickOutsidePlayerCard = useCallback(() => {
    setIsCardOpen(false);
  }, [playerCardRef.current, isCardOpen]);

  useOnClickOutside(playerCardRef, handleClickOutsidePlayerCard);

  useEffect(() => {
    function onNoteOn(note: IPlayerNote) {
      if (player.id == note.playerId) {
        controls.start({
          scale: [1, 1.05, 1],
          transition: { duration: 0.1 },
        });
      }
    }

    if (midiBus) {
      midiBus.on("noteon", onNoteOn);
    }

    return () => {
      if (midiBus) {
        midiBus.off("noteon", onNoteOn);
      }
    };
  }, [midiBus, player]);

  return (
    <Popover popoverContent={<PlayerProfileCard player={player} />}>
      {props => {
        const { setReference, getReferenceProps } = props;
        return (
          <div
            style={{
              borderColor: player.color,
            }}
            className={` ${
              isMe ? "border-primary-400" : ""
            } relative  p-3 flex w-full items-center  border-l-4 cursor-pointer bg-gradient-to-b from-shade-200 to-shade-300  rounded-3xl shadow-md`}
            ref={setReference}
            {...getReferenceProps()}
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
                  <div className="text-xs border-2 border-secondary-400 text-secondary-400 px-3 py-1 rounded-md flex">
                    <TbCrown className="mr-2 text-lg" />
                    {t("generic.leader")}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }}
    </Popover>
  );
}

export default PlayerItem;
