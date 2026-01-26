const router = require("express").Router();
const controller = require("./dishes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

//Route: Main
router.route("/").get(controller.list).post(controller.create);

//Route: /:dishId
router.route("/:dishId").get(controller.read).all(methodNotAllowed);

module.exports = router;
