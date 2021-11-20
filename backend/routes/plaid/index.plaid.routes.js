const plaid = require("./plaid.routes");

module.exports = (router) => {
  plaid(router);
  return router;
};
