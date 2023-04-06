import { Schema, type } from "@colyseus/schema";

export class Track extends Schema {
  @type("string") id: string = "";
  @type("string") name: string = "";
  @type("string") patch: string = "";
}
export default Track;
