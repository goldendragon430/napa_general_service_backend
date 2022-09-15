/* eslint-disable @typescript-eslint/no-var-requires */
import Whitelist from "../models/whitelist.model";
const ApiResponse = require("../utils/api-response");

const createWhitelist = async (req, res) => {
  try {
    console.log("Create Whitelist Pending");

    const { whitelist } = req.body;

    const newWhitelist = new Whitelist(whitelist);

    const [whitelistData] = await newWhitelist.create();

    console.log("Create Whitelist Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Whitelist Created Successfully",
      whitelistData[0]
    );
  } catch (error) {
    console.log("Create Whitelist Rejected");
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

const updateWhitelist = async (req, res) => {
  try {
    console.log("Update Whitelist Pending");

    const { whitelist } = req.body;

    const { whitelistId } = req.params;

    const newWhitelist = new Whitelist(whitelist);

    const [whitelistData] = await newWhitelist.update(whitelistId);

    console.log("Update Whitelist Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Whitelist Updated Successfully",
      whitelistData[0]
    );
  } catch (error) {
    console.error(error);
    console.log("Update Whitelist Rejected");
    return ApiResponse.ErrorResponse(res, "Unable to update whitelist");
  }
};

const getAllWhitelist = async (req, res) => {
  try {
    console.log("Get All Whitelist Pending");

    const { status } = req.params;

    const [whitelist] = await Whitelist.findAll(status);

    console.log("Get All Whitelist Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Get White List Sucessfully",
      whitelist
    );
  } catch (error) {
    console.error(error);
    console.log("Get All Whitelist Rejected");
    return ApiResponse.ErrorResponse(res, "Unable to fetch whitelist");
  }
};

module.exports = { createWhitelist, updateWhitelist, getAllWhitelist };
