/* eslint-disable @typescript-eslint/no-var-requires */
import User from "../models/user.model";
const ApiResponse = require("../utils/api-response");
import { v4 as uuidv4 } from "uuid";
import { uploadS3 } from "../utils/upload-s3";
import axios from "axios";

const createUserProfile = async (req, res) => {
  try {
    console.log("Create User Profile Api Pending");
    const avatarUuid = uuidv4();
    console.log("req.file-update", req.file);
    console.log("req.body", req.body);

    const user = req.body;

    const [isExit] = await User.getUserProfileDetails(user.emailAddress);

    if (isExit.length) {
      return ApiResponse.notFoundResponse(res, "Email Already Exit");
    }

    const options = {
      method: "GET",
      url: "https://napa-asset-backend-staging.napasociety.io/createWallet",
    };

    const walletResponse = await axios(options);
    const napaWalletAccount = walletResponse?.data?.data?.CreateWallet?.address;
    user.napaWalletAccount = napaWalletAccount;

    if (req.file) {
      const result = await uploadS3(avatarUuid, req.file.mimetype, req.file);
      user.avatar = result.Location;
    }

    // if (user.napaWalletAccount) {
    //   if (
    //     user.napaWalletAccount.length < 36 ||
    //     user.napaWalletAccount.length > 42 ||
    //     (user.napaWalletAccount.length > 36 &&
    //       user.napaWalletAccount.length < 42)
    //   ) {
    //     return ApiResponse.validationErrorWithData(
    //       res,
    //       "NAPA Wallet address or UUID is invalid"
    //     );
    //   }
    // }

    // if (user.accountNumber) {
    //   if (
    //     user.accountNumber.length < 36 ||
    //     user.accountNumber.length > 42 ||
    //     (user.accountNumber.length > 36 && user.accountNumber.length < 42)
    //   ) {
    //     return ApiResponse.validationErrorWithData(
    //       res,
    //       "Wallet address or UUID is invalid"
    //     );
    //   }
    // }

    if (!["NAPA", "BNB", "ETH"].includes(user.primaryCurrency)) {
      return ApiResponse.validationErrorWithData(
        res,
        "Primary currency is invalid"
      );
    }

    const newUser = new User(user);

    const [userData] = await newUser.create();
    const [allUsers] = await User.getAllUsers();

    // @ts-ignore
    global.SocketService.handleGetTotalUsers({
      totalUsers: String(allUsers?.length) ?? "0",
    });

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

    // if (
    //   id.length < 36 ||
    //   id.length > 42 ||
    //   (id.length > 36 && id.length < 42)
    // ) {
    //   return ApiResponse.validationErrorWithData(
    //     res,
    //     "Wallet address or UUID is invalid"
    //   );
    // }

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
    const avatarUuid = uuidv4();
    console.log("req.file-update", req.file);
    console.log("req.body", req.body);

    const { id } = req.params;

    const user = req.body;

    const [isExit] = await User.getUserProfileDetails(id);

    if (!isExit.length) {
      return ApiResponse.notFoundResponse(res, "User Not Found");
    }

    if (req.file) {
      const result = await uploadS3(avatarUuid, req.file.mimetype, req.file);
      user.avatar = result.Location;
    } else if (isExit[0].avatar) {
      user.avatar = isExit[0].avatar;
    }

    // if (
    //   id.length < 36 ||
    //   id.length > 42 ||
    //   (id.length > 36 && id.length < 42)
    // ) {
    //   return ApiResponse.validationErrorWithData(
    //     res,
    //     "Wallet address or UUID is invalid"
    //   );
    // }

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
