import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import { useMemo } from "react";

import { useChat, useMe, usePlayersMap } from "../hooks/hooks";
import Avatar from "./Avatar";

export function PlayersTyping() {
  const { playersTyping } = useChat();

  const isPlayerTyping = playersTyping.length > 0;

  return (
    <AnimatePresence>
      {isPlayerTyping && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center "
        >
          <>
            <div className="flex items-center mr-4 gap-2">
              <AnimatePresence>
                {playersTyping.map(player => {
                  return (
                    <motion.div
                      initial={{ scale: 0 }}
                      key={player.id}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      style={{
                        borderColor: player.color,
                      }}
                      className="rounded-full border-4"
                    >
                      <Avatar
                        size={32}
                        seed={player.avatarSeed}
                        background
                        circle
                      ></Avatar>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            <div className="dots flex items-center gap-2">
              <div className="dot h-4 w-4 rounded-full bg-primary-200"></div>
              <div className="dot h-4 w-4 rounded-full bg-primary-200"></div>
              <div className="dot h-4 w-4 rounded-full bg-primary-200"></div>
            </div>
          </>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
