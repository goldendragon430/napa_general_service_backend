/* eslint-disable @typescript-eslint/no-var-requires */
const jwt = require("jsonwebtoken");

const generateTokenWithPayload = (payload, expiry) => {
  return jwt.sign(payload, process.env.SECRET, {
    expiresIn: expiry,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.SECRET);
};

module.exports = { generateTokenWithPayload, verifyToken };
