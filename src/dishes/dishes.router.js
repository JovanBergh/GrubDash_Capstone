const router = require("express").Router();
const controller = require("./dishes.controller");

//Route: Main
router.route("/").get(controller.list).post(controller.create);

module.exports = router;
