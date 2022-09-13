import Trending from "../models/trending.model";

const createTrendingFeed = async (req, res) => {
  try {
    const { trending } = req.body;

    const newTrending = new Trending(trending);

    if (!trending.articleEndDate) {
      return res.status(400).json({
        message: "Article End Date filed is required",
      });
    }

    if (!trending.articleStartDate) {
      return res.status(400).json({
        message: "Article Start Date filed is required",
      });
    }

    const [trendingData] = await newTrending.create();

    return res.status(201).json({
      message: "Trending Feed Created Successfully",
      articleId: trendingData[0].articleId,
      articleTitle: trendingData[0].articleTitle,
      articleBody: trendingData[0].articleBody,
      articleHeadline: trendingData[0].articleHeadline,
      articleStartDate: trendingData[0].articleStartDate,
      articleEndDate: trendingData[0].articleEndDate,
      totalRunDays: trendingData[0].totalRunDays,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getAllTrendingFeeds = async (req, res) => {
  try {
    const { status } = req.params;

    const [trending] = await Trending.getAllTendingFeeds(status);

    return res.status(201).json({
      trending: trending,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getTrendingFeed = async (req, res) => {
  try {
    const { articleId } = req.params;

    const [trending] = await Trending.getTrendingFeed(articleId);

    return res.status(201).json({
      trending: trending[0],
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteTrendingFeed = async (req, res) => {
  try {
    const { articleId } = req.params;

    await Trending.delete(articleId);

    return res.status(201).json({
      message: "Trending Feed Deleted Successfully",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createTrendingFeed,
  getAllTrendingFeeds,
  getTrendingFeed,
  deleteTrendingFeed,
};
