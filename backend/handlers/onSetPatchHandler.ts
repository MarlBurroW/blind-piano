import { GameRoom } from "../rooms/GameRoom";

import kleur from "kleur";
import { Client } from "colyseus";

export async function onSetPatchHandler(
  this: GameRoom,
  client: Client,
  instrumentIdentifier: string
) {
  const player = this.state.players.get(client.sessionId);

  if (player) {
    player.patch = instrumentIdentifier;

    this.log(kleur.bold().cyan(`Patch: ${player.patch}`), {
      player,
    });
  }
}
