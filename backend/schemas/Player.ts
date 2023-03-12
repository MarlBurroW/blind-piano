import { Schema, type } from "@colyseus/schema";
import { IIdentity } from "../types";

export class Player extends Schema implements IIdentity {
  @type("string") nickname: string;
  @type("string") avatarSeed: string;
  @type("string") id: string;
  @type("string") color: string;
}
export default Player;
