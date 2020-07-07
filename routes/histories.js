var express = require("express");
var router = express.Router();
const utility = require("./utility");
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");

/* History Related Routes */
router.get("/fetchBorrowerHistories/:borrowerId", auth.loginAuth, utility.histories.fetchBorrowerHistories); //Api to fetch all task's Histories 

module.exports = router;