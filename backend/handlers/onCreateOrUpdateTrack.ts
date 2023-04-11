import { GameRoom } from "../rooms/GameRoom";
import { string, object } from "yup";

import kleur from "kleur";
import { Client } from "colyseus";
import { ITrack } from "../../common/types";
import { Track } from "../schemas/Track";
import { v4 as uuidv4 } from "uuid";

export async function onCreateOrUpdateTrack(
  this: GameRoom,
  client: Client,
  track: ITrack
) {
  const player = this.state.players.get(client.sessionId);

  const trackSchema = object({
    id: string().nullable().uuid(),
    name: string().required().min(1).max(32).trim(),
    patch: string().required().min(1).max(64).trim(),
    playerId: string().nullable(),
  });

  try {
    await trackSchema.validate(track);
  } catch (err) {
    return;
  }

  if (!player) {
    return;
  }

  const existingTrack = track.id ? this.state.tracks.get(track.id) : null;
  const trackToCreateOrUpdate = existingTrack ? existingTrack : new Track();

  if (!existingTrack) {
    trackToCreateOrUpdate.id = uuidv4();
  }

  trackToCreateOrUpdate.name = track.name;
  trackToCreateOrUpdate.patch = track.patch;
  trackToCreateOrUpdate.playerId = track.playerId;

  this.state.tracks.set(trackToCreateOrUpdate.id, trackToCreateOrUpdate);
}
