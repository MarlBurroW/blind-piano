import { Schema, type } from "@colyseus/schema";
import {getDefaultTracks} from "../utils/default-tracks";
import Track from "./Track";
import { TimeSignature } from "../../common/types";

export class Sequencer extends Schema {
  @type("string") timeSignature: TimeSignature = "4/4";
  @type({ map: Track }) tracks = getDefaultTracks();

}
export default Sequencer;
