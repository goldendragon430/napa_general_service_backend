import User from "../models/user.model";

const createUserProfile = async (req, res) => {
  try {
    const { user } = req.body;

    const newUser = new User(user);

    const [userData] = await newUser.create();

    res.status(201).json({
      message: "User Created Successfully",
      profileId: userData[0]?.profileId,
      profileName: userData[0]?.profileName,
      createdAt: userData[0].createdAt,
      primaryCurrency: userData[0].primaryCurrency,
      timezone: userData[0].timezone,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProfileDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const [user] = await User.getUserProfileDetails(id);

    if (!user.length) {
      res.status(404).json({
        message: "User Not Found",
      });
      return;
    }

    res.status(200).json({ user: user[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
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

    res.status(201).json({
      message: "User Updated Successfully",
      profileId: userData[0]?.profileId,
      profileName: userData[0]?.profileName,
      createdAt: userData[0].createdAt,
      primaryCurrency: userData[0].primaryCurrency,
      timezone: userData[0].timezone,
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
