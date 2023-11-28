import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { useCopyToClipboard } from "usehooks-ts";

import { IIdentity } from "../../../common/types";
import {
  useGameRoom,
  useIdentityModalControl,
  usePlayers,
  useUIControl,
} from "../hooks/hooks";
import Avatar from "./Avatar";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Panel } from "./Panel";
import { PlayerProfileCard } from "./PlayerProfileCard";
import { Popover } from "./Popover";
import Button from "./form/Button";

export function MenuBar() {
  const gameRoom = useGameRoom();

  const [value, copy] = useCopyToClipboard();
  const players = usePlayers();
  const { t } = useTranslation();
  const { setIsChatPanelOpen, isChatPanelOpen } = useUIControl();

  const handleInviteFriends = useCallback(() => {
    toast.success(t("notification_messages.link_copied"));
    copy(window.location.href);
  }, [copy]);

  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  const isChatPanelOpenRef = useRef(isChatPanelOpen);

  useEffect(() => {
    isChatPanelOpenRef.current = isChatPanelOpen;

    if (isChatPanelOpen) {
      setHasUnreadMessages(false);
    }
  }, [isChatPanelOpen]);

  useEffect(() => {
    const unbind = gameRoom?.onMessage("chat-message", (message: string) => {
      if (isChatPanelOpenRef.current) return;
      setHasUnreadMessages(true);
    });

    return () => {
      if (unbind) {
        unbind();
      }
    };
  }, [gameRoom]);

  return (
    <Panel className="flex justify-between items-center mb-4">
      <div className="mr-6">
        <LanguageSwitcher></LanguageSwitcher>
      </div>
      <div>
        <span className="font-bold mr-4">
          {gameRoom ? gameRoom.state.name : ""}{" "}
        </span>

        <Button onClick={handleInviteFriends} size="sm" style="primary">
          {t("generic.invite_friends")}
        </Button>
      </div>

      <div className="flex items-center">
        <div className="flex mr-4 items-center">
          {players.map(player => (
            <Popover
              placement="bottom"
              key={player.id}
              popoverContent={<PlayerProfileCard player={player} />}
            >
              {props => {
                const { setReference, getReferenceProps } = props;
                return (
                  <div
                    ref={setReference}
                    {...getReferenceProps()}
                    key={player.id}
                    style={{ borderColor: player.color }}
                    className="cursor-pointer flex items-center border-4 rounded-full mr-2"
                  >
                    <Avatar
                      seed={player.avatarSeed}
                      size={32}
                      background
                      circle
                    ></Avatar>
                  </div>
                );
              }}
            </Popover>
          ))}
        </div>

        <div className="relative">
          <HiOutlineChatBubbleLeftRight
            className="h-8 w-8 cursor-pointer"
            onClick={() => setIsChatPanelOpen(!isChatPanelOpen)}
          />
          <AnimatePresence>
            {hasUnreadMessages && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                key="unread-messages"
                className="bg-red-500 absolute h-4 w-4 rounded-full -top-1 -right-2"
              ></motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Panel>
  );
}
