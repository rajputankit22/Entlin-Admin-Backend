var express = require("express");
var router = express.Router();
const utility = require("./utility");
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");

/* Employee Related Routes */
router.post("/signIn", validator.signInValidator, utility.employees.signIn); // Api to signIn
router.get("/loadEmployee", auth.loginAuth, utility.employees.loadEmployee); // Api to load employee
router.get("/signOut", auth.loginAuth, utility.employees.signOut); // Api to signOut
router.post("/updatePassword", validator.updatePasswordValidator, auth.loginAuth, utility.employees.updatePassword); // Api to update own's password
router.post("/updateProfile", validator.updateOwnProfileValidator, auth.loginAuth, utility.employees.updateProfile); // Api to update own's profile
router.get("/refreshToken", validator.jwtTokenValidator, utility.employees.refreshToken); // Api to update own's profile

module.exports = router;