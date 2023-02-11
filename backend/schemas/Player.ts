import { Schema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") nickname: string;
  @type("string") avatarSeed: string;
  @type("string") id: string;
}
export default Player;
