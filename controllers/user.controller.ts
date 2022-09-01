import User from "../models/user.model";

const createUser = async (req, res) => {
  try {
    const { user } = req.body;

    let newUser = new User(user);

    newUser = await newUser.save();

    res.status(201).json({ message: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserByAccountNumber = async (req, res) => {
  try {
    const accountNumber = req.params.accountNumber;

    const [user] = await User.getUserByAccountNumber(accountNumber);

    res.status(200).json({ user: user[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createUser, getUserByAccountNumber };
