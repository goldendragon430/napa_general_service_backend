/* eslint-disable @typescript-eslint/no-var-requires */
import { validateEmail } from "../utils/validation-email";
import Partners from "../models/partners.model";
const ApiResponse = require("../utils/api-response");

const createPartnerAccount = async (req, res) => {
  try {
    console.log("Create Partner Account Pending");

    const { partner } = req.body;

    if (
      partner.accountNumber.length < 36 ||
      partner.accountNumber.length > 42 ||
      (partner.accountNumber.length > 36 && partner.accountNumber.length < 42)
    ) {
      return ApiResponse.validationErrorWithData(
        res,
        "Wallet address or UUID is invalid"
      );
    }

    if (!validateEmail(partner.email)) {
      return ApiResponse.validationErrorWithData(res, "Email is not valid", {});
    }

    if (!["NAPA", "BNB", "ETH"].includes(partner.primaryCurrency)) {
      return ApiResponse.validationErrorWithData(
        res,
        "Primary currency is invalid"
      );
    }

    const newPartner = new Partners(partner);

    const [partnerData] = await newPartner.save();

    console.log("Create Partner Account Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Partner Account Created Successfully",
      partnerData[0]
    );
  } catch (error) {
    console.log("Create Partner Account Rejected");
    console.log(error);
    return ApiResponse.ErrorResponse(res, "Unable to create partner account");
  }
};

const getPartnerAccountDetails = async (req, res) => {
  try {
    console.log("Get Partner Account Details Pending");

    const { id } = req.params;

    if (!id) {
      return ApiResponse.validationErrorWithData(
        res,
        "id is required in params"
      );
    }

    if (
      id.length < 36 ||
      id.length > 42 ||
      (id.length > 36 && id.length < 42)
    ) {
      return ApiResponse.validationErrorWithData(
        res,
        "Wallet address or UUID is invalid"
      );
    }

    const [partner] = await Partners.getPartnerAccountDetails(id);

    // @ts-ignore
    if (!partner.length) {
      return ApiResponse.notFoundResponse(res, "Partner Not Found");
    }

    console.log("Get Partner Account Details Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Partner account get successfully",
      partner[0]
    );
  } catch (error) {
    console.log("Get Partner Account Details Rejected");
    console.log(error);
    return ApiResponse.ErrorResponse(res, "Unable to fetch partner account");
  }
};

const updatePartnerAccount = async (req, res) => {
  try {
    console.log("Update Partner Account Details Pending");

    const { id } = req.params;

    if (!id) {
      return ApiResponse.validationErrorWithData(
        res,
        "id is required in params"
      );
    }

    if (
      id.length < 36 ||
      id.length > 42 ||
      (id.length > 36 && id.length < 42)
    ) {
      return ApiResponse.validationErrorWithData(
        res,
        "Wallet address or UUID is invalid"
      );
    }

    const { partner } = req.body;

    const updatePartner = new Partners(partner);

    const [partnerData] = await updatePartner.update(id);

    //@ts-ignore
    if (!partnerData.length) {
      return ApiResponse.notFoundResponse(res, "Partner Not Found");
    }

    console.log("Update Partner Account Details Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Partner Account Updated Successfully",
      partnerData[0]
    );
  } catch (error) {
    console.log("Update Partner Account Details Rejected");
    console.log(error);
    return ApiResponse.ErrorResponse(res, "Unable to update partner account");
  }
};

module.exports = {
  createPartnerAccount,
  getPartnerAccountDetails,
  updatePartnerAccount,
};
