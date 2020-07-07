var express = require("express");
var router = express.Router();
const utility = require("./utility");
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");

/* Lender Related Routes */
router.get("/fetchLender/:id", auth.loginAuth, auth.adminAccessAuth, utility.lenders.fetchLender); // Api fetch one Lender.
router.post("/updateProfile", validator.updateLenderProfileValidator, auth.loginAuth, auth.adminAccessAuth, utility.lenders.updateProfile); // Api to update employee profile.
router.get("/fetchAllLenders", auth.loginAuth, auth.adminAccessAuth, utility.lenders.fetchAllLenders); // Api to fetch all Lenders.

module.exports = router;