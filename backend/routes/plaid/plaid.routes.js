const controller = require("../../controllers/plaid.controller");

module.exports = (router) => {
  router.route("/create_link_token").get(controller.createplaidtoken);

  router.route("/get_access_token").get(controller.requestplaidtoken);

  router.route("/set_access_token").post(controller.setplaidtoken);

  router.route("/auth").get(controller.getplaiditems);

  router.route("/transactions").get(controller.setplaidtransactionsitems);

  router
    .route("/investment_transactions")
    .get(controller.getplaidinvestemnenttransactions);

  router.route("/identity").get(controller.retrieveidentity);

  router.route("/balance").get(controller.retrievebalances);

  router.route("/holdings").get(controller.retrieveholdings);

  router.route("/item").get(controller.retrieveitem);

  router.route("/accounts").get(controller.retrieveitemaccounts);

  router.route("/assets").get(controller.retrieveitemsasset);

  router.route("/transfer").get(controller.transfer);

  router.route("/payment").get(controller.payment);
};
