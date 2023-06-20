import axios from "axios";
import Tokens from "../models/tokens.model";

export const createNapaToken = async (
  networkId: string,
  profileId: string,
  napaWalletAccount: string
) => {
  const tokenAddresses = process.env.CONTRACT_ADDRESS;

  const options3 = {
    method: "GET",
    url: `https://napa-asset-backend-staging.napasociety.io/importTokens?chainId=${networkId}&contracts=${tokenAddresses}`,
  };

  const resp = await axios(options3);

  const token = {
    profileId,
    napaWalletAccount,
    networkId,
    decimals: resp.data?.data?.tokenData?.response[0]?.decimals,
    symbol: resp.data?.data?.tokenData?.response[0]?.symbol,
    name: resp.data?.data?.tokenData?.response[0]?.name,
    tokenAddresses,
  };
  // @ts-ignore
  const newToken = new Tokens(token);

  await newToken.create();
};

export const createEthToken = async (
  networkId: string,
  profileId: string,
  napaWalletAccount: string
) => {
  const token = {
    profileId,
    napaWalletAccount,
    networkId,
    decimals: "0",
    symbol: "ETH",
    name: networkId == "0" ? "ETH" : "SepoliaETH",
    tokenAddresses: "",
  };
  // @ts-ignore
  const newToken = new Tokens(token);

  await newToken.create();
};
