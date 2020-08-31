const controller = require("../../controllers/usersMeta.controller");
//const validateToken = require("../../middleware/auth").validateToken;

module.exports = (router) => {
  router.route("/usersmeta").post(controller.add);
  //.get(validateToken, controller.getAll) // This route is now protected

  // router.route('/login')
  //     .post(controller.login)

  // router.route('/logout')
  //     .get(controller.logout)
};
