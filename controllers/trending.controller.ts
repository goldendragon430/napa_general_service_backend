import Trending from "../models/trending.model";
const ApiResponse = require("../utils/api-response");

const createTrendingFeed = async (req, res) => {
  try {
    console.log("Create Trending Feeds Pending");

    const { trending } = req.body;

    const newTrending = new Trending(trending);

    if (!trending.articleEndDate) {
      console.error("Article End Date field is required");
      return ApiResponse.validationErrorWithData(
        res,
        "Article End Date field is required"
      );
    }

    if (!trending.articleStartDate) {
      console.error("Article Start Date field is required");
      return ApiResponse.validationErrorWithData(
        res,
        "Article Start Date field is required"
      );
    }

    const [trendingData] = await newTrending.create();

    console.log("Create Trending Feeds Fullfilled");

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
    }

    const [trending] = await Trending.getAllTendingFeeds(
      statusValue || articleIds
    );

    console.log("Get Trending Feeds Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Get Trendings Feed Successfully",
      trending
    );
  } catch (error) {
    console.log(error);
    console.log("Get Trending Feeds Rejected");
    return ApiResponse.ErrorResponse(res, "Unable to fetch trending feeds");
  }
};

const deleteTrendingFeed = async (req, res) => {
  try {
    console.log("Delete Trending Feed Pending");

    const { articleId } = req.params;

    await Trending.delete(articleId);

    console.log("Delete Trending Feed Fullfilled");

    return res.status(200).json({
      code: 200,
      responseTimeStamp: Date.now(),
      message: "Trending Feed Deleted Successfully",
    });
  } catch (error) {
    console.log(error);

    console.log("Delete Trending Feed Rejected");

    return ApiResponse.ErrorResponse(res, "Unable to delete trending feed");
  }
};

module.exports = {
  createTrendingFeed,
  getAllTrendingFeeds,
  deleteTrendingFeed,
};
