import { Server, LobbyRoom } from "colyseus";
import { createServer } from "http";
import express from "express";
import GameRoom from "./rooms/GameRoom";
import { monitor } from "@colyseus/monitor";
import cors from "cors";

const port = Number(process.env.PORT) || 3000;

const app = express();
app.options("*", cors());

const gameServer = new Server({
  server: createServer(app),
});
app.use(express.static("public"));
app.use(express.json());
app.use("/colyseus", monitor());
app.use(
  cors({
    origin: "https://piano.marlburrow.io",
  })
);
gameServer.listen(port);

gameServer.define("lobby", LobbyRoom);

gameServer
  .define("game", GameRoom)
  .enableRealtimeListing()
  .sortBy({ clients: "descending" });
