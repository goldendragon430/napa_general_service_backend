/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
const UserController = require("../controllers/user.controller");
const router = express.Router();

router.post("/account/new", UserController.createUserProfile);
router.get("/account/details/:id", UserController.getUserProfileDetails);
router.patch("/account/update/:id", UserController.updateUserProfile);

module.exports = { router };
