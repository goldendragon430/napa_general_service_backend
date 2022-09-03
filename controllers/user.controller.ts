import User from "../models/user.model";

const createUserProfile = async (req, res) => {
  try {
    const { user } = req.body;

    const newUser = new User(user);

    const [user_data] = await newUser.save();

    res.status(201).json({
      message: "User Created Successfully",
      napa_profile_id: user_data[0]?.napa_profile_id,
      profile_name: user_data[0]?.profile_name,
      created_at: user_data[0].created_at,
      primary_currency: user_data[0].primary_currency,
    });
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
    const { profileId } = req.params;

    const { user } = req.body;

    const updateUser = new User(user);

    await updateUser.update(profileId);

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
