/* eslint-disable @typescript-eslint/no-var-requires */
const WAValidator = require("multicoin-address-validator");
const apiResponse = require("../utils/api-response");

const walletValidator = (req, res, next) => {
  const id =
    req?.params?.id ||
    req?.body?.user?.accountNumber ||
    req?.body?.user?.napaWalletAccount ||
    req?.body?.partner?.accountNumber ||
    req?.body?.accountNumber ||
    req?.body?.whitelist?.address;

  if (id.length != 42) {
    return next();
  }
  const validate = WAValidator.validate(id, "ZRX");
  if (validate) {
    next();
  } else {
    return apiResponse.validationErrorWithData(res, "Wallet address invalid");
  }
};

module.exports = { walletValidator };
