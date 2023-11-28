import { MapSchema } from "@colyseus/schema";
import { Client } from "colyseus";

import { GameRoom } from "../rooms/GameRoom";
import Track from "../schemas/Track";

export async function onChangeTracksOrder(
  this: GameRoom,
  client: Client,
  tracksIds: string[]
) {
  const player = this.state.players.get(client.sessionId);

  if (!player) {
    return;
  }

  const tracks = this.state.sequencer.tracks;

  const reorderedTracks = new MapSchema<Track>();

  tracksIds.forEach(trackId => {
    const track = tracks.get(trackId);
    if (track) {
      reorderedTracks.set(trackId, track);
    }
  });

  this.state.sequencer.tracks = reorderedTracks;
}
