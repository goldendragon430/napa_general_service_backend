/* eslint-disable @typescript-eslint/no-var-requires */
const jwt = require("jsonwebtoken");

const generateTokenWithPayload = (payload, expiry) => {
  return jwt.sign(payload, "napasecret", {
    expiresIn: expiry,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, "napasecret");
};

module.exports = { generateTokenWithPayload, verifyToken };
