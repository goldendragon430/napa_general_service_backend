/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
const WhitelistController = require("../controllers/whitelist.controller");
const router = express.Router();
const { walletValidator } = require("../middleware/wallet-validator");

router.post(
  "/whitelist/new",
  (req, res, next) => {
    const { whitelist } = req.body;
    walletValidator(whitelist?.address, res, next);
  },
  WhitelistController.createWhitelist
);
router.get("/whitelist/list", WhitelistController.getAllWhitelist);
router.patch(
  "/whitelist/update/:whitelistId",
  (req, res, next) => {
    const { whitelist } = req.body;
    walletValidator(whitelist?.address, res, next);
  },
  WhitelistController.updateWhitelist
);

module.exports = { router };
