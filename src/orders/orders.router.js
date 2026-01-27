const router = require("express").Router();
const controller = require("./orders.controller");

//Route: Main
router.route("/").get(controller.list);

module.exports = router;
