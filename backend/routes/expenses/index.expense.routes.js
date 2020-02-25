const expenses = require('./expense.routes');

module.exports = (router) => {
    expenses(router);
    return router;
};