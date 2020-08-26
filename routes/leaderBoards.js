var express = require("express");
var router = express.Router();
const utility = require("./utility");
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");

/* Points Related Routes */
router.get("/getTopStudents", auth.loginAuth, utility.leaderBoards.getTopStudents); // Api to get students.


module.exports = router;