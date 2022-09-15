import User from "../models/user.model";
const ApiResponse = require("../utils/api-response");

const createUserProfile = async (req, res) => {
  try {
    console.log("Create User Profile Pending");

    const { user } = req.body;

    const newUser = new User(user);

    const [userData] = await newUser.create();

    console.log("Create User Profile Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "User Created Successfully",
      userData[0]
    );
  } catch (error) {
    console.log("Create User Profile Rejected");
    console.error(error);
    return ApiResponse.ErrorResponse(res, "Unable to create user profile");
  }
};

const getUserProfileDetails = async (req, res) => {
  try {
    console.log("Get User Profile Pending");

    const { id } = req.params;

    const [user] = await User.getUserProfileDetails(id);

    if (!user.length) {
      return ApiResponse.notFoundResponse(res, "User Not Found");
    }

    console.log("Get User Profile Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Get User Profile Successfully",
      user[0]
    );
  } catch (error) {
    console.log("Get User Profile Rejected");
    console.error(error);
    return ApiResponse.ErrorResponse(res, "Unable to fetch user profile");
  }
};

const updateUserProfile = async (req, res) => {
  try {
    console.log("Get Update User Profile Pending");

    const { id } = req.params;

    const { user } = req.body;

    const updateUser = new User(user);

    const [userData] = await updateUser.update(id);

    if (!userData.length) {
      res.status(404).json({
        message: "User Not Found",
      });
      return;
    }

    console.log("Get Update User Profile Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "User Updated Successfully",
      userData[0]
    );
  } catch (error) {
    return ApiResponse.ErrorResponse(res, "Unable to user update");
  }
};

module.exports = {
  createUserProfile,
  getUserProfileDetails,
  updateUserProfile,
};
