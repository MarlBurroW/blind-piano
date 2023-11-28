import { Client } from "colyseus";
import { string } from "yup";

import { TimeSignature } from "../../common/types";
import { GameRoom } from "../rooms/GameRoom";

export async function onUpdateTimeSignature(
  this: GameRoom,
  client: Client,
  timeSignature: TimeSignature
) {
  const player = this.state.players.get(client.sessionId);

  if (!player) {
    return;
  }

  const signatureValidation = string()
    .required()
    .oneOf(["3/4", "4/4", "5/4", "6/8", "7/8", "12/8"]);

  try {
    await signatureValidation.validate(timeSignature);
  } catch (err) {
    return;
  }

  this.state.sequencer.timeSignature = timeSignature;
}
