/* eslint-disable @typescript-eslint/no-var-requires */
import User from "../models/user.model";
const ApiResponse = require("../utils/api-response");
import { v4 as uuidv4 } from "uuid";
import { uploadS3 } from "../utils/upload-s3";
import axios from "axios";
import crypto from "crypto";
import moment from "moment";
import NapaAccounts from "../models/napa-accounts.model";
import { encryptString } from "../utils/encryption";

const createUserProfile = async (req, res) => {
  try {
    console.log("Create User Profile Api Pending");
    const avatarUuid = uuidv4();
    console.log("req.file-update", req.file);
    console.log("req.body", req.body);

    const user = req.body;

    const [isExit] = await User.getUserProfileDetails(user.emailAddress);

    if (isExit.length) {
      return ApiResponse.notFoundResponse(
        res,
        "This Email Already Exists on NAPA"
      );
    }

    const options = {
      method: "GET",
      url: "https://napa-asset-backend-staging.napasociety.io/createWallet",
    };

    const walletResponse = await axios(options);
    const napaWalletAccount =
      walletResponse?.data?.data?.CreateWallet?.public_key;
    const napaWalletAccountPhrase =
      walletResponse?.data?.data?.CreateWallet?.mnemonic;
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

    const options2 = {
      method: "GET",
      url: `https://napa-asset-backend-staging.napasociety.io/fetchAccountsByIndex?index=0&phrase=${napaWalletAccountPhrase}`,
    };

    const firstAccount = await axios(options2);

    const napaWalletAccountPhraseEncrpted = encryptString(
      napaWalletAccountPhrase
    );
    const subAcWalletPrivatekeyEncrpted = encryptString(
      firstAccount?.data?.data?.tokenData?.desiredAccount?.privateKey
    );

    const napaUser = {
      profileId: userData[0]?.profileId,
      napaWalletAccount: userData[0]?.napaWalletAccount,
      napaWalletAccountPhrase: napaWalletAccountPhraseEncrpted,
      subAcWalletAddress:
        firstAccount?.data?.data?.tokenData?.desiredAccount?.address,
      subAcWalletName: userData[0]?.profileName,
      subAcWalletPrivatekey: subAcWalletPrivatekeyEncrpted,
      subAcWalletStatus: "1",
      isActive: "true",
    };

    const napaAc = new NapaAccounts(napaUser);
    await napaAc.create();

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

    if (user[0].accountStatus == "2") {
      return ApiResponse.validationErrorWithData(res, "Account is Deactivated");
    }

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

    if (isExit[0].accountStatus == "2") {
      return ApiResponse.validationErrorWithData(res, "Account is Deactivated");
    }

    if (req.body.metamaskAccountNumber) {
      const [metamaskAccountNumberCheck] =
        await User.findByMetamaskAccountNumber(req.body.metamaskAccountNumber);
      // @ts-ignore
      if (metamaskAccountNumberCheck.length) {
        const isEmailAssociated =
          metamaskAccountNumberCheck[0].emailAddress == req.body.emailAddress;
        if (!isEmailAssociated) {
          return ApiResponse.notFoundResponse(
            res,
            "Please connect the account associated with e-mail address"
          );
        }
      }
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

    // @ts-ignore
    global.SocketService.handleUpdateUser({
      user: userData[0],
    });

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

const updateUserProfileStatus = async (req, res) => {
  try {
    console.log("Update User Profile Account Status Api Pending");

    const { id } = req.params;

    const { accountStatus } = req.body;

    const [isExit] = await User.getUserProfileDetails(id);

    if (!isExit.length) {
      return ApiResponse.notFoundResponse(res, "User Not Found");
    }

    if (!["1", "2", "3"].includes(accountStatus)) {
      return ApiResponse.validationErrorWithData(
        res,
        "Account Status is invalid"
      );
    }

    const updateUser = new User(req.body);

    const [userData] = await updateUser.updateStatus(id);

    console.log("Update User Profile Account Status Api Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "User Profile Account Status Updated Successfully",
      userData[0]
    );
  } catch (error) {
    console.log("Update User Profile Account Status Api Rejected");
    console.log(error);
    return ApiResponse.ErrorResponse(
      res,
      "Unable to update user profile account status"
    );
  }
};

const generateQR = async (req, res) => {
  try {
    console.log("Generate QR Code Api Pending");

    const token = crypto.randomBytes(64).toString("hex");
    const channel_data =
      new Date().getDate() +
      "-" +
      new Date().getMonth() +
      "-" +
      new Date().getMinutes();
    const channel_data_hash = crypto
      .createHash("md5")
      .update(channel_data + "||" + token)
      .digest("hex");

    const { data } = await axios("https://geolocation-db.com/json/", {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });

    console.log("Generate QR Code Api Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "QR Code Generated Successfully",
      {
        id: channel_data_hash,
        generatedTimestamp: Date.now(),
        metaData: data,
      }
    );
  } catch (error) {
    console.log("Generate QR Code Api Rejected");
    console.log(error);
    return ApiResponse.ErrorResponse(res, "Unable to Generate QR Code");
  }
};

const verifyAuthToken = async (req, res) => {
  try {
    console.log("Verify Auth Token Api Pending");

    // const postTime = moment(timestamp).add(1, 'hours').format();
    // const countDownTime = new Date(postTime).getTime();
    // const duration = countDownTime - new Date().getTime();

    const generatedTimestamp = new Date(
      moment(req.body.generatedTimestamp).add(20, "seconds").format()
    ).getTime();
    const duration = generatedTimestamp - new Date().getTime();

    if (duration < 0) {
      return ApiResponse.ErrorResponse(res, "Auth Token has been expired.");
    }

    const [userData] = await User.getUserProfileDetails(req.body.profileId);

    if (!userData.length) {
      return ApiResponse.notFoundResponse(res, "User Not Found");
    }

    console.log("Verify Auth Token Api Fullfilled");

    // @ts-ignore
    global.SocketService.handleLoginUserToWeb({
      id: req?.body?.id,
      profileId: userData[0]?.profileId || "",
      emailAddress: userData[0]?.emailAddress || "",
      napaWalletAccount: userData[0]?.napaWalletAccount || "",
    });

    return ApiResponse.successResponseWithData(
      res,
      "Verify Auth Token Api Successfully",
      userData[0]
    );
  } catch (error) {
    console.log("Verify Auth Token Api Rejected");
    console.log(error);
    return ApiResponse.ErrorResponse(res, "Unable to Verify Auth Token");
  }
};

module.exports = {
  createUserProfile,
  getUserProfileDetails,
  updateUserProfile,
  generateQR,
  verifyAuthToken,
  updateUserProfileStatus,
};
