var express = require("express");
var router = express.Router();
const utility = require("./utility");
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");

/* Home page Related Routes */
router.get("/fetchHomeDetails", auth.loginAuth, utility.homes.fetchHomeDetails); //Api to fetch home page's details 

module.exports = router;