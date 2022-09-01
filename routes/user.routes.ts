/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
const UserController = require("../controllers/user.controller");
const router = express.Router();

router.post("/create", UserController.createUser);
router.get("/:accountNumber", UserController.getUserByAccountNumber);

module.exports = { router };
