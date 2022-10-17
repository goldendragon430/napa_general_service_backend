/* eslint-disable @typescript-eslint/no-var-requires */
import Trending from "../models/trending.model";
const ApiResponse = require("../utils/api-response");

const createTrendingFeed = async (req, res) => {
  try {
    console.log("Create Trending Feeds Pending");

    const { trending } = req.body;

    const newTrending = new Trending(trending);

    if (!["SOCIAL", "NFT"].includes(trending.articleType)) {
      return ApiResponse.validationErrorWithData(
        res,
        "Article Type is not valid"
      );
    }

    if (!["0", "1", "2", "3", "4"].includes(trending.articleStatus)) {
      return ApiResponse.validationErrorWithData(
        res,
        "Please enter valid article status"
      );
    }
    const [trendingData] = await newTrending.create();

    console.log("Create Trending Feeds Fullfilled");

    if (["0", "1", "2", "3", "4"].includes(trending.articleStatus)) {
      // @ts-ignore
      global.SocketService.handleGetTrendings({
        trending: trendingData[0],
      });
    }

    return ApiResponse.successResponseWithData(
      res,
      "Trending Feed Created Successfully",
      trendingData[0]
    );
  } catch (error) {
    console.error(error);
    console.log("Create Trending Feeds Rejected");
    return ApiResponse.ErrorResponse(res, "Unable to create trending feeds");
  }
};

const getAllTrendingFeeds = async (req, res) => {
  try {
    console.log("Get Trending Feeds Pending");

    const { status, articleId } = req.query;

    let articleIds = [];
    if (articleId) {
      articleIds = articleId
        .replace(/['"]+/g, "")
        .split(";")
        .map((item) => {
          return item.trim();
        });
    }

    let statusValue;
    if (status) {
      statusValue = status.replace(/['"]+/g, "");
      if (!["0", "1", "2", "3", "4"].includes(statusValue)) {
        return ApiResponse.validationErrorWithData(
          res,
          "Please enter valid article status"
        );
      }
    }

    const [trending] = await Trending.getAllTendingFeeds(
      statusValue || articleIds
    );

    // @ts-ignore
    if (articleIds.length && !trending.length) {
      return ApiResponse.validationErrorWithData(
        res,
        "Trending Feeds Data Not Found"
      );
    }

    console.log("Get Trending Feeds Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Get Trendings Feed Successfully",
      // @ts-ignore
      trending.length ? trending : null
    );
  } catch (error) {
    console.log(error);
    console.log("Get Trending Feeds Rejected");
    return ApiResponse.ErrorResponse(res, "Unable to fetch trending feeds");
  }
};

const updateTrending = async (req, res) => {
  try {
    console.log("Update Trending Feed Pending");

    const { articleId } = req.params;

    const { trending } = req.body;

    if (!articleId) {
      return ApiResponse.validationErrorWithData(
        res,
        "Please enter a article id"
      );
    }

    const updatedTrending = new Trending(trending);

    const [trendingData] = await updatedTrending.update(articleId);

    //@ts-ignore
    if (!trendingData.length) {
      return ApiResponse.notFoundResponse(res, "Trending Not Found");
    }

    console.log("Update Trending Feed Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Trending Feed Updated Successfully",
      trendingData[0]
    );
  } catch (error) {
    console.log(error);
    console.log("Update Trending Feed Rejected");
    return ApiResponse.ErrorResponse(res, error.message);
  }
};

const deleteTrendingFeed = async (req, res) => {
  try {
    console.log("Delete Trending Feed Pending");

    const { articleId } = req.params;

    if (!articleId) {
      return ApiResponse.validationErrorWithData(
        res,
        "Please enter a article id"
      );
    }

    await Trending.delete(articleId);

    console.log("Delete Trending Feed Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Trending Feed Deleted Successfully"
    );
  } catch (error) {
    console.log(error);

    console.log("Delete Trending Feed Rejected");

    return ApiResponse.ErrorResponse(res, error.message);
  }
};

module.exports = {
  createTrendingFeed,
  getAllTrendingFeeds,
  deleteTrendingFeed,
  updateTrending,
};
