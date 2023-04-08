import { Schema, type } from "@colyseus/schema";

export class Track extends Schema {
  @type("string") id: string = "";
  @type("string") name: string = "";
  @type("string") patch: string = "";
  @type("string") playerId: string | null = null;
}
export default Track;
