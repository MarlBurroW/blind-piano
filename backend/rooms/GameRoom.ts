import http from "http";
import { Room, Client, ServerError, updateLobby } from "colyseus";
import { object, string } from "yup";
import { Game } from "../schemas/Game";
import { Player } from "../schemas/Player";
import { Track } from "../schemas/Track";
import { IIdentity } from "../../common/types";
import kleur from "kleur";
import { v4 as uuidv4 } from "uuid";
import { colors } from "../../common/colors";
import Message from "../schemas/Message";

import { onChatMessageHandler } from "../handlers/onChatMessageHandler";
import { onUpdateIdentityHandler } from "../handlers/onUpdateIdentityHandler";
import { onAddTrackHandler } from "../handlers/onAddTrackHandler";
import { onSetPatchHandler } from "../handlers/onSetPatchHandler";
import { onNoteOnHandler } from "../handlers/onNoteOnHandler";
import { onNoteOffHandler } from "../handlers/onNoteOffHandler";
import { onKickPlayerHandler } from "../handlers/onKickPlayerHandler";
import { onPromoteGameLeaderHandler } from "../handlers/onPromoteGameLeaderHandler";
export class GameRoom extends Room<Game> {
  maxClients = 8;
  maxMessages = 20;
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

    const validatedOptions = await optionSchema.validate(options).catch(err => {
      throw new ServerError(422, err.message);
    });

    this.setMetadata({ name: validatedOptions.name });
    this.setMetadata({ visibility: validatedOptions.visibility });

    if (validatedOptions.visibility == "private") {
      this.setPrivate(true);
    }

    this.setState(new Game());

    if (validatedOptions.name) {
      this.state.name = validatedOptions.name;
    }

    this.onMessage("add-track", onAddTrackHandler.bind(this));
    this.onMessage("chat-message", onChatMessageHandler.bind(this));
    this.onMessage("update-identity", onUpdateIdentityHandler.bind(this));
    this.onMessage("set-patch", onSetPatchHandler.bind(this));
    this.onMessage("noteon", onNoteOnHandler.bind(this));
    this.onMessage("noteoff", onNoteOffHandler.bind(this));
    this.onMessage("kick-player", onKickPlayerHandler.bind(this));

    this.onMessage(
      "promote-game-leader",
      onPromoteGameLeaderHandler.bind(this)
    );
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
    player.color = identity.color;

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

  getAvailableColor() {
    // Randomize order

    for (let i = colors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colors[i], colors[j]] = [colors[j], colors[i]];
    }

    const usedColors = Array.from(this.state.players.values()).map(
      p => p.color
    );

    const availableColors = colors.filter(c => !usedColors.includes(c));

    if (availableColors.length > 0) {
      return availableColors[0];
    }

    return colors[0];
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
