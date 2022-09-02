import User from "../models/user.model";

const createUserProfile = async (req, res) => {
  try {
    const { user } = req.body;

    const newUser = new User(user);

    await newUser.save();

    res.status(201).json({ message: "User Created Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProfileDetails = async (req, res) => {
  try {
    const { profileId } = req.params;

    const [user] = await User.getUserProfileDetails(profileId);

    res.status(200).json({ user: user[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { user } = req.body;

    const updateUser = new User(user);

    await updateUser.update();

    res.status(200).json({
      message: "User Updated Successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUserProfile,
  getUserProfileDetails,
  updateUserProfile,
};
