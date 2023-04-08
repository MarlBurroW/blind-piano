import { GameRoom } from "../rooms/GameRoom";
import { string, object } from "yup";

import kleur from "kleur";
import { Client } from "colyseus";
import { ITrack } from "../../common/types";
import { Track } from "../schemas/Track";
import { v4 as uuidv4 } from "uuid";

export async function onAddTrackHandler(
  this: GameRoom,
  client: Client,
  track: ITrack
) {
  const player = this.state.players.get(client.sessionId);

  const trackSchema = object({
    name: string().required().min(1).max(32).trim(),
    patch: string().required().min(1).max(64).trim(),
    playerId: string().nullable(),
  });

  try {
    await trackSchema.validate(track);
  } catch (err) {
    console.log(err);

    return;
  }

  if (!player) {
    return;
  }

  const newTrack = new Track();

  newTrack.name = track.name;
  newTrack.patch = track.patch;
  newTrack.playerId = track.playerId;
  newTrack.id = uuidv4();

  this.state.tracks.push(newTrack);

  this.log(kleur.bold().magenta(`Track: ${newTrack.name}`), {
    player,
  });
}
