var express = require("express");
var router = express.Router();
const utility = require("./utility");
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");

/* Registration Related Routes */
router.get("/fetchAllRegistrations", auth.loginAuth, utility.registrations.fetchAllRegistrations); // Api to fetch All registrations.
router.get("/fetchSingleEventRegistrations/:eventId", validator.eventIdValidator, auth.loginAuth, utility.registrations.fetchSingleEventRegistrations); // Api to register for event.


module.exports = router;