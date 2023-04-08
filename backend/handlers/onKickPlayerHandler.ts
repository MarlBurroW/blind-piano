import { GameRoom } from "../rooms/GameRoom";

import kleur from "kleur";
import { Client } from "colyseus";

export async function onKickPlayerHandler(
  this: GameRoom,
  client: Client,
  playerId: string
) {
  const player = this.state.players.get(playerId);
  const author = this.state.players.get(client.sessionId);
  const leader = this.getLeader();

  if (player && leader && author && leader.id == author.id) {
    this.state.players.delete(playerId);
    this.broadcast("player-kicked", player);

    // Get the kicked player client and close it
    const kickedPlayerClient = this.clients.find(c => c.sessionId == playerId);
    if (kickedPlayerClient) {
      kickedPlayerClient.leave();
    }

    this.log(
      kleur.red(`Player ${player.nickname} kicked by ${author.nickname}`),
      { player: author }
    );
  }
}
