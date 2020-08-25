const expenses = require("./globalExpense.routes");

module.exports = (router) => {
  expenses(router);
  return router;
};
