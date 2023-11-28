import { Client } from "colyseus";
import kleur from "kleur";
import { v4 as uuidv4 } from "uuid";
import { object, string } from "yup";

import { ITrack } from "../../common/types";
import { GameRoom } from "../rooms/GameRoom";
import { Track } from "../schemas/Track";

export async function onRemoveTrackHandler(
  this: GameRoom,
  client: Client,
  trackId: string
) {
  const player = this.state.players.get(client.sessionId);
  const track = this.state.sequencer.tracks.get(trackId);

  if (!player || !track) {
    return;
  }

  this.state.sequencer.tracks.delete(trackId);
}
