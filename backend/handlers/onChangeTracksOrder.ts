import { GameRoom } from "../rooms/GameRoom";

import { Client } from "colyseus";
import Track from "../schemas/Track";
import { MapSchema } from "@colyseus/schema";

export async function onChangeTracksOrder(
  this: GameRoom,
  client: Client,
  tracksIds: string[]
) {
  const player = this.state.players.get(client.sessionId);

  if (!player) {
    return;
  }

  const tracks = this.state.tracks;

  const reorderedTracks = new MapSchema<Track>();

  tracksIds.forEach(trackId => {
    const track = tracks.get(trackId);
    if (track) {
      reorderedTracks.set(trackId, track);
    }
  });

  this.state.tracks = reorderedTracks;
}
