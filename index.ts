import { NextFunction, Request, Response } from "express";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import PubNub from "pubnub";
const app = express();
dotenv.config({ path: "./.env" });
require("./config");

export const pubnub = new PubNub({
  publishKey: "pub-c-0d5a96ee-525e-42f0-aa30-fd5d88f1fb9c",
  subscribeKey: "sub-c-75fb728e-cefb-48ad-b71e-06eb8abf2702",
  uuid: "Jack-device",
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
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const PORT = process.env.PORT || 8080;

require("./routes/index.routes").setUpRoutes(app);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

export default app;
