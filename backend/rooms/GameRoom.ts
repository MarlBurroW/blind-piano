import http from "http";
import { Room, Client, ServerError, updateLobby } from "colyseus";
import { object, string } from "yup";
import { Game } from "../schemas/Game";
import { Player } from "../schemas/Player";
import { IIdentity } from "../types";
import kleur from "kleur";
import { v4 as uuidv4 } from "uuid";

export class GameRoom extends Room<Game> {
  maxClients = 8;
  autoDispose: false = false;
  emptyRoomTimeoutTime: number = 1000 * 5;
  emptyRoomTimeout: null | ReturnType<typeof setTimeout> = null;

  async onCreate(options: any) {
    const optionSchema = object({
      name: string().required().min(3).max(32).trim(),
      visibility: string()
        .required()
        .matches(/^(public|private)$/),
    });

    const validatedOptions = await optionSchema
      .validate(options)
      .catch((err) => {
        throw new ServerError(422, err.message);
      });

    this.setMetadata({ name: validatedOptions.name });
    this.setMetadata({ visibility: validatedOptions.visibility });

    if (validatedOptions.visibility == "private") {
      this.setPrivate(true);
    }

    this.setState(new Game());

    this.onMessage("chat-message", async (client, message) => {
      const player = this.state.players.get(client.sessionId);

      const messageSchema = string().required().min(1).max(1024).trim();

      try {
        await messageSchema.validate(message);
      } catch (err) {
        return;
      }

      if (!player) {
        return;
      }

      this.broadcast("chat-message", {
        id: uuidv4(),
        message,
        player,
      });

      this.log(kleur.bold().magenta(`Message: ${message}`), {
        player,
      });
    });

    this.onMessage("update-identity", async (client, identity) => {
      const identitySchema = object({
        nickname: string().required().min(3).max(32).trim(),
        avatarSeed: string().required().uuid(),
      });

      try {
        await identitySchema.validate(identity);
      } catch (err) {
        return;
      }

      const player = this.state.players.get(client.sessionId);

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
        });

        this.log(
          kleur.green(`Player ${player.nickname} updated his identity`),
          {
            player,
          }
        );
      }

      this.electNewLeaderIfNecessary();
    });

    this.onMessage("kick-player", (client, playerId) => {
      const player = this.state.players.get(playerId);
      const author = this.state.players.get(client.sessionId);
      const leader = this.getLeader();

      if (player && leader && author && leader.id == author.id) {
        this.state.players.delete(playerId);
        this.broadcast("player-kicked", player);

        // Get the kicked player client and close it
        const kickedPlayerClient = this.clients.find(
          (c) => c.sessionId == playerId
        );
        if (kickedPlayerClient) {
          kickedPlayerClient.leave();
        }

        this.log(
          kleur.red(`Player ${player.nickname} kicked by ${author.nickname}`),
          { player: author }
        );
      }
    });

    this.onMessage("promote-game-leader", (client, playerId) => {
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
    });
  }

  hasLeader() {
    return !!this.getLeader();
  }

  getLeader() {
    if (this.state.leaderId) {
      return this.state.players.get(this.state.leaderId);
    }
    return null;
  }

  electNewLeaderIfNecessary() {
    if (!this.hasLeader()) {
      const firstPlayer = this.state.players.values().next().value;

      if (firstPlayer) {
        this.log(kleur.yellow("New leader elected"), { player: firstPlayer });
        this.state.leaderId = firstPlayer.id;

        this.broadcast("new-leader", firstPlayer);
      } else {
        this.state.leaderId = null;
      }
    }
  }

  createPlayerFromIdentity(identity: IIdentity, client: Client) {
    const player = new Player();
    player.nickname = identity.nickname;
    player.avatarSeed = identity.avatarSeed;
    player.id = client.sessionId;

    this.state.players.set(client.sessionId, player);

    return player;
  }

  // Authorize client based on provided options before WebSocket handshake is complete
  onAuth(client: Client, options: any, request: http.IncomingMessage) {
    return true;
  }

  // When client successfully join the room
  onJoin(client: Client, options: any, auth: any) {
    if (this.emptyRoomTimeout) {
      this.log("Room not empty, clearing dispose timeout");

      clearTimeout(this.emptyRoomTimeout);
    }
    this.log(kleur.green("Client joined"), { client });
  }

  // When a client leaves the room
  onLeave(client: Client, consented: boolean) {
    const player = this.state.players.get(client.sessionId);

    if (player) {
      this.state.players.delete(client.sessionId);
      this.broadcast("player-left", player, { except: client });
      this.electNewLeaderIfNecessary();
      this.log(kleur.red("Player left"), { player });
    } else {
      this.log(kleur.red("Client left"), { client });
    }

    if (this.clients.length == 0) {
      this.log(
        kleur.yellow(
          `Room empty, dispose timeout started (${this.emptyRoomTimeoutTime}ms)`
        )
      );
      this.emptyRoomTimeout = setTimeout(() => {
        this.log(kleur.yellow(`Empty timeout reached`));
        if (this.emptyRoomTimeout) {
          clearTimeout(this.emptyRoomTimeout);
        }
        this.disconnect();
      }, this.emptyRoomTimeoutTime);
    }
  }

  log(
    message: string,
    { client, player }: { client?: Client; player?: Player } = {}
  ) {
    const clientInfo = player
      ? `${player.nickname}`
      : client
      ? `${client.sessionId}`
      : "";

    console.log(
      `[${kleur.yellow(this.metadata.name)}]${kleur.blue(
        `${clientInfo ? `[${clientInfo}]` : ""}`
      )}`,

      message
    );
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose() {
    if (this.emptyRoomTimeout) {
      clearTimeout(this.emptyRoomTimeout);
    }

    this.log(kleur.red("Disposing room"));
  }
}
export default GameRoom;
