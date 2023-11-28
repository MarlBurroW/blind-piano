import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { Player } from "./Player";
import { Message } from "./Message";
import { Track } from "./Track";
import { getDefaultTracks } from "../utils/default-tracks";
import Sequencer from "./Sequencer";

export class Game extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type([Message]) messages = new ArraySchema<Message>();
  @type("string") leaderId = null;
  @type("string") name = "";

  @type(Sequencer) sequencer = new Sequencer();

  @type({ map: "boolean" }) typing = new MapSchema<boolean>();
}
