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
import Tokens from "../models/tokens.model";
import { createEthToken, createNapaToken } from "../utils/napa-accounts";
import { db, socialArtDb, stakingDB } from "../index";
import path from "path";
const ejs = require("ejs");
const { sendEmail } = require("../utils/nodemailer");

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
      url: `${process.env.ASSET_MANAGEMENT_API_URL}/createWallet`,
    };

    const walletResponse = await axios(options);
    const napaWalletAccount =
      walletResponse?.data?.data?.CreateWallet?.public_key;
    const napaWalletAccountPhrase =
      walletResponse?.data?.data?.CreateWallet?.mnemonic;
    user.napaWalletAccount = napaWalletAccount;

    if (user.pin) {
      user.pin = encryptString(user.pin);
    }

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

    const napaWalletAccountPhraseEncrpted = encryptString(
      napaWalletAccountPhrase
    );

    const napaUser = {
      profileId: userData[0]?.profileId,
      napaWalletAccount: userData[0]?.napaWalletAccount,
      napaWalletAccountPhrase: napaWalletAccountPhraseEncrpted,
      NWA_1_AC: "",
      NWA_1_NE: "",
      NWA_1_PK: "",
      NWA_1_ST: "1",
      NWA_2_AC: "",
      NWA_2_NE: "",
      NWA_2_PK: "",
      NWA_2_ST: "",
      NWA_3_AC: "",
      NWA_3_NE: "",
      NWA_3_PK: "",
      NWA_3_ST: "",
      NWA_4_AC: "",
      NWA_4_NE: "",
      NWA_4_PK: "",
      NWA_4_ST: "",
      NWA_5_AC: "",
      NWA_5_NE: "",
      NWA_5_PK: "",
      NWA_5_ST: "",
      activeWalletAC: "1",
      NWA_1_Type: "NAPA Account",
      NWA_1_CreatedAt: moment(new Date()).format("YYYY-MM-DDTHH:mm:ssZ"),
      NWA_2_Type: "",
      NWA_2_CreatedAt: "",
      NWA_3_Type: "",
      NWA_3_CreatedAt: "",
      NWA_4_Type: "",
      NWA_4_CreatedAt: "",
      NWA_5_Type: "",
      NWA_5_CreatedAt: "",
    };

    const napaAc = new NapaAccounts(napaUser);
    await napaAc.create();

    const options2 = {
      method: "GET",
      url: `${process.env.ASSET_MANAGEMENT_API_URL}/fetchAccountsByIndex?index=0&profileId=${userData[0]?.profileId}`,
    };

    const firstAccount = await axios(options2);

    const subAcWalletPrivatekeyEncrpted = encryptString(
      firstAccount?.data?.data?.tokenData?.desiredAccount?.privateKey
    );

    await NapaAccounts.update(
      firstAccount?.data?.data?.tokenData?.desiredAccount?.address,
      userData[0]?.profileName,
      subAcWalletPrivatekeyEncrpted,
      userData[0]?.profileId
    );

    const [isExit2] = await User.getUserProfileDetails(user.emailAddress);

    await createNapaToken(
      process.env.ENVIRONMENT === "staging" ? "2" : "0",
      userData[0]?.profileId,
      firstAccount?.data?.data?.tokenData?.desiredAccount?.address
    );
    await createEthToken(
      "0",
      userData[0]?.profileId,
      firstAccount?.data?.data?.tokenData?.desiredAccount?.address
    );
    if (process.env.ENVIRONMENT === "staging") {
      await createEthToken(
        "2",
        userData[0]?.profileId,
        firstAccount?.data?.data?.tokenData?.desiredAccount?.address
      );
    }

    // @ts-ignore
    global.SocketService.handleGetTotalUsers({
      totalUsers: String(allUsers?.length) ?? "0",
    });

    console.log("Create User Profile Api Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "User Created Successfully",
      isExit2[0]
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
    const { deviceToken } = req.query;

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

    if (deviceToken && deviceToken != "undefined" && deviceToken != "") {
      const [userUpdated] = await User.updateDeviceToken(deviceToken, id);
      return ApiResponse.successResponseWithData(
        res,
        "Get User Profile Successfully",
        userUpdated[0]
      );
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

const getUserProfileDetailsByPin = async (req, res) => {
  try {
    console.log("Get User Profile Api Pending");
    const { deviceToken } = req.query;

    const { emailAddress, pin } = req.params;

    // if (!id) {
    //   return ApiResponse.validationErrorWithData(
    //     res,
    //     "id is required in params"
    //   );
    // }

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

    const [user] = await User.getUserProfileDetailsByPin(emailAddress, pin);

    if (!user.length) {
      return ApiResponse.notFoundResponse(res, "User Not Found");
    }

    console.log("Get User Profile Api Fullfilled");

    if (user[0].accountStatus == "2") {
      return ApiResponse.validationErrorWithData(res, "Account is Deactivated");
    }

    if (deviceToken && deviceToken != "undefined" && deviceToken != "") {
      const [userUpdated] = await User.updateDeviceToken(
        deviceToken,
        emailAddress
      );
      return ApiResponse.successResponseWithData(
        res,
        "Get User Profile Successfully",
        userUpdated[0]
      );
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

    // if (req.body.metamaskAccountNumber) {
    //   const [metamaskAccountNumberCheck] =
    //     await User.findByMetamaskAccountNumber(req.body.metamaskAccountNumber);
    //   // @ts-ignore
    //   if (metamaskAccountNumberCheck.length) {
    //     const isEmailAssociated =
    //       metamaskAccountNumberCheck[0].emailAddress == req.body.emailAddress;
    //     if (!isEmailAssociated) {
    //       return ApiResponse.notFoundResponse(
    //         res,
    //         "Please connect the account associated with e-mail address"
    //       );
    //     }
    //   }
    // }

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

const serarchUsers = async (req, res) => {
  try {
    console.log("Search Users Api Pending");
    const { userName } = req.query;
    let searchQuery;
    if (!userName) {
      searchQuery = `SELECT profileId, profileName, avatar FROM users LIMIT 0, 10`;
    } else {
      searchQuery = `SELECT profileId, profileName, avatar FROM users WHERE LOWER(profileName) LIKE ('%${userName}%')`;
    }
    const [users] = await db.query(searchQuery);

    // @ts-ignore
    if (!users.length) {
      return ApiResponse.validationErrorWithData(res, "User Not Found");
    }

    console.log("Search Users Api Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Search Users Api Successfully",
      users
    );
  } catch (error) {
    console.log("Search Users Api Rejected");
    console.error(error);
    return ApiResponse.ErrorResponse(res, error.message);
  }
};

const sendEmailToSupport = async (req, res) => {
  try {
    console.log("Send Email to Support Api Pending");
    const { email, title, description, deviceType } = req.body;

    if (!email) {
      return ApiResponse.validationErrorWithData(res, "Email is required");
    }

    if (!title) {
      return ApiResponse.validationErrorWithData(res, "Title is required");
    }

    if (!description) {
      return ApiResponse.validationErrorWithData(
        res,
        "Description is required"
      );
    }

    const userNameQuery = `SELECT profileName FROM users WHERE emailAddress = "${email}"`;
    const [user] = await db.query(userNameQuery);

    const file = await ejs.renderFile(
      path.join(__dirname, "../", "views/support.ejs"),
      {
        problem: description,
        user_email: email,
        user_name: user[0]?.profileName || "",
        device_type: deviceType || "Android",
        timestamp: moment(new Date()).format("lll"),
      }
    );

    sendEmail(email, "support@napasociety.io", title, file);

    console.log("Send Email to Support Api Fullfilled");

    return ApiResponse.successResponse(res, "Email Sent Successfully");
  } catch (error) {
    console.log("Send Email to Support Api Rejected");
    console.error(error);
    return ApiResponse.ErrorResponse(res, error.message);
  }
};

const updateNotificationStatus = async (req, res) => {
  try {
    console.log("Update Notifications Status Api Pending");
    const { allowNotifications, profileId } = req.body;

    if (!profileId) {
      return ApiResponse.validationErrorWithData(res, "ProfileId is required");
    }

    const isUserExit = `SELECT profileId FROM users WHERE profileId = "${profileId}"`;
    const [user]: any = await db.query(isUserExit);

    if (!user.length) {
      return ApiResponse.notFoundResponse(res, "User Not Found");
    }

    const updateNotificationStatus = `UPDATE users SET allowNotifications = "${allowNotifications}", updatedAt = CURRENT_TIMESTAMP WHERE profileId = "${profileId}"`;
    await db.query(updateNotificationStatus);
    await socialArtDb.query(updateNotificationStatus);
    await stakingDB.query(updateNotificationStatus);

    console.log("Update Notifications Status Api Fullfilled");

    return ApiResponse.successResponse(
      res,
      "Notification status updated successfully"
    );
  } catch (error) {
    console.log("Update Notifications Status Api Rejected");
    console.error(error);
    return ApiResponse.ErrorResponse(res, error.message);
  }
};

module.exports = {
  createUserProfile,
  getUserProfileDetails,
  updateUserProfile,
  generateQR,
  verifyAuthToken,
  updateUserProfileStatus,
  getUserProfileDetailsByPin,
  serarchUsers,
  sendEmailToSupport,
  updateNotificationStatus,
};
