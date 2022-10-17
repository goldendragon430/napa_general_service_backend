/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
import { trendingValidationRules } from "../utils/validation-rules";
const TrendingController = require("../controllers/trending.controller");
const router = express.Router();
const { typeValidation } = require("../middleware/validation.middleware");

router.post(
  "/feed/new",
  typeValidation(trendingValidationRules),
  TrendingController.createTrendingFeed
);
router.get("/feed/list", TrendingController.getAllTrendingFeeds);
router.delete("/feed/delete/:articleId", TrendingController.deleteTrendingFeed);
router.patch("/feed/update/:articleId", TrendingController.updateTrending);

module.exports = { router };
