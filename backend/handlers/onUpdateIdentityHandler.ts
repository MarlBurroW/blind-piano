import { GameRoom } from "../rooms/GameRoom";
import { string, object } from "yup";

import kleur from "kleur";
import { Client } from "colyseus";
import { IIdentity } from "../../common/types";
import { colors } from "../../common/colors";

export async function onUpdateIdentityHandler(
  this: GameRoom,
  client: Client,
  identity: IIdentity
) {
  const player = this.state.players.get(client.sessionId);

  const availableColors = colors.filter(color => {
    return !Array.from(this.state.players.values())
      .filter(p => p.id !== player?.id)
      .some(player => {
        return player.color === color;
      });
  });

  const identitySchema = object({
    nickname: string().required().min(3).max(32).trim(),
    avatarSeed: string().required().uuid(),
    color: string().required().oneOf(availableColors),
  });

  try {
    await identitySchema.validate(identity);
  } catch (err) {
    return;
  }

  // If the player doesn't exist, create it with the provided identity
  if (!player) {
    const newPlayer = this.createPlayerFromIdentity(identity, client);
    this.broadcastPatch();
    this.broadcast("player-joined", newPlayer, { except: client });

    this.log(kleur.green(`Player ${newPlayer.nickname} joined the game`), {
      player: newPlayer,
    });

    // If the player exists, update his identity
  } else {
    player.assign({
      nickname: identity.nickname,
      avatarSeed: identity.avatarSeed,
      color: identity.color,
    });

    this.log(kleur.green(`Player ${player.nickname} updated his identity`), {
      player,
    });
  }

  this.electNewLeaderIfNecessary();
}
