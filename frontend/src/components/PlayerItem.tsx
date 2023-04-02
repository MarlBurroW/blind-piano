import { Avatar } from "./Avatar";
import { Player } from "../../../backend/schemas/Player";
import { useTranslation } from "react-i18next";
import { IPlayerNote } from "../../../common/types";

import { useEffect, useState, useRef, useCallback } from "react";

import { TbCrown } from "react-icons/tb";

import { NoteBubbleEmitter } from "./NoteBubbleEmitter";
import { useMidiBus } from "../hooks/hooks";

import { useAnimationControls, motion, AnimatePresence } from "framer-motion";
import { PlayerProfileCard } from "./PlayerProfileCard";

import { useOnClickOutside } from "usehooks-ts";

interface Props {
  player: Player;
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
    <div className="relative" ref={playerCardRef}>
      <motion.div
        animate={controls}
        onClick={() => setIsCardOpen(!isCardOpen)}
        style={{
          borderColor: player.color,
        }}
        className={` ${isMe ? "border-primary-400" : ""}  ${
          isCardOpen ? "ring-4 ring-primary-400 " : ""
        } p-3 flex w-full items-center relative border-l-4 cursor-pointer bg-gradient-to-b from-shade-200 to-shade-300  rounded-3xl shadow-md`}
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
      </motion.div>
      <AnimatePresence>
        {isCardOpen && (
          <motion.div
            className="absolute top-0 left-[105%] z-10"
            transition={{ duration: 0.2 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <PlayerProfileCard player={player} />
          </motion.div>
        )}
      </AnimatePresence>
      <NoteBubbleEmitter player={player} />
    </div>
  );
}
export default PlayerItem;
