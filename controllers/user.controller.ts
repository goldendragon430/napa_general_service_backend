const User = require("../models/user.model");

const createUser = async (req, res) => {
  try {
    const { user } = req.body;

    let newUser = new User(user);

    newUser = await newUser.save();

    res.status(201).json({ message: "User created" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = { createUser };
