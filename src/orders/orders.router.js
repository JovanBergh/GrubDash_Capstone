const router = require("express").Router();
const controller = require("./orders.controller");
const methodNotAllowed = require("../errors/methodNotAllowed")

//Route: Main
router.route("/").get(controller.list).post(controller.create).all(methodNotAllowed);

//router.route("/:orderId").all(methodNotAllowed);

module.exports = router;
