/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
const AuditTrailController = require("../controllers/audit-trial.controller");
const router = express.Router();

router.post("/events/new", AuditTrailController.createAuditTrial);
router.get("/events/list", AuditTrailController.getAuditTrial);

module.exports = { router };
