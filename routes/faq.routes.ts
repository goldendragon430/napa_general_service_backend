/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
const FaqController = require("../controllers/faq.controller");
const router = express.Router();

router.post("/question/new", FaqController.createFaqQuestion);
router.patch("/question/update/:questionId", FaqController.updateFaqQuestion);
router.get("/question/:questionId", FaqController.getFaqQuestion);

module.exports = { router };
