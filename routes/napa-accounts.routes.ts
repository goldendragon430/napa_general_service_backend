/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
// import { userValidationRule } from "../utils/validation-rules";
const NapaAccountsController = require("../controllers/napa-accounts.controller");
const router = express.Router();

router.get("/napaccounts", NapaAccountsController.getNapaAccounts);
router.get("/napaccounts/new", NapaAccountsController.AddNapaAccount);
router.get("/napaccounts/import/new", NapaAccountsController.ImportNapaAccount);
router.get("/napaccounts/switch", NapaAccountsController.switchNapaAccount);
router.get("/getPhraseByProfileId", NapaAccountsController.getPhraseByProfileId);
router.get("/getPrivateKeyByProfileId", NapaAccountsController.getPrivateKeyByProfileId);
router.get("/getDeviceToken", NapaAccountsController.getDeviceToken);
router.post("/deleteNapaAccount", NapaAccountsController.deleteNapaAccount)
router.get("/napaccounts/getRecoveryPhrase", NapaAccountsController.getRecoveryPhrase);

module.exports = { router };
