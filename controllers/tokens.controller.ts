/* eslint-disable @typescript-eslint/no-var-requires */
const ApiResponse = require("../utils/api-response");
import Tokens from "../models/tokens.model";

const importToken = async (req, res) => {
  try {
    console.log("Import Token Api Pending");

    const token = req.body;

    const tokens = [];
    tokens.push(token.tokenAddresses);

    token.tokenAddresses = `${tokens.join(",")}`;

    const [isExit] = await Tokens.get(
      token.napaWalletAccount,
      token.networkId,
      token.tokenAddresses
    );

    if (isExit.length) {
      return ApiResponse.notFoundResponse(
        res,
        "Token is already imported on this network"
      );
    }
    const newToken = new Tokens(token);

    const [tokenData] = await newToken.create();

    console.log("Import Token Api Fullfilled");

    // @ts-ignore
    global.SocketService.handleGetNewImportedToken({
      token: tokenData[0],
    });

    return ApiResponse.successResponseWithData(
      res,
      "Token Imported Successfully",
      tokenData[0]
    );
  } catch (error) {
    console.log("Import Token Api Rejected");
    console.error(error);
    return ApiResponse.ErrorResponse(res, error.message);
  }
};

const getImportedTokens = async (req, res) => {
  try {
    console.log("Get Imported Tokens Api Pending");

    const { napaWalletAccount, networkId } = req.query;

    const [tokensData] = await Tokens.getTokens(napaWalletAccount, networkId);

    if (!tokensData.length) {
      return ApiResponse.notFoundResponse(res, "Tokens Not Found");
    }

    console.log("Get Imported Tokens Api Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Get Imported Tokens Api Successfully",
      tokensData
    );
  } catch (error) {
    console.log("Get Imported Tokens Api Rejected");
    console.error(error);
    return ApiResponse.ErrorResponse(res, "Unable to imported tokens profile");
  }
};

const updateTokenVisibility = async (req, res) => {
  try {
    console.log("Update Token Visibility Api Pending");
    const { tokenId, visible } = req.query;
    
    const [tokenData] = await Tokens.updateVisibility(tokenId, visible);
    
    console.log("Get Imported Tokens Api Fullfilled");
    // @ts-ignore
    global.SocketService.handleTokenVisibility({
      profileId:tokenData[0]?.profileId,
      token: tokenData[0],
    });
    return ApiResponse.successResponseWithData(
      res,
      "Update Token Visibility Successfully",
      tokenData[0]
    );
  } catch (error) {
    console.log("Update Token Visibility Api Rejected");
    console.error(error);
    return ApiResponse.ErrorResponse(res, "Unable to Update Token Visibility");
  }
};

module.exports = {
  importToken,
  getImportedTokens,
  updateTokenVisibility,
};
