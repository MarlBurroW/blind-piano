import chroma from "chroma-js";

import { IMessage, IPlayer } from "../../../common/types";
import { Avatar } from "./Avatar";

export function ChatMessage({
  message,
  me,
}: {
  message: IMessage;
  me?: IPlayer | null;
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
        style={{
          backgroundColor: message.player
            ? chroma(message.player.color).alpha(0.6).css()
            : undefined,
        }}
        className={`p-3  items-start rounded-2xl flex flex-col`}
      >
        <div className={`font-normal`}>{message.player?.nickname}</div>
        <div className="whitespace-pre-wrap font-light  overflow-hidden break-all">
          {message.message}
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
