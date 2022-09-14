/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
const TrendingController = require("../controllers/trending.controller");
const router = express.Router();

router.post("/feed/new", TrendingController.createTrendingFeed);
router.get("/feed/list", TrendingController.getAllTrendingFeeds);
router.delete("/feed/delete/:articleId", TrendingController.deleteTrendingFeed);

module.exports = { router };
