/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
const UserController = require("../controllers/user.controller");
const router = express.Router();

router.post("/account/new", UserController.createUserProfile);
router.get("/account/details/:profileId", UserController.getUserProfileDetails);
router.patch("/account/update/:profileId", UserController.updateUserProfile);

module.exports = { router };
