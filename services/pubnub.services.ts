/* eslint-disable @typescript-eslint/no-var-requires */
import { pubnub } from "..";

// add listener
const listener = {
  status: (statusEvent) => {
    if (statusEvent.category === "PNConnectedCategory") {
      console.log("Connected");
    }
  },
  message: (messageEvent) => {
    // @ts-ignore
    global.SocketService.handleSendMessage({
      messageEvent,
    });

    showMessage(messageEvent.message.text, messageEvent.message.from);
  },
};

pubnub.addListener(listener);

// subscribe to a channel
pubnub.subscribe({
  channels: ["NAPA-SOCIETY"],
});

export const showMessage = (msg, username) => {
  return {
    message: msg,
    username,
  };
};
