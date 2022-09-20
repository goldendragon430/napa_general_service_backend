/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
import { leadersValidationRule } from "../utils/validation-rules";
const LeadersController = require("../controllers/leaders.controller");
const router = express.Router();
const { typeValidation } = require("../middleware/validation.middleware");

router.post(
  "/leaders/new",
  typeValidation(leadersValidationRule),
  LeadersController.createLeaders
);

router.get("/leaders", LeadersController.getLeaders);

module.exports = { router };
