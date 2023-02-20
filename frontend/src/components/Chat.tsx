import TextareaAutosize from "react-textarea-autosize";
import { useCallback, useState, useContext, useEffect, useRef } from "react";
import { useGameActions } from "../hooks/useGameActions";
import { GameContext } from "../components/context/GameContext";

import { ChatMessage } from "./ChatMessage";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function Chat() {
  const [message, setMessage] = useState<string>("");

  const { sendChatMessage } = useGameActions();
  const { messages } = useContext(GameContext);
  const { t } = useTranslation();

  const scrollRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scroll({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const onEnterPress = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();

        if (message.length === 0) return;

        console.log("Enter pressed");
        sendChatMessage(message);
        setMessage("");
      }
    },
    [message]
  );

  return (
    <>
      <div
        ref={scrollRef}
        className="overflow-y-scroll h-full dark:bg-base-900 bg-base-300 mb-5 rounded-lg p-4"
      >
        <AnimateSharedLayout mode="wait">
          {messages.map((message) => (
            <motion.div
              layout
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <ChatMessage message={message}></ChatMessage>
            </motion.div>
          ))}
        </AnimateSharedLayout>
      </div>
      <div className="shrink">
        <TextareaAutosize
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxRows={4}
          onKeyDown={onEnterPress}
          placeholder={t("chat.input_placeholder")}
          className="resize-none w-full bg-base-100 dark:ring-primary-500  dark:bg-base-700 py-3 px-5 outline-none ring-primary-700 focus:outline-none focus:ring rounded-lg"
        ></TextareaAutosize>
      </div>
    </>
  );
}

export default Chat;
