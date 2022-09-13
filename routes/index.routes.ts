/* eslint-disable @typescript-eslint/no-var-requires */
const UserRouter = require("../routes/user.routes");
const ChatRouter = require("../routes/chat.routes");
const HealthRouter = require("../routes/health.routes");
const PartnerRouter = require("../routes/partners.routes");
const WhitelistRouter = require("../routes/whitelist.routes");
const TrendingRouter = require("../routes/trending.routes");
const FaqRouter = require("../routes/faq.routes");

const setUpRoutes = (app) => {
  app.use("/user", UserRouter.router);
  app.use("/chat", ChatRouter.router);
  app.use("/health", HealthRouter.router);
  app.use("/partners", PartnerRouter.router);
  app.use("/account", WhitelistRouter.router);
  app.use("/trending", TrendingRouter.router);
  app.use("/faq", FaqRouter.router);
};

module.exports = { setUpRoutes };
