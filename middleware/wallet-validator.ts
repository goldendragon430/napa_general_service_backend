/* eslint-disable @typescript-eslint/no-var-requires */
const WAValidator = require("multicoin-address-validator");

const walletValidator = (accountNumber, res, next) => {
  const validate = WAValidator.validate(accountNumber, "ZRX");
  if (validate) {
    next();
  } else {
    return res.status(400).json({
      message: "Wallet address invalid",
    });
  }
};

module.exports = { walletValidator };
