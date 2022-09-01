/* eslint-disable @typescript-eslint/no-var-requires */
const UserRouter = require("../routes/user.routes");
const ChatRouter = require("../routes/chat.routes");

const setUpRoutes = (app) => {
  app.use("/user", UserRouter.router);
  app.use("/chat", ChatRouter.router);
};

module.exports = { setUpRoutes };
