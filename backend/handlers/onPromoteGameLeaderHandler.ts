import { GameRoom } from "../rooms/GameRoom";

import kleur from "kleur";
import { Client } from "colyseus";

export async function onPromoteGameLeaderHandler(
  this: GameRoom,
  client: Client,
  playerId: any
) {
  const player = this.state.players.get(playerId);
  const author = this.state.players.get(client.sessionId);
  const leader = this.getLeader();

  if (player && leader && author && leader.id == author.id) {
    this.state.leaderId = playerId;
    this.broadcast("new-leader", player);

    this.log(
      kleur.yellow(
        `Player ${player.nickname} promoted to leader by ${author.nickname}`
      ),
      { player: author }
    );
  }
}
