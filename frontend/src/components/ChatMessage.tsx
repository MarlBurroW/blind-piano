import { Message } from "../../../backend/schemas/Message";
import { Player } from "../../../backend/schemas/Player";

import { Avatar } from "./Avatar";

export function ChatMessage({
  message,
  me,
}: {
  message: Message;
  me?: Player | null;
}) {
  const isMe = me?.id === message.player?.id;

  return (
    <div className={`flex mb-4 items-start ${isMe ? "flex-row-reverse" : ""}`}>
      {message.player ? (
        <Avatar
          background={true}
          circle
          seed={message.player.avatarSeed}
          size={40}
          className={isMe ? "ml-3" : "mr-3"}
        ></Avatar>
      ) : null}
      <div
        className={`p-3 ${
          isMe
            ? "text-left  bg-gradient-to-b from-primary-400 to-primary-500  "
            : "text-left  bg-gradient-to-b from-shade-300 to-shade-400 "
        }  items-start rounded-2xl flex flex-col`}
      >
        <div className={`font-bold`}>{message.player?.nickname}</div>
        <div className="whitespace-pre-wrap font-thin text-white text-opacity-70 overflow-hidden break-all">
          {message.message}
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
