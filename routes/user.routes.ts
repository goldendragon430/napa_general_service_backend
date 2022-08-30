import express from "express";
const UserController = require("../controllers/user.controller");
const router = express.Router();

router.post("/create", UserController.createUser);

module.exports = { router };
