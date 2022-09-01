import { pubnub } from "..";

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    await pubnub.publish({
      channel: "hello_world",
      message,
    });
    res.status(201).json({ message: "Send Message" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage };
