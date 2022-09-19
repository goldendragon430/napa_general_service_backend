/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
import { userValidationRule } from "../utils/validation-rules";
const UserController = require("../controllers/user.controller");
const router = express.Router();
const { walletValidator } = require("../middleware/wallet.middleware");
const { uuidValidator } = require("../middleware/uuid.middleware");
const { typeValidation } = require("../middleware/validation.middleware");

router.post(
  "/account/new",
  typeValidation(userValidationRule),
  walletValidator,
  UserController.createUserProfile
);
router.get(
  "/account/details/:id",
  uuidValidator,
  walletValidator,
  UserController.getUserProfileDetails
);
router.patch(
  "/account/update/:id",
  uuidValidator,
  walletValidator,
  typeValidation(userValidationRule),
  UserController.updateUserProfile
);

module.exports = { router };
