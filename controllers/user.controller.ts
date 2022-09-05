import User from "../models/user.model";

const createUserProfile = async (req, res) => {
  try {
    const { user } = req.body;

    const newUser = new User(user);

    const [userData] = await newUser.save();

    res.status(201).json({
      message: "User Created Successfully",
      napa_profile_id: userData[0]?.napa_profile_id,
      profile_name: userData[0]?.profile_name,
      created_at: userData[0].created_at,
      primary_currency: userData[0].primary_currency,
      Timezone: userData[0].Timezone,
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
      napa_profile_id: userData[0]?.napa_profile_id,
      profile_name: userData[0]?.profile_name,
      updated_at: userData[0].updated_at,
      primary_currency: userData[0].primary_currency,
      Timezone: userData[0].Timezone,
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
