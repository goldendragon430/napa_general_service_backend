/* eslint-disable @typescript-eslint/no-var-requires */
import Faq from "../models/faq.model";
const ApiResponse = require("../utils/api-response");

const createFaqQuestion = async (req, res) => {
  try {
    console.log("Create Faq Question Pending");

    const { faq } = req.body;

    const newFaq = new Faq(faq);

    const [faqData] = await newFaq.create();

    console.log("Create Faq Question Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "FAQ Question Created Successfully",
      faqData[0]
    );
  } catch (error) {
    console.log("Create Faq Question Rejected");
    console.error(error);
    return ApiResponse.ErrorResponse(res, "Unable to create faq question");
  }
};

const updateFaqQuestion = async (req, res) => {
  try {
    console.log("Update Faq Question Pending");

    const { faq } = req.body;

    const { questionId } = req.params;

    const newFaq = new Faq(faq);

    const [faqData] = await newFaq.update(questionId);

    console.log("Update Faq Question Fullfilled");

    return ApiResponse.successResponseWithData(res, faqData[0]);
  } catch (error) {
    console.error(error);
    console.log("Update Faq Question Rejected");
    return ApiResponse.ErrorResponse(res, "Unable to update faq question");
  }
};

const getFaqQuestion = async (req, res) => {
  try {
    console.log("Get Faq Question Pending");

    const { questionId } = req.params;

    const [faq] = await Faq.findOne(questionId);

    console.log("Get Faq Question Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Get Faq Question Successfully",
      faq[0]
    );
  } catch (error) {
    console.error(error);
    console.log("Get Faq Question Rejected");
    return ApiResponse.ErrorResponse(res, "Unable to get faq question");
  }
};

module.exports = { createFaqQuestion, updateFaqQuestion, getFaqQuestion };
