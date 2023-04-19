import { GameRoom } from "../rooms/GameRoom";

import kleur from "kleur";
import { Client } from "colyseus";
import { IPlayerNote } from "../../common/types";

export async function onTypingHandler(this: GameRoom, client: Client) {
  const existingTimeout = this.typingTimeout.get(client.sessionId);

  if (existingTimeout) {
    clearTimeout(existingTimeout);
  }

  this.state.typing.set(client.sessionId, true);

  const timeout = setTimeout(() => {
    this.state.typing.set(client.sessionId, false);
    clearTimeout(timeout);
  }, 2000);

  this.typingTimeout.set(client.sessionId, timeout);
}
