/* eslint-disable @typescript-eslint/no-var-requires */
import Whitelist from "../models/whitelist.model";
const ApiResponse = require("../utils/api-response");

const createWhitelist = async (req, res) => {
  try {
    console.log("Create Whitelist Pending");

    const { whitelist } = req.body;

    if (
      whitelist.address.length < 36 ||
      whitelist.address.length > 42 ||
      (whitelist.address.length > 36 && whitelist.address.length < 42)
    ) {
      return ApiResponse.validationErrorWithData(
        res,
        "Wallet address or UUID is invalid"
      );
    }

    if (!["0", "1", "2"].includes(whitelist.status)) {
      return ApiResponse.validationErrorWithData(
        res,
        "Status field is invalid"
      );
    }

    if (!["NAPA", "USDT", "ETH"].includes(whitelist.currency)) {
      return ApiResponse.validationErrorWithData(
        res,
        "Status field is invalid"
      );
    }

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
    return ApiResponse.ErrorResponse(res, error.message);
  }
};

const updateWhitelist = async (req, res) => {
  try {
    console.log("Update Whitelist Pending");

    const { whitelist } = req.body;

    const { whitelistId } = req.params;

    if (!whitelistId) {
      return ApiResponse.validationErrorWithData(
        res,
        "Whitelist id is required"
      );
    }

    if (
      whitelist.address.length < 36 ||
      whitelist.address.length > 42 ||
      (whitelist.address.length > 36 && whitelist.address.length < 42)
    ) {
      return ApiResponse.validationErrorWithData(
        res,
        "Wallet address or UUID is invalid"
      );
    }

    if (!["0", "1", "2"].includes(whitelist.status)) {
      return ApiResponse.validationErrorWithData(
        res,
        "Status field is invalid"
      );
    }

    if (!["NAPA", "USDT", "ETH"].includes(whitelist.currency)) {
      return ApiResponse.validationErrorWithData(
        res,
        "Status field is invalid"
      );
    }

    const newWhitelist = new Whitelist(whitelist);

    const [whitelistData] = await newWhitelist.update(whitelistId);

    // @ts-ignore
    if (!whitelistData.length) {
      return ApiResponse.notFoundResponse(res, "Whitelist Data Not Found");
    }

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

    if (!status) {
      return ApiResponse.validationErrorWithData(
        res,
        "Status field is requried in params"
      );
    }

    if (!["0", "1", "2"].includes(status)) {
      return ApiResponse.validationErrorWithData(
        res,
        "Status field is invalid"
      );
    }

    const [whitelist] = await Whitelist.findAll(status);

    console.log("Get All Whitelist Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Get White List Sucessfully",
      // @ts-ignore
      whitelist.length ? whitelist : null
    );
  } catch (error) {
    console.error(error);
    console.log("Get All Whitelist Rejected");
    return ApiResponse.ErrorResponse(res, "Unable to fetch whitelist");
  }
};

module.exports = { createWhitelist, updateWhitelist, getAllWhitelist };
