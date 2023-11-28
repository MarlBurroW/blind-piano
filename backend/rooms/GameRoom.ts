import { Client, Room, ServerError } from "colyseus";
import http from "http";
import kleur from "kleur";
import { object, string } from "yup";

import { colors } from "../../common/colors";
import { IIdentity } from "../../common/types";
import { onAddTrackHandler } from "../handlers/onAddTrackHandler";
import { onChangeTracksOrder } from "../handlers/onChangeTracksOrder";
import { onChatMessageHandler } from "../handlers/onChatMessageHandler";
import { onKickPlayerHandler } from "../handlers/onKickPlayerHandler";
import { onNoteOffHandler } from "../handlers/onNoteOffHandler";
import { onNoteOnHandler } from "../handlers/onNoteOnHandler";
import { onPromoteGameLeaderHandler } from "../handlers/onPromoteGameLeaderHandler";
import { onRemoveTrackHandler } from "../handlers/onRemoveTrackHandler";
import { onTypingHandler } from "../handlers/onTypingHandler";
import { onUpdateIdentityHandler } from "../handlers/onUpdateIdentityHandler";
import { onUpdateTimeSignature } from "../handlers/onUpdateTimeSignature";
import { onUpdateTrack } from "../handlers/onUpdateTrack";
import { Game } from "../schemas/Game";
import { Player } from "../schemas/Player";

export class GameRoom extends Room<Game> {
  maxClients = 8;
  maxMessages = 20;
  autoDispose: false = false;
  emptyRoomTimeoutTime: number = 1000 * 5;
  emptyRoomTimeout: null | ReturnType<typeof setTimeout> = null;
  typingTimeout: Map<string, NodeJS.Timeout> = new Map();

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

    this.onMessage("update-track", onUpdateTrack.bind(this));
    this.onMessage("chat-message", onChatMessageHandler.bind(this));
    this.onMessage("update-identity", onUpdateIdentityHandler.bind(this));

    this.onMessage("noteon", onNoteOnHandler.bind(this));
    this.onMessage("noteoff", onNoteOffHandler.bind(this));
    this.onMessage("kick-player", onKickPlayerHandler.bind(this));
    this.onMessage("remove-track", onRemoveTrackHandler.bind(this));
    this.onMessage("add-track", onAddTrackHandler.bind(this));
    this.onMessage("change-tracks-order", onChangeTracksOrder.bind(this));
    this.onMessage("chat-typing", onTypingHandler.bind(this));
    this,
      this.onMessage("update-time-signature", onUpdateTimeSignature.bind(this));
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

      // Remove the leaving player from all tracks
      this.state.sequencer.tracks.forEach((track, trackId) => {
        if (track.playerId == player.id) {
          track.playerId = null;
          this.broadcast("track-removed", trackId);
        }
      });

      this.state.typing.delete(player.id);

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
