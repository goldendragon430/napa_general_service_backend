/* eslint-disable @typescript-eslint/no-var-requires */
import User from "../models/user.model";
const ApiResponse = require("../utils/api-response");

const createUserProfile = async (req, res) => {
  try {
    console.log("Create User Profile Api Pending");

    const { user } = req.body;

    if (
      user.accountNumber.length < 36 ||
      user.accountNumber.length > 42 ||
      (user.accountNumber.length > 36 && user.accountNumber.length < 42)
    ) {
      return ApiResponse.validationErrorWithData(
        res,
        "Wallet address or UUID is invalid"
      );
    }

    if (!["NAPA", "BNB", "ETH"].includes(user.primaryCurrency)) {
      return ApiResponse.validationErrorWithData(
        res,
        "Primary currency is invalid"
      );
    }

    const newUser = new User(user);

    const [userData] = await newUser.create();

    console.log("Create User Profile Api Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "User Created Successfully",
      userData[0]
    );
  } catch (error) {
    console.log("Create User Profile Api Rejected");
    console.error(error);
    return ApiResponse.ErrorResponse(res, error.message);
  }
};

const getUserProfileDetails = async (req, res) => {
  try {
    console.log("Get User Profile Api Pending");

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

    const [user] = await User.getUserProfileDetails(id);

    if (!user.length) {
      return ApiResponse.notFoundResponse(res, "User Not Found");
    }

    console.log("Get User Profile Api Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Get User Profile Successfully",
      user[0]
    );
  } catch (error) {
    console.log("Get User Profile Api Rejected");
    console.error(error);
    return ApiResponse.ErrorResponse(res, "Unable to fetch user profile");
  }
};

const updateUserProfile = async (req, res) => {
  try {
    console.log("Get Update User Profile Api Pending");

    const { id } = req.params;

    const { user } = req.body;

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

    if (!["NAPA", "BNB", "ETH"].includes(user.primaryCurrency)) {
      return ApiResponse.validationErrorWithData(
        res,
        "Primary currency is invalid"
      );
    }

    if (!user.profileName) {
      return ApiResponse.validationErrorWithData(
        res,
        "Profile Name field is required"
      );
    }

    const updateUser = new User(user);

    const [userData] = await updateUser.update(id);

    if (!userData.length) {
      return ApiResponse.validationErrorWithData(res, "User Not Found");
    }

    console.log("Get Update User Profile Api Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "User Updated Successfully",
      userData[0]
    );
  } catch (error) {
    console.log("Get Update User Profile Api Rejected");
    console.log(error);
    return ApiResponse.ErrorResponse(res, "Unable to user update");
  }
};

module.exports = {
  createUserProfile,
  getUserProfileDetails,
  updateUserProfile,
};
