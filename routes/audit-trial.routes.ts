/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
import { auditTrialValidationRules } from "../utils/validation-rules";
const { typeValidation } = require("../middleware/validation.middleware");
const AuditTrailController = require("../controllers/audit-trial.controller");
const router = express.Router();

router.post(
  "/events/new",
  typeValidation(auditTrialValidationRules),
  AuditTrailController.createAuditTrial
);
router.get("/events/list", AuditTrailController.getAuditTrial);

module.exports = { router };
