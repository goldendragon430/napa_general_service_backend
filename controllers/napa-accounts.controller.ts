/* eslint-disable @typescript-eslint/no-var-requires */
import axios from "axios";
import { decryptString, encryptString } from "../utils/encryption";
import NapaAccounts from "../models/napa-accounts.model";
const ApiResponse = require("../utils/api-response");

const getNapaAccounts = async (req, res) => {
  try {
    console.log("Get Napa Accounts Api Pending");

    const { profileId } = req.query;

    const [napaAccounts] = await NapaAccounts.get(profileId);

    console.log("Get Napa Accounts Api Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Get Napa Accounts Successfully",
      napaAccounts[0]
    );
  } catch (error) {
    console.log("Get Napa Accounts Api Rejected");
    console.error(error);
    return ApiResponse.ErrorResponse(res, "Unable to Get Napa Accounts");
  }
};

const AddNapaAccount = async (req, res) => {
  try {
    console.log("Add Napa Account Api Pending");

    const { napaWalletAccountPhrase, name, index } = req.query;

    if (index > 4) {
      return ApiResponse.validationErrorWithData(
        res,
        "Can not create more than 5 accounts."
      );
    }

    const napaWalletAccountPhraseDecrypted = decryptString(
      napaWalletAccountPhrase
    );

    const options = {
      method: "GET",
      url: `https://napa-asset-backend-staging.napasociety.io/fetchAccountsByIndex?index=${index}&phrase=${napaWalletAccountPhraseDecrypted}`,
    };

    const newAccount = await axios(options);

    const newAcWalletPrivatekeyEncrpted = encryptString(
      newAccount?.data?.data?.tokenData?.desiredAccount?.privateKey
    );

    const newAcWalletAddress =
      newAccount?.data?.data?.tokenData?.desiredAccount?.address;

    const [napaAccounts] = await NapaAccounts.add(
      napaWalletAccountPhrase,
      name,
      index,
      newAcWalletPrivatekeyEncrpted,
      newAcWalletAddress
    );

    console.log("Add Napa Account Api Fullfilled");

    // @ts-ignore
    global.SocketService.handleNewNapaAccount({
      id: napaWalletAccountPhrase,
    });

    return ApiResponse.successResponseWithData(
      res,
      "Add Napa Account Api Successfully",
      napaAccounts[0]
    );
  } catch (error) {
    console.log("Add Napa Account Api Rejected");
    console.error(error);
    return ApiResponse.ErrorResponse(res, "Error adding new NAPA Wallet account");
  }
};

const switchNapaAccount = async (req, res) => {
  try {
    console.log("Switch Napa Account Api Pending");

    const { profileId, index } = req.query;

    const [napaAccounts] = await NapaAccounts.get(profileId);

    // @ts-ignore
    if (!napaAccounts.length) {
      return ApiResponse.validationErrorWithData(res, "Napa Account Not Found");
    }

    const [updatedAccounts] = await NapaAccounts.switchAccount(
      profileId,
      index
    );

    console.log("Switch Napa Account Api Fullfilled");

    // @ts-ignore
    global.SocketService.handleSwitchNapaAccount({
      profileId,
      account: updatedAccounts[0],
    });

    return ApiResponse.successResponseWithData(
      res,
      "Switch Napa Account Successfully",
      updatedAccounts[0]
    );
  } catch (error) {
    console.log("Switch Napa Account Api Rejected");
    console.error(error);
    return ApiResponse.ErrorResponse(res, "Unable to Switch Napa Account");
  }
};

module.exports = {
  getNapaAccounts,
  AddNapaAccount,
  switchNapaAccount,
};
