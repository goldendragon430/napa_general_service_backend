/* eslint-disable @typescript-eslint/no-var-requires */
import { NextFunction, Request, Response } from "express";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import PubNub from "pubnub";
const app = express();
const httpServer = require("http").createServer(app);
const WebSocket = require("ws");
const wss = new WebSocket.Server({ server: httpServer });
dotenv.config({ path: "./.env" });
const { SocketService } = require("./services/socket.service");
const socketService = new SocketService(wss);
import mysql from "mysql2";
import path from "path";
require("./config");
require("./utils/trending-cron-job");

// @ts-ignore
global.SocketService = socketService;

const pubnub = new PubNub({
  publishKey: process.env.PUBLISH_KEY,
  subscribeKey: process.env.SUBSCRIBE_KEY,
  uuid: process.env.UUID,
});
require("./services/pubnub.services");

const napaPool = mysql.createPool({
  host: process.env.RDS_NAPA_HOSTNAME,
  user: process.env.RDS_NAPA_USERNAME,
  database: process.env.RDS_NAPA_NAME,
  password: process.env.RDS_NAPA_PASSWORD,
});

const socialArtPool = mysql.createPool({
  host: process.env.RDS_NAPA_HOSTNAME,
  user: process.env.RDS_NAPA_USERNAME,
  database: process.env.RDS_SOCIAL_ART_DB_NAME,
  password: process.env.RDS_NAPA_PASSWORD,
});

const db = napaPool.promise();
const socialArtDb = socialArtPool.promise();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));

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

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

export { pubnub, db, socialArtDb };

export default app;
