import { Client } from "colyseus";
import kleur from "kleur";
import { v4 as uuidv4 } from "uuid";
import { object, string } from "yup";

import { ITrack } from "../../common/types";
import { GameRoom } from "../rooms/GameRoom";
import { Track } from "../schemas/Track";

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

  const existingTrack = this.state.sequencer.tracks.get(track.id);

  if (!existingTrack) {
    return;
  }

  if (track.playerId !== undefined) {
    existingTrack.playerId = track.playerId;

    if (track.playerId !== null) {
      const assignablePlayer = this.state.players.get(track.playerId);

      // Remove player from other tracks

      if (assignablePlayer) {
        this.state.sequencer.tracks.forEach(track => {
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
