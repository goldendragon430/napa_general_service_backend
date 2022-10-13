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
  publishKey: "pub-c-a0c50e24-85ba-488c-a760-fcc9cdc8d42f",
  subscribeKey: "sub-c-d4377c6d-6c5f-4199-adbc-8885a5a5270a",
  uuid: "NAPA",
});
require("./services/pubnub.services");

const pool = mysql.createPool({
  host: "napa-general-services.clfuekgzzk52.ap-southeast-1.rds.amazonaws.com",
  user: "admin",
  database: "napa-development",
  password: "napa12345",
});

const db = pool.promise();

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

export { pubnub, db };

export default app;
