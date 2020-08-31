const usersMeta = require("./usersMeta.routes");

module.exports = (router) => {
  usersMeta(router);
  return router;
};
