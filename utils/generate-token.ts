/* eslint-disable @typescript-eslint/no-var-requires */
const jwt = require("jsonwebtoken");

const generateTokenWithPayload = (payload, expiry) => {
  return jwt.sign(payload, process.env.secret, {
    expiresIn: expiry,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.secret);
};

module.exports = { generateTokenWithPayload, verifyToken };
