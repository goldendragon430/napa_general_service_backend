/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
import { partnerValidationRule } from "../utils/validation-rules";
const PartnerController = require("../controllers/partners.controller");
const router = express.Router();
const { walletValidator } = require("../middleware/wallet.middleware");
const { typeValidation } = require("../middleware/validation.middleware");
const { uuidValidator } = require("../middleware/uuid.middleware");

router.post(
  "/account/new",
  typeValidation(partnerValidationRule),
  walletValidator,
  PartnerController.createPartnerAccount
);
router.get(
  "/account/details/:id",
  uuidValidator,
  walletValidator,
  PartnerController.getPartnerAccountDetails
);
router.patch(
  "/account/update/:id",
  uuidValidator,
  walletValidator,
  typeValidation(partnerValidationRule),
  PartnerController.updatePartnerAccount
);

router.post("/account/login", PartnerController.loginPartnerAccount);

router.get("/account/verify", PartnerController.verifyUserEmail);

module.exports = { router };
