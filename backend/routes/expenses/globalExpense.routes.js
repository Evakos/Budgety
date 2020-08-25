const controller = require("../../controllers/globalExpense.controller");

module.exports = (router) => {
  router.route("/expense").post(controller.create);

  router.route("/expense").get(controller.findAll);
};
