import { GameRoom } from "../rooms/GameRoom";

import { Client } from "colyseus";

import { Track } from "../schemas/Track";
import { v4 as uuidv4 } from "uuid";

export async function onAddTrackHandler(this: GameRoom, client: Client) {
  const player = this.state.players.get(client.sessionId);
  const tracksLength = this.state.tracks.size;

  if (!player) {
    return;
  }
  const track = new Track();

  track.id = uuidv4();
  track.name = `Track ${tracksLength + 1}`;
  track.patch = "SFP@FluidR3_GM#acoustic_grand_piano";
  track.playerId = player.id;

  this.state.tracks.set(track.id, track);
}
