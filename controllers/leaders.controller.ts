/* eslint-disable @typescript-eslint/no-var-requires */
import Leaders from "../models/leaders.model";
const ApiResponse = require("../utils/api-response");

const createLeaders = async (req, res) => {
  try {
    console.log("Create Leaders Api Pending");

    const { leaders } = req.body;

    const newLeaders = new Leaders(leaders);

    const [leadersData] = await newLeaders.create();

    console.log("Create Leaders Api Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Leaders Created Successfully",
      leadersData[0]
    );
  } catch (error) {
    console.log("Create Leaders Api Rejected");
    console.error(error);
    return ApiResponse.ErrorResponse(res, error.message);
  }
};

const getLeaders = async (req, res) => {
  try {
    console.log("Get Leaders Api Pending");

    const { type } = req.query;

    if (!type) {
      return ApiResponse.validationErrorWithData(
        res,
        "Please enter a valid type"
      );
    }

    if (!["1", "2", "3", "4"].includes(type)) {
      return ApiResponse.validationErrorWithData(
        res,
        "Please enter a valid leader type"
      );
    }

    const [leaders] = await Leaders.getLeadersAll(type);

    console.log("Create Leaders Api Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Get Leaders Successfully",
      // @ts-ignore
      leaders.length ? leaders : null
    );
  } catch (error) {
    console.log("Get Leaders Api Rejected");
    console.error(error);
    return ApiResponse.ErrorResponse(res, error.message);
  }
};

module.exports = { getLeaders, createLeaders };
