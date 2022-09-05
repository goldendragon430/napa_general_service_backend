/* eslint-disable @typescript-eslint/no-var-requires */
const UserRouter = require("../routes/user.routes");
const ChatRouter = require("../routes/chat.routes");
const HealthRouter = require("../routes/health.routes");

const setUpRoutes = (app) => {
  app.use("/user", UserRouter.router);
  app.use("/chat", ChatRouter.router);
  app.use("/health", HealthRouter.router);
};

module.exports = { setUpRoutes };
