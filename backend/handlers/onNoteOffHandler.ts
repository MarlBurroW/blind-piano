import { GameRoom } from "../rooms/GameRoom";

import kleur from "kleur";
import { Client } from "colyseus";
import { IPlayerNote } from "../../common/types";

export async function onNoteOffHandler(
  this: GameRoom,
  client: Client,
  note: IPlayerNote
) {
  const player = this.state.players.get(client.sessionId);

  if (player) {
    note.playerId = player.id;
    note.color = player.color;
    this.broadcast("noteoff", note, { except: client });
  }

  this.log(kleur.bold().cyan(`Note Off: ${note.number}`), { player });
}
