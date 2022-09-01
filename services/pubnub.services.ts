import { pubnub } from "..";

// add listener
const listener = {
  status: (statusEvent) => {
    if (statusEvent.category === "PNConnectedCategory") {
      console.log("Connected");
    }
  },
  message: (messageEvent) => {
    console.log("messageEvent", messageEvent);
    showMessage(messageEvent.message);
  },
};

pubnub.addListener(listener);

// subscribe to a channel
pubnub.subscribe({
  channels: ["hello_world"],
});

const showMessage = (msg) => {
  console.log("message: " + msg);
};
