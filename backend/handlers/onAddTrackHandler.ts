import { Client } from "colyseus";
import { v4 as uuidv4 } from "uuid";

import { GameRoom } from "../rooms/GameRoom";
import { Track } from "../schemas/Track";

export async function onAddTrackHandler(this: GameRoom, client: Client) {
  const player = this.state.players.get(client.sessionId);
  const tracksLength = this.state.sequencer.tracks.size;

  if (!player) {
    return;
  }
  const track = new Track();

  track.id = uuidv4();
  track.name = `Track ${tracksLength + 1}`;
  track.patch = "SFP@FluidR3_GM#acoustic_grand_piano";
  track.playerId = null;

  this.state.sequencer.tracks.set(track.id, track);
}
