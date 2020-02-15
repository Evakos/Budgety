const users = require('../users/users.routes');

module.exports = (router) => {
    users(router);
    return router;
};