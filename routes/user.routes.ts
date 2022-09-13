/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
const UserController = require("../controllers/user.controller");
const router = express.Router();
const { walletValidator } = require("../middleware/wallet-validator");

router.post(
  "/account/new",
  (req, res, next) => {
    const { user } = req.body;
    walletValidator(user?.accountNumber, res, next);
  },
  UserController.createUserProfile
);
router.get("/account/details/:id", UserController.getUserProfileDetails);
router.patch(
  "/account/update/:id",
  (req, res, next) => {
    const { user } = req.body;
    walletValidator(user?.accountNumber, res, next);
  },
  UserController.updateUserProfile
);

module.exports = { router };
