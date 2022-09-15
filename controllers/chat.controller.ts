/* eslint-disable @typescript-eslint/no-var-requires */
import { pubnub } from "..";
const ApiResponse = require("../utils/api-response");

const sendMessage = async (req, res) => {
  try {
    console.log("Send Message Pending");
    const { message, from } = req.body;
    await pubnub.publish({
      channel: "NAPA-SOCIETY",
      message: {
        text: message,
        from,
      },
    });

    console.log("Send Message Fullfilled");

    return ApiResponse.successResponseWithData(res, "Send Message", {});
  } catch (error) {
    console.log(error);
    console.log("Send Message Rejected");
    return ApiResponse.ErrorResponse(res, "Unable to send messages");
  }
};

const getMessages = async (req, res) => {
  try {
    console.log("Get Messages Pending");
    pubnub.fetchMessages(
      {
        channels: ["NAPA-SOCIETY"],
        count: 100,
      },
      (status, response) => {
        console.log("Get Messages Fullfilled");

        return ApiResponse.successResponseWithData(
          res,
          "Get Messages Successfully",
          {
            messages: response.channels["NAPA-SOCIETY"],
          }
        );
      }
    );
  } catch (error) {
    console.log("Get Messages Rejected");
    console.log(error);
    return ApiResponse.ErrorResponse(res, "Unable to fetch messages");
  }
};

module.exports = { sendMessage, getMessages };
