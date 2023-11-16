/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
// import { userValidationRule } from "../utils/validation-rules";
const TokenController = require("../controllers/tokens.controller");
const router = express.Router();

router.post("/new", TokenController.importToken);
router.get("", TokenController.getImportedTokens);
router.post("/updateTokenVisibility", TokenController.updateTokenVisibility);

module.exports = { router };
