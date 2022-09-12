/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
const WhitelistController = require("../controllers/whitelist.controller");
const router = express.Router();

router.post("/whitelist/new", WhitelistController.createWhitelist);
router.patch(
  "/whitelist/update/:whitelistId",
  WhitelistController.updateWhitelist
);

module.exports = { router };
