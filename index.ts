/* eslint-disable @typescript-eslint/no-var-requires */
import { NextFunction, Request, Response } from "express";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import PubNub from "pubnub";
import { publishKey, subscribeKey } from "./config";
const app = express();
import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 5000 });
dotenv.config({ path: "./.env" });
const { SocketService } = require("./services/socket.service");
const socketService = new SocketService(wss);
require("./config");

// @ts-ignore
global.SocketService = socketService;

const pubnub = new PubNub({
  publishKey: publishKey,
  subscribeKey: subscribeKey,
  uuid: "NAPA",
});
require("./services/pubnub.services");

app.use(cors());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

socketService.init();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const PORT = process.env.PORT || 8000;

require("./routes/index.routes").setUpRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

export { pubnub };

export default app;
