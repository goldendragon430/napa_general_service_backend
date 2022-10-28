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
import IPData from "ipdata";

const ipdata = new IPData(process.env.IPDATA_KEY);

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

    const [isWalletAddressExist] = await Partners.findByWalletAddress(
      partner.accountNumber
    );

    // @ts-ignore
    if (isWalletAddressExist?.length > 0) {
      return ApiResponse.validationErrorWithData(
        res,
        "Unable to create account with this wallet address",
        {}
      );
    }

    const [isEmailExist] = await Partners.findOne(partner.email);

    // @ts-ignore
    if (isEmailExist?.length > 0) {
      return ApiResponse.validationErrorWithData(
        res,
        "Email is Already Exist",
        {}
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

    const { email, account } = req.body;

    const [partnerDetails] = await Partners.findOne(email);

    // @ts-ignore
    if (!partnerDetails.length) {
      return ApiResponse.notFoundResponse(res, "Please Sign Up for Account");
    }

    const [partnersData] = await Partners.findByAccountNumber(email, account);

    // @ts-ignore
    if (!partnersData.length) {
      return ApiResponse.notFoundResponse(
        res,
        "Please connect the account associated with e-mail address"
      );
    }

    const token = generateTokenWithPayload(
      {
        email: email,
      },
      "7d"
    );
    const ipAddress = await ipdata.lookup();

    const file = await ejs.renderFile(
      path.join(__dirname, "..", "views/verifyemail.ejs"),
      {
        user_name: partnerDetails[0]?.profileName,
        confirm_link: `http://localhost:3000/home?token=${token}`,
        ip_address: ipAddress.ip,
      }
    );

    sendEmail(email, file);

    console.log("Login Partner Account Fullfilled");

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

    // @ts-ignore
    if (!user.length) {
      return ApiResponse.notFoundResponse(res, "User Not Found");
    }
    console.log("Login Verify Account Fullfilled");

    return ApiResponse.successResponseWithData(res, "Verified Email", user[0]);
  } catch (error) {
    console.log("Login Verify Account Rejected");
    return ApiResponse.ErrorResponse(res, error.message);
  }
};

const getCurrentPartnerUser = async (req, res) => {
  try {
    console.log("Get Current Partner User Pending");

    const { id } = req.query || {};

    const [user] = await Partners.findById(id);

    // @ts-ignore
    if (!user.length) {
      return ApiResponse.notFoundResponse(res, "User Not Found");
    }
    console.log("Get Current Partner User Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Get Current User SuccessFully",
      user[0]
    );
  } catch (error) {
    console.log("Get Current Partner User Rejected");
    return ApiResponse.ErrorResponse(res, error.message);
  }
};

const getGenerateToken = async (req, res) => {
  try {
    console.log("Get Generate Token Pending");

    const { email, account } = req.body;
    const [partnerDetails] = await Partners.findOne(email);

    // @ts-ignore
    if (!partnerDetails.length) {
      return ApiResponse.notFoundResponse(res, "Please Sign Up for Account");
    }

    const [partnersData] = await Partners.findByAccountNumber(email, account);

    // @ts-ignore
    if (!partnersData.length) {
      return ApiResponse.notFoundResponse(
        res,
        "Please connect the account associated with e-mail address"
      );
    }
    const ipAddress = await ipdata.lookup();

    return ApiResponse.successResponseWithData(
      res,
      "Token Generated Successfully",
      {
        ipAddress,
      }
    );
  } catch (error) {
    console.log("Get Generate Token Rejected");
    return ApiResponse.ErrorResponse(res, error.message);
  }
};

module.exports = {
  createPartnerAccount,
  getPartnerAccountDetails,
  updatePartnerAccount,
  loginPartnerAccount,
  verifyUserEmail,
  getCurrentPartnerUser,
  getGenerateToken,
};
