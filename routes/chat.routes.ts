import express from "express";
const ChatController = require("../controllers/chat.controller");
const router = express.Router();

router.post("/send", ChatController.sendMessage);

module.exports = { router };
