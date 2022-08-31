const UserRouter = require("../routes/user.routes");

const setUpRoutes = (app) => {
  app.use("/user", UserRouter.router);
};

module.exports = { setUpRoutes };
