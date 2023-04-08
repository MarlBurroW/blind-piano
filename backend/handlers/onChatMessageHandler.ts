import { GameRoom } from "../rooms/GameRoom";
import { string } from "yup";
import { Message } from "../schemas/Message";
import { v4 as uuidv4 } from "uuid";
import kleur from "kleur";
import { Client } from "colyseus";

export async function onChatMessageHandler(
  this: GameRoom,
  client: Client,
  messageContent: string
) {
  const player = this.state.players.get(client.sessionId);

  const messageSchema = string().required().min(1).max(1024).trim();

  try {
    await messageSchema.validate(messageContent);
  } catch (err) {
    return;
  }

  if (!player) {
    return;
  }

  const message = new Message();

  message.player = player;
  message.message = messageContent;
  message.id = uuidv4();

  this.state.messages.push(message);

  this.broadcast("chat-message", message, { except: client });

  if (this.state.messages.length > this.maxMessages) {
    this.state.messages.shift();
  }

  this.log(kleur.bold().magenta(`Message: ${message.message}`), {
    player,
  });
}
