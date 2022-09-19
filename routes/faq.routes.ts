/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
import { faqValidationRule } from "../utils/validation-rules";
const FaqController = require("../controllers/faq.controller");
const router = express.Router();
const { typeValidation } = require("../middleware/validation.middleware");
const { uuidValidator } = require("../middleware/uuid.middleware");

router.post(
  "/question/new",
  typeValidation(faqValidationRule),
  FaqController.createFaqQuestion
);
router.patch(
  "/question/update/:id",
  uuidValidator,
  typeValidation(faqValidationRule),
  FaqController.updateFaqQuestion
);
router.get("/question/:id", uuidValidator, FaqController.getFaqQuestion);

module.exports = { router };
