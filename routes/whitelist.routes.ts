/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
import { whitelistValidationRule } from "../utils/validation-rules";
const WhitelistController = require("../controllers/whitelist.controller");
const router = express.Router();
const { uuidValidator } = require("../middleware/uuid.middleware");
const { walletValidator } = require("../middleware/wallet.middleware");
const { typeValidation } = require("../middleware/validation.middleware");

router.post(
  "/whitelist/new",
  uuidValidator,
  walletValidator,
  typeValidation(whitelistValidationRule),
  WhitelistController.createWhitelist
);
router.get("/whitelist/list/:status", WhitelistController.getAllWhitelist);
router.patch(
  "/whitelist/update/:whitelistId",
  uuidValidator,
  walletValidator,
  typeValidation(whitelistValidationRule),
  WhitelistController.updateWhitelist
);

module.exports = { router };
