/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
const PartnerController = require("../controllers/partners.controller");
const router = express.Router();

router.post("/account/new", PartnerController.createPartnerAccount);
router.get(
  "/account/details/:partnerUUID",
  PartnerController.getPartnerAccountDetails
);
router.patch(
  "/account/update/:partnerUUID",
  PartnerController.updatePartnerAccount
);

module.exports = { router };
