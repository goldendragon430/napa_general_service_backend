/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
// import { userValidationRule } from "../utils/validation-rules";
const UserController = require("../controllers/user.controller");
const router = express.Router();
const { walletValidator } = require("../middleware/wallet.middleware");
const { uuidValidator } = require("../middleware/uuid.middleware");
// const { typeValidation } = require("../middleware/validation.middleware");

import multer from "multer";

const avatarUpload = multer({
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (
      !file.originalname.endsWith(".png") &&
      !file.originalname.endsWith(".jpg") &&
      !file.originalname.endsWith(".jpeg")
    ) {
      cb(new Error("Please select a jpg or png file"));
    }
    cb(undefined, true);
  },
});

router.post(
  "/account/new",
  avatarUpload.single("avatar"),
  // typeValidation(userValidationRule),
  // walletValidator,
  UserController.createUserProfile
);
router.get(
  "/account/details/:id",
  uuidValidator,
  walletValidator,
  UserController.getUserProfileDetails
);
router.get("/search", UserController.serarchUsers);
router.get(
  "/account/detailsByPin/:emailAddress/:pin",
  // uuidValidator,
  // walletValidator,
  UserController.getUserProfileDetailsByPin
);
router.patch(
  "/account/status/update/:id",
  UserController.updateUserProfileStatus
);
router.patch(
  "/account/update/:id",
  avatarUpload.single("avatar"),
  // uuidValidator,
  // walletValidator,
  // typeValidation(userValidationRule),
  UserController.updateUserProfile
);
router.get("/account/generateQrCode", UserController.generateQR);
router.post("/account/verifyAuthToken", UserController.verifyAuthToken);
router.post(
  "/support/email",
  UserController.sendEmailToSupport
);
router.post(
  "/notification/status/update",
  UserController.updateNotificationStatus
);
router.post(
  "/generatePin",
  UserController.generatePin
);
router.post(
  "/verifyPin",
  UserController.verifyPin
);
router.post(
  "/account/recover",
  UserController.recoverAccount
);
router.post(
  "/account/archive",
  UserController.archieveAccount
);

module.exports = { router };
