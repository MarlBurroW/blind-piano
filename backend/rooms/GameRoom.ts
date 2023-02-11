import http from "http";
import { Room, Client, ServerError, updateLobby } from "colyseus";
import { object, string } from "yup";
import { Game } from "../schemas/Game";
import { Player } from "../schemas/Player";
import { IIdentity } from "../types";

export class GameRoom extends Room {
  maxClients = 8;

  async onCreate(options: any) {
    let optionSchema = object({
      name: string().min(3).max(32).trim(),
      visibility: string().matches(/^(public|private)$/),
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

    this.onMessage("create-identity", (client, identity) => {
      const player = this.createPlayerFromIdentity(identity, client);

      this.broadcast("player-joined", player, { except: client });

      this.electNewLeaderIfNecessary();
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
        this.state.leaderId = firstPlayer.id;
        this.broadcast("new-leader", firstPlayer);
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
    console.log("client joined", client.sessionId);
    client.send("create-identity");
  }

  // When a client leaves the room
  onLeave(client: Client, consented: boolean) {
    const player = this.state.players.get(client.sessionId);

    if (player) {
      this.state.players.delete(client.sessionId);
      this.broadcast("player-left", player, { except: client });
      this.electNewLeaderIfNecessary();
    }
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose() {}
}
export default GameRoom;
