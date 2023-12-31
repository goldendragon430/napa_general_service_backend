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
    setInterval(() => {
      this.wss.clients.forEach((socket) => {
        socket.ping((err) => {
          console.log(err);
        });
      });
    }, 50000);
  }

  stringify(data) {
    return JSON.stringify(data);
  }

  handleSendMessage(payload) {
    this.wss.clients.forEach((socket) => {
      socket.send(
        this.stringify({
          event: "message",
          message: payload.messageEvent,
        })
      );
    });
  }

  handleGetTrendings(payload) {
    this.wss.clients.forEach((socket) => {
      console.log("Trending feeds send with websocket");
      socket.send(
        this.stringify({
          event: "trending",
          trending: payload.trending,
        })
      );
    });
  }

  handleGetEvents(payload) {
    this.wss.clients.forEach((socket) => {
      console.log("Events send with websocket");
      socket.send(
        this.stringify({
          event: "events",
          events: payload.events,
        })
      );
    });
  }

  handleGetNewImportedToken(payload) {
    this.wss.clients.forEach((socket) => {
      console.log("Imported token send with websocket");
      socket.send(
        this.stringify({
          event: "new-imported-token",
          token: payload.token,
        })
      );
    });
  }

  handleGetTotalUsers(payload) {
    this.wss.clients.forEach((socket) => {
      console.log("Total users send with websocket");
      socket.send(
        this.stringify({
          event: "total-users",
          totalUsers: payload.totalUsers,
        })
      );
    });
  }

  handleLoginUserToWeb(payload) {
    this.wss.clients.forEach((socket) => {
      console.log("User send with websocket");
      socket.send(
        this.stringify({
          event: `login-event-${payload.id}`,
          profileId: payload.profileId,
          emailAddress: payload.emailAddress,
          napaWalletAccount: payload.napaWalletAccount,
        })
      );
    });
  }

  handleUpdateUser(payload) {
    this.wss.clients.forEach((socket) => {
      console.log("Updated User send with websocket");
      socket.send(
        this.stringify({
          event: `update-user-${payload.user.profileId}`,
          user: payload.user,
        })
      );
    });
  }

  handleNewNapaAccount(payload) {
    this.wss.clients.forEach((socket) => {
      console.log("New napa account send with websocket");
      socket.send(
        this.stringify({
          event: `new-napa-account-${payload.id}`,
        })
      );
    });
  }

  handleSwitchNapaAccount(payload) {
    this.wss.clients.forEach((socket) => {
      console.log("Switch to new napa account send with websocket");
      socket.send(
        this.stringify({
          event: `switch-to-new-napa-account-${payload.profileId}`,
          account: payload.account,
        })
      );
    });
  }

  handleDeleteNapaAccount(payload) {
    this.wss.clients.forEach((socket) => {
      console.log("Switch to new napa account send with websocket");
      socket.send(
        this.stringify({
          event: `delete-napa-account-${payload.profileId}`,
          account: payload.account,
        })
      );
    });
  }

  handleTokenVisibility(payload) {
    this.wss.clients.forEach((socket) => {
      console.log("Token visibility send with websocket");
      socket.send(
        this.stringify({
          event: `token-visibility-update-${payload.profileId}`,
          token: payload.token,
        })
      );
    });
  }
}

module.exports.SocketService = SocketService;
