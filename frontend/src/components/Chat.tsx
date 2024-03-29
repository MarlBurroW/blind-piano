import { AnimateSharedLayout, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineSend } from "react-icons/ai";
import TextareaAutosize from "react-textarea-autosize";

import { useChat, useMe } from "../hooks/hooks";
import { ChatMessage } from "./ChatMessage";
import { PlayersTyping } from "./PlayersTyping";

export function Chat() {
  const me = useMe();
  const { messages, sendMessage: sendChatMessage, sendTyping } = useChat();
  const { t } = useTranslation();
  const { playersTyping } = useChat();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scroll({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages[messages.length - 1]?.id, playersTyping.length]);

  const sendMessage = useCallback(() => {
    if (message.length === 0) return;
    sendChatMessage(message);
    setMessage("");
  }, [message]);

  const onEnterPress = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();

        if (message.length === 0) return;

        sendMessage();
      }
    },
    [message]
  );

  return (
    <>
      <div
        ref={scrollRef}
        className="overflow-y-scroll overflow-x-hidden h-full  bg-gradient-to-b from-shade-600 to-shade-700   p-4"
      >
        <AnimateSharedLayout>
          {messages.map(message => (
            <motion.div
              layout
              key={message.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
            >
              <ChatMessage me={me ? me : null} message={message}></ChatMessage>
            </motion.div>
          ))}
          <PlayersTyping></PlayersTyping>
        </AnimateSharedLayout>
      </div>
      <div className="shrink">
        <div className="flex">
          <TextareaAutosize
            value={message}
            onChange={e => {
              setMessage(e.target.value);
              sendTyping();
            }}
            maxRows={4}
            onKeyDown={onEnterPress}
            placeholder={t("chat.input_placeholder")}
            className="resize-none  w-full bg-shade-200  py-4 px-5 outline-none   focus:outline-none  rounded-bl-3xl "
          ></TextareaAutosize>

          <button
            className="px-5 py-4 transition-all bg-gradient-to-b from-primary-400 via-primary-500 to-primary-600 rounded-br-3xl duration-300  bg-size-200 bg-pos-0 hover:bg-pos-100`"
            onClick={sendMessage}
          >
            <AiOutlineSend className="text-2xl" />
          </button>
        </div>
      </div>
    </>
  );
}

export default Chat;
