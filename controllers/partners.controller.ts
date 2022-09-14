import { validateEmail } from "../utils/validation-email";
import Partners from "../models/partners.model";
const ApiResponse = require("../utils/api-response");

const createPartnerAccount = async (req, res) => {
  try {
    console.log("Create Partner Account Pending");

    const { partner } = req.body;

    if (!validateEmail(partner.email)) {
      return ApiResponse.validationErrorWithData(res, "Email is not valid", {});
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

    const { partnerUUID } = req.params;

    const [partner] = await Partners.getPartnerAccountDetails(partnerUUID);

    // @ts-ignore
    if (!partner.length) {
      return ApiResponse.notFoundResponse(res, "Partner Not Found");
    }

    console.log("Get Partner Account Details Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Partner account get successfully",
      { partner: partner[0] }
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

    const { partnerUUID } = req.params;

    const { partner } = req.body;

    const updatePartner = new Partners(partner);

    const [partnerData] = await updatePartner.update(partnerUUID);

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
