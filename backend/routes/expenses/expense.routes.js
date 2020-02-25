const controller = require('../../controllers/expense.controller');


module.exports = (router) => {

    router.route('/expense')
        .post(controller.create)

    router.route('/expense')
        .get(controller.findAll)


};