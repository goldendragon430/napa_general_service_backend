/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
const UserController = require("../controllers/user.controller");
const router = express.Router();

router.post("/account/new", UserController.createUserProfile);
router.get("/account/details/:profileId", UserController.getUserProfileDetails);
router.post("/account/update", UserController.updateUserProfile);

module.exports = { router };
