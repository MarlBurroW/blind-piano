import { Schema, type } from "@colyseus/schema";
import { IIdentity, IInstrumentItem } from "../../frontend/src/types";

export class Player extends Schema implements IIdentity {
  @type("string") nickname: string;
  @type("string") avatarSeed: string;
  @type("string") id: string;
  @type("string") color: string;

  @type("string") instrument: string = "SFP@FluidR3_GM#acoustic_grand_piano";
}
export default Player;
