import { Server, LobbyRoom } from "colyseus";
import { createServer } from "http";
import express from "express";
import GameRoom from "./rooms/GameRoom";
import { monitor } from "@colyseus/monitor";

const port = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use("/colyseus", monitor());

const gameServer = new Server({
  server: createServer(app),
});




gameServer.listen(port);

gameServer.define("lobby", LobbyRoom);

gameServer
  .define("game", GameRoom)
  .enableRealtimeListing()
  .sortBy({ clients: "descending" });
