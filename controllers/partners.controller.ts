/* eslint-disable @typescript-eslint/no-var-requires */
import { validateEmail } from "../utils/validation-email";
import Partners from "../models/partners.model";
import path from "path";
const ApiResponse = require("../utils/api-response");
const {
  generateTokenWithPayload,
  verifyToken,
} = require("../utils/generate-token");
const { sendEmail } = require("../utils/nodemailer");
const ejs = require("ejs");

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
    console.log(error.message);
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

const loginPartnerAccount = async (req, res) => {
  try {
    console.log("Login Partner Account Pending");

    const { email } = req.body;

    const [partnerDetails] = await Partners.findOne(email);

    // @ts-ignore
    if (!partnerDetails.length) {
      return ApiResponse.notFoundResponse(res, "User Not Found");
    }
    console.log("Login Partner Account Fullfilled");

    const token = generateTokenWithPayload(
      {
        email: email,
      },
      "7d"
    );

    const file = await ejs.renderFile(
      path.join(__dirname, "..", "views/verifyemail.ejs"),
      {
        user_name: partnerDetails[0]?.profileName,
        confirm_link: `http://localhost:3000/home?token=${token}`,
      }
    );

    sendEmail(email, file);

    return ApiResponse.successResponseWithData(
      res,
      "Please Check your email",
      {}
    );
  } catch (error) {
    console.log("Login Partner Account Rejected");
    console.log(error);
    return ApiResponse.ErrorResponse(res, "Unable to login partner account");
  }
};

const verifyUserEmail = async (req, res) => {
  try {
    console.log("Login Verify Account Pending");
    const { token = "" } = req.query || {};
    const tokenValidated = verifyToken(token);

    const [user] = await Partners.findOne(tokenValidated?.email);
    console.log("Login Verify Account Fullfilled");

    // @ts-ignore
    if (!user.length) {
      return ApiResponse.notFoundResponse(res, "User Not Found");
    }

    return ApiResponse.successResponseWithData(res, "Verified Email", user[0]);
  } catch (error) {
    console.log("Login Verify Account Rejected");
    return ApiResponse.ErrorResponse(res, error.message);
  }
};

module.exports = {
  createPartnerAccount,
  getPartnerAccountDetails,
  updatePartnerAccount,
  loginPartnerAccount,
  verifyUserEmail,
};
