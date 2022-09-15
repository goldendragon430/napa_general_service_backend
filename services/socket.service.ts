/* eslint-disable @typescript-eslint/no-var-requires */
class SocketService {
  wss;
  successMessage;
  failMessage;
  constructor(wss) {
    this.wss = wss;
    this.failMessage =
      "Auth failed Please connect with socket API with following url ws://domain/connect&auth=token";
    this.successMessage =
      "You have been connected successfully to the socket API use the following format to communicate:  {type:string,data:{}}";
  }

  init() {
    this.wss.on("connection", (socket) => {
      console.log("connected successfully");

      socket.on("error", function (event) {
        console.log("WebSocket error: ", event);
      });
      socket.on("close", (event) => {
        console.log("The connection has been closed successfully.", event);
      });
      socket.on("message", function (event) {
        console.log("Message from server ", event.data);
      });
      socket.on("open", (event) => {
        console.log("open from server ", event.data);
      });
    });
  }

  stringify(data) {
    return JSON.stringify(data);
  }

  handleSendMessage(payload) {
    this.wss.clients.forEach((socket) => {
      socket.send(
        this.stringify({
          message: payload.messageEvent,
        })
      );
    });
  }

  handleGetTrendings(payload) {
    console.log("payload", payload.trending);
    this.wss.clients.forEach((socket) => {
      console.log("Trending feeds send with websocket");
      socket.send(
        this.stringify({
          trending: payload.trending,
        })
      );
    });
  }

  handleGetEvents(payload) {
    console.log("payload", payload.events);
    this.wss.clients.forEach((socket) => {
      console.log("Events send with websocket");
      socket.send(
        this.stringify({
          events: payload.events,
        })
      );
    });
  }
}

module.exports.SocketService = SocketService;
