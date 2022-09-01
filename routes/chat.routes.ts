/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
const ChatController = require("../controllers/chat.controller");
const router = express.Router();

router.post("/send", ChatController.sendMessage);
router.get("/messages", ChatController.getMessages);

module.exports = { router };
