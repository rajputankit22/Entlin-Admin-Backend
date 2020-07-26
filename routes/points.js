var express = require("express");
var router = express.Router();
const utility = require("./utility");
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");

/* Points Related Routes */
// router.get("/increasePoints/:reason", validator.reasonValidator, auth.loginAuth, utility.points.increasePoints); // Api to increase points.


module.exports = router;