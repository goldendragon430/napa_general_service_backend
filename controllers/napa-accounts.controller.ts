/* eslint-disable @typescript-eslint/no-var-requires */
import axios from "axios";
import { encryptString } from "../utils/encryption";
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
    const { profileId, name, index } = req.query;
    const [accounts]: any = await NapaAccounts.get(profileId);

    const activeAccounts: any = Array.from({ length: 5 }).reduce((acc: any, _, index) => {
      if (accounts[0][`NWA_${index + 1}_ST`] !== "2") {
        acc.push({
          NW_ST: accounts[0][`NWA_${index + 1}_ST`],

        })
      }
      return acc
    }, [])

    if (activeAccounts?.length > 4) {
      return ApiResponse.validationErrorWithData(
        res,
        "Can not create more than 5 accounts."
      );
    }

    const userAccounts: any = Array.from({ length: 5 }).reduce((acc: any, _, index) => {
      acc.push({
        NW_ST: accounts[0][`NWA_${index + 1}_ST`],
        NW_AC: accounts[0][`NWA_${index + 1}_AC`]
      })
      return acc
    }, [])


    const findIndex = userAccounts.findIndex(account => account?.NW_ST === "2")
    if (findIndex !== -1) {
      const accountIndex = findIndex + 1
      const [napaAccounts] = await NapaAccounts.updateAccount(
        accountIndex,
        userAccounts[findIndex][`NW_AC`],
        profileId,
        name,
      );
      return ApiResponse.successResponseWithData(
        res,
        "Add Napa Account Api Successfully",
        napaAccounts
      );
    }
    // const napa +WalletAccountPhraseDecrypted = decryptString(
    //   napaWalletAccountPhrase
    // );

    const options = {
      method: "GET",
      url: `https://napa-asset-backend-staging.napasociety.io/fetchAccountsByIndex?index=${index}&profileId=${profileId}`,
    };

    const newAccount = await axios(options);

    const newAcWalletPrivatekeyEncrpted = encryptString(
      newAccount?.data?.data?.tokenData?.desiredAccount?.privateKey
    );

    const newAcWalletAddress =
      newAccount?.data?.data?.tokenData?.desiredAccount?.address;

    const [napaAccounts] = await NapaAccounts.add(
      profileId,
      name,
      index,
      newAcWalletPrivatekeyEncrpted,
      newAcWalletAddress
    );

    console.log("Add Napa Account Api Fullfilled");

    // @ts-ignore
    global.SocketService.handleNewNapaAccount({
      id: profileId,
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

const getPhraseByProfileId = async (req, res) => {
  try {
    console.log("Get Phrase By ProfileId Api Pending");

    const { profileId } = req.query;

    const [napaAccounts] = await NapaAccounts.get(profileId);

    console.log("Get Phrase By ProfileId Api  Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Get Phrase By ProfileId Successfully",
      napaAccounts[0] ? napaAccounts[0].napaWalletAccountPhrase : null
    );
  } catch (error) {
    console.log("Get Phrase By ProfileId Api Rejected");
    console.error(error);
    return ApiResponse.ErrorResponse(res, "Unable to Get Phrase By ProfileId");
  }
};

const getPrivateKeyByProfileId = async (req, res) => {
  try {
    console.log("Get Private Key By ProfileId Api Pending");

    const { profileId } = req.query;

    const [napaAccounts] = await NapaAccounts.get(profileId);

    console.log("Get Private Key By ProfileId Api  Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Get Private Key By ProfileId Successfully",
      napaAccounts[0]
    );
  } catch (error) {
    console.log("Get Private Key By ProfileId Api Rejected");
    console.error(error);
    return ApiResponse.ErrorResponse(res, "Unable to Get Private Key By ProfileId");
  }
};


const deleteNapaAccount = async (req, res) => {
  try {
    const { profileId, accountId } = req.query;
    const [napaAccounts]: any = await NapaAccounts.get(profileId);

    if (!napaAccounts?.length) {
      return ApiResponse.validationErrorWithData(res, "Napa Account Not Found");
    }

    const activeAccounts: any = Array.from({ length: 5 }).reduce((acc: any, _, index) => {
      if (napaAccounts[0][`NWA_${index + 1}_ST`] !== "2") {
        acc.push({
          NW_ST: napaAccounts[0][`NWA_${index + 1}_ST`],
          NW_ID: index + 1
        })
      }
      return acc
    }, [])

    if (activeAccounts.length === 1) {
      return ApiResponse.validationErrorWithData(res, "You Must Have One Active Account");
    }

    const accountIds: any = Array.from({ length: 5 }).reduce((acc: any, _, index) => {
      acc.push({
        NW_AC: napaAccounts[0][`NWA_${index + 1}_AC`]
      })
      return acc
    }, [])

    const findAccountIndex = accountIds.findIndex(account => account?.NW_AC == accountId)
    const activeAnotherAccount = activeAccounts.find(item => item?.NW_ID !== findAccountIndex + 1);
    const activeAccountIndex = activeAnotherAccount["NW_ID"]

    if (findAccountIndex === -1) {
      return ApiResponse.validationErrorWithData(res, "Napa Account Not Found");
    }
    const accountIndex = findAccountIndex + 1
    const [deletedAccounts] = await NapaAccounts.delete(
      accountIndex,
      accountId,
      profileId, activeAccountIndex
    );

    return ApiResponse.successResponseWithData(
      res,
      "Napa Account Delete Successfully",
      deletedAccounts[0]
    );
  } catch (error) {
    console.log("Delete Napa Account Api Rejected");
    console.error(error);
    return ApiResponse.ErrorResponse(res, "Unable to Delete Napa Account");
  }
};

module.exports = {
  getNapaAccounts,
  AddNapaAccount,
  switchNapaAccount,
  getPhraseByProfileId,
  getPrivateKeyByProfileId,
  deleteNapaAccount
};
