/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
// import { userValidationRule } from "../utils/validation-rules";
const NapaAccountsController = require("../controllers/napa-accounts.controller");
const router = express.Router();

router.get("/napaccounts", NapaAccountsController.getNapaAccounts);
router.get("/napaccounts/new", NapaAccountsController.AddNapaAccount);

module.exports = { router };