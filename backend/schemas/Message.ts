import { Schema, type } from "@colyseus/schema";
import { Player } from "./Player";

export class Message extends Schema {
  @type("string") message: string;
  @type(Player) player?: Player;
  @type("string") id: string;
}
export default Message;
