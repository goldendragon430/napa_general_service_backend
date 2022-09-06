/* eslint-disable @typescript-eslint/no-var-requires */
import { NextFunction, Request, Response } from "express";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import PubNub from "pubnub";
const app = express();
import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 5000 });
dotenv.config({ path: "./.env" });
const { SocketService } = require("./services/socket.service");
const socketService = new SocketService(wss);
import mysql from "mysql2";
require("./config");

// @ts-ignore
global.SocketService = socketService;

const pubnub = new PubNub({
  publishKey: process.env.PUBLISH_KEY,
  subscribeKey: process.env.SUBSCRIBE_KEY,
  uuid: "NAPA",
});
require("./services/pubnub.services");

const pool = mysql.createPool({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  database: process.env.RDS_DB_NAME,
  password: process.env.RDS_PASSWORD,
});

const db = pool.promise();

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

export { pubnub, db };

export default app;
