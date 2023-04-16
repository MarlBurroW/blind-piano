import { GameRoom } from "../rooms/GameRoom";
import { string, object } from "yup";

import kleur from "kleur";
import { Client } from "colyseus";
import { ITrack } from "../../common/types";
import { Track } from "../schemas/Track";
import { v4 as uuidv4 } from "uuid";

export async function onUpdateTrack(
  this: GameRoom,
  client: Client,
  track: ITrack
) {
  const player = this.state.players.get(client.sessionId);

  const trackSchema = object({
    id: string().required().uuid(),
    name: string().min(1).max(32).trim(),
    patch: string().min(1).max(64).trim(),
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

  const existingTrack = this.state.tracks.get(track.id);

  if (!existingTrack) {
    return;
  }

  if (track.playerId !== undefined) {
    existingTrack.playerId = track.playerId;

    if (track.playerId !== null) {
      const assignablePlayer = this.state.players.get(track.playerId);

      // Remove player from other tracks

      if (assignablePlayer) {
        this.state.tracks.forEach(track => {
          if (
            track.playerId === assignablePlayer.id &&
            track.id !== existingTrack.id
          ) {
            track.playerId = null;
          }
        });
      }
    }
  }

  if (track.patch !== undefined) {
    existingTrack.patch = track.patch;
  }

  if (track.name !== undefined) {
    existingTrack.name = track.name;
  }
}
