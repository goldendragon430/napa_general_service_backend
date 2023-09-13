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
import { generatePIN } from "../utils/pin";
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
      return ApiResponse.validationErrorWithData(
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

const generatePin = async (req, res) => {
  try {
    console.log("Generate Pin Api Pending");
    const { email } = req.body;
    const profileQuery = `SELECT * FROM users WHERE emailAddress = "${email}"`;
    const [profile] = await db.query(profileQuery);

    //@ts-ignore
    if (!profile.length) {
      return ApiResponse.validationErrorWithData(res, "Profile Not Found");
    }
    const pin = generatePIN();
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 5);

    const updateRecoveryPin = `UPDATE users SET recoveryPin = "${pin}", expirationTime = "${expirationTime.getTime()}" WHERE emailAddress = "${email}"`;
    await db.query(updateRecoveryPin);
    await socialArtDb.query(updateRecoveryPin);
    await stakingDB.query(updateRecoveryPin);

    const file = await ejs.renderFile(
      path.join(__dirname, "../", "views/recovery.ejs"),
      {
        user_name: profile[0]?.profileName || "",
        pin: pin,
      }
    );

    sendEmail(
      "NAPA Society <verify@napasociety.io>",
      email,
      "Account Recovery",
      file
    );

    console.log("Generate Pin Api Fullfilled");

    return ApiResponse.successResponse(
      res,
      "Pin Code sent successfully. Please Check your email"
    );
  } catch (error) {
    console.log("Generate Pin Api Rejected");
    console.error(error);
    return ApiResponse.ErrorResponse(res, error.message);
  }
};

const verifyPin = async (req, res) => {
  try {
    const current = new Date();
    console.log("Verify Pin Api Pending");
    const { recoveryPin, email } = req.body;
    const profileQuery = `SELECT * FROM users WHERE emailAddress = "${email}" AND recoveryPin = "${recoveryPin}" AND CONVERT(expirationTime, SIGNED) > ${current.getTime()}`;
    const [profile] = await db.query(profileQuery);

    console.log("Verify Pin Api Fullfilled");

    //@ts-ignore
    if (!profile.length) {
      return ApiResponse.validationErrorWithData(
        res,
        "Invalid PIN or PIN has expired."
      );
    }
    return ApiResponse.successResponse(res, "Pin Code verified successfully.");
  } catch (error) {
    console.log("Verify Pin Api Rejected");
    console.error(error);
    return ApiResponse.ErrorResponse(res, error.message);
  }
};

const recoverAccount = async (req, res) => {
  try {
    console.log("Recover Account Api Pending");
    const { pin, email, deviceToken } = req.body;
    const profileQuery = `SELECT * FROM users WHERE emailAddress = "${email}"`;
    const [profile] = await db.query(profileQuery);

    //@ts-ignore
    if (!profile.length) {
      return ApiResponse.validationErrorWithData(res, "User Not Found");
    }

    const updateProfile = `UPDATE users SET registrationType = "${
      pin && pin != "" && pin != "undefined" ? "Pin" : "Biometric"
    }", pin = "${
      pin && pin != "" && pin != "undefined" ? encryptString(pin) : ""
    }", recoveryPin = "", expirationTime = "" WHERE emailAddress = "${email}"`;
    await db.query(updateProfile);
    await socialArtDb.query(updateProfile);
    await stakingDB.query(updateProfile);

    if (deviceToken && deviceToken != "undefined" && deviceToken != "") {
      const [userUpdated] = await User.updateDeviceToken(deviceToken, email);
      console.log("Recover Account Api Fullfilled");
      return ApiResponse.successResponseWithData(
        res,
        "Get User Profile Successfully",
        userUpdated[0]
      );
    }

    const [user] = await User.getUserProfileDetails(email);

    console.log("Recover Account Api Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Get User Profile Successfully",
      user[0]
    );
  } catch (error) {
    console.log("Recover Account Api Rejected");
    console.error(error);
    return ApiResponse.ErrorResponse(res, error.message);
  }
};

const archieveAccount = async (req, res) => {
  try {
    console.log("Archive Account Api Pending");
    const { email } = req.body;
    const profileQuery = `SELECT * FROM users WHERE emailAddress = "${email}"`;
    const [profile] = await db.query(profileQuery);

    //@ts-ignore
    if (!profile.length) {
      return ApiResponse.validationErrorWithData(res, "User Not Found");
    }

    const tableQuery =
      "CREATE TABLE IF NOT EXISTS archived_users (rowId INTEGER AUTO_INCREMENT NOT NULL UNIQUE KEY, profileId VARCHAR(45) NOT NULL PRIMARY KEY, biometricPublickey VARCHAR(255), metamaskAccountNumber VARCHAR(255), napaWalletAccount VARCHAR(255), binanceWalletAccount VARCHAR(255), emailAddress VARCHAR(255) NOT NULL, accountStatus ENUM('1', '2', '3') NOT NULL DEFAULT '2', profileName VARCHAR(100) NOT NULL, bio VARCHAR(512) NULL, timezone VARCHAR(255) NULL, primaryCurrency  ENUM('NAPA','BNB','ETH') DEFAULT 'NAPA', language VARCHAR(255) DEFAULT 'English', accountType TEXT NULL, registrationType VARCHAR(45), pin VARCHAR(255), createdAt TIMESTAMP NOT NULL DEFAULT NOW(), updatedAt TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(), avatar LONGTEXT, awardsEarned INT, awardsGiven INT, netAwardsAvailable INT, dailyActive VARCHAR(45) NOT NULL, monthlyActive VARCHAR(45) NOT NULL, fans INT DEFAULT 0, fansOf INT DEFAULT 0, deviceToken VARCHAR(255), termsAndCondition VARCHAR(20) DEFAULT 'false', allowNotifications VARCHAR(20) DEFAULT 'false', recoveryPin VARCHAR(6), expirationTime BIGINT)";

    await db.execute(tableQuery);

    const archiveProfileQuery = `SELECT * FROM archived_users WHERE emailAddress = "${email}"`;
    const [archiveProfile] = await db.query(archiveProfileQuery);

    //@ts-ignore
    if (!archiveProfile.length) {
      const insertQuery = `INSERT INTO archived_users (profileId, biometricPublickey, metamaskAccountNumber, napaWalletAccount, binanceWalletAccount, emailAddress, accountStatus, profileName, bio, timezone, primaryCurrency, language, accountType, registrationType, pin, avatar, dailyActive, monthlyActive, fans, fansOf, deviceToken, termsAndCondition, allowNotifications, recoveryPin, expirationTime, createdAt, updatedAt) VALUES ("${
        profile[0]?.profileId
      }", "${profile[0]?.biometricPublickey || ""}", "${
        profile[0]?.metamaskAccountNumber || ""
      }", "${profile[0]?.napaWalletAccount || ""}", "${
        profile[0]?.binanceWalletAccount || ""
      }", "${profile[0]?.emailAddress || ""}", "2", "${
        profile[0]?.profileName
      }", "${profile[0]?.bio || ""}", "${profile[0]?.timezone || ""}", "${
        profile[0]?.primaryCurrency || "NAPA"
      }", "${profile[0]?.language || "English"}", "${
        profile[0]?.accountType || ""
      }", 
    "${profile[0]?.registrationType || "Biometric"}",
    "${profile[0]?.pin || ""}",
    "${profile[0]?.avatar || ""}", "${profile[0]?.dailyActive || "false"}", "${
        profile[0]?.monthlyActive || "false"
      }", "${profile[0].fans || 0}", "${profile[0]?.fansOf || 0}", "${
        profile[0]?.deviceToken || ""
      }", "${profile[0]?.termsAndCondition || "false"}", "${
        profile[0]?.allowNotifications || "false"
      }" , "", "", "${profile[0]?.createdAt}", "${profile[0]?.updatedAt}")`;

      await db.execute(insertQuery);
      const deleteQuery = `DELETE FROM users WHERE emailAddress = "${email}"`;
      await db.execute(deleteQuery);
      await socialArtDb.execute(deleteQuery);
      await stakingDB.execute(deleteQuery);
    } else {
      const updateQuery = `UPDATE archived_users SET profileId = "${
        profile[0]?.profileId
      }", biometricPublickey = "${
        profile[0]?.biometricPublickey || ""
      }", metamaskAccountNumber = "${
        profile[0]?.metamaskAccountNumber || ""
      }", napaWalletAccount = "${
        profile[0]?.napaWalletAccount || ""
      }", binanceWalletAccount = "${
        profile[0]?.binanceWalletAccount || ""
      }", accountStatus = "2", profileName = "${
        profile[0]?.profileName
      }", bio = "${profile[0]?.bio || ""}", timezone = "${
        profile[0]?.timezone || ""
      }", primaryCurrency = "${
        profile[0]?.primaryCurrency || "NAPA"
      }", language = "${profile[0]?.language || "English"}", accountType = "${
        profile[0]?.accountType || ""
      }", registrationType = "${
        profile[0]?.registrationType || "Biometric"
      }", pin = "${profile[0]?.pin || ""}", avatar = "${
        profile[0]?.avatar || ""
      }", dailyActive = "${
        profile[0]?.dailyActive || "false"
      }", monthlyActive = "${profile[0]?.monthlyActive || "false"}", fans = "${
        profile[0].fans || 0
      }", fansOf = "${profile[0]?.fansOf || 0}", deviceToken = "${
        profile[0]?.deviceToken || ""
      }", termsAndCondition = "${
        profile[0]?.termsAndCondition || "false"
      }", allowNotifications = "${
        profile[0]?.allowNotifications || "false"
      }", recoveryPin = "", expirationTime = "", createdAt = "${
        profile[0]?.createdAt
      }", updatedAt = "${
        profile[0]?.updatedAt
      }" WHERE emailAddress = "${email}"`;

      await db.execute(updateQuery);
      const deleteQuery = `DELETE FROM users WHERE emailAddress = "${email}"`;
      await db.execute(deleteQuery);
      await socialArtDb.execute(deleteQuery);
      await stakingDB.execute(deleteQuery);
    }

    const file = await ejs.renderFile(
      path.join(__dirname, "../", "views/archieve.ejs"),
      {
        user_name: profile[0]?.profileName || "",
      }
    );

    sendEmail(
      "NAPA Society <verify@napasociety.io>",
      email,
      "Account Archived",
      file
    );
    return ApiResponse.successResponse(res, "Account Archieved Successfully");
  } catch (error) {
    console.log("Archive Account Api Rejected");
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
  generatePin,
  verifyPin,
  recoverAccount,
  archieveAccount
};
