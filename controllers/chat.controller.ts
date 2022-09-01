import { pubnub } from "..";

const sendMessage = async (req, res) => {
  try {
    const { message, from } = req.body;
    await pubnub.publish({
      channel: "NAPA-SOCIETY",
      message: {
        text: message,
        from,
      },
    });
    res.status(201).json({ message: "Send Message" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    pubnub.fetchMessages(
      {
        channels: ["NAPA-SOCIETY"],
        // end: "16620307204932926",
        count: 100,
      },
      (status, response) => {
        res.status(200).json({ messages: response.channels["NAPA-SOCIETY"] });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getMessages };
