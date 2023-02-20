import { IMessage } from "../types";
import { Avatar } from "./Avatar";

export function ChatMessage({ message }: { message: IMessage }) {
  return (
    <div className="p-3  bg-base-100 dark:bg-base-800 dark:bg-opacity-40 text-left mb-4 items-start rounded-lg flex">
      {message.player ? (
        <Avatar
          seed={message.player.avatarSeed}
          size={40}
          className="mr-3"
        ></Avatar>
      ) : null}
      <div>
        <div className="font-bold">{message.player?.nickname}</div>
        <div className="whitespace-pre-wrap dark:text-base-400 text-base-500 overflow-hidden break-all">
          {message.message}
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
