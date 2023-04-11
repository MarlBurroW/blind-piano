import { GameRoom } from "../rooms/GameRoom";
import { string, object } from "yup";

import kleur from "kleur";
import { Client } from "colyseus";
import { ITrack } from "../../common/types";
import { Track } from "../schemas/Track";
import { v4 as uuidv4 } from "uuid";

export async function onRemoveTrackHandler(
  this: GameRoom,
  client: Client,
  trackId: string
) {
  const player = this.state.players.get(client.sessionId);
  const track = this.state.tracks.get(trackId);

  if (!player || !track) {
    return;
  }

  this.state.tracks.delete(trackId);
}
