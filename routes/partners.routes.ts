/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
const PartnerController = require("../controllers/partners.controller");
const router = express.Router();
const { walletValidator } = require("../middleware/wallet-validator");

router.post(
  "/account/new",
  (req, res, next) => {
    const { partner } = req.body;
    walletValidator(partner?.accountNumber, res, next);
  },
  PartnerController.createPartnerAccount
);
router.get(
  "/account/details/:partnerUUID",
  PartnerController.getPartnerAccountDetails
);
router.patch(
  "/account/update/:partnerUUID",
  (req, res, next) => {
    const { partner } = req.body;
    walletValidator(partner?.accountNumber, res, next);
  },
  PartnerController.updatePartnerAccount
);

module.exports = { router };
