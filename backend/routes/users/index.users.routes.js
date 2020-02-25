const users = require('./users.routes');

module.exports = (router) => {
    users(router);
    return router;
};