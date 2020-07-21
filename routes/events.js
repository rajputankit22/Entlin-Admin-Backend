var express = require("express");
var router = express.Router();
const utility = require("./utility");
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");

/* Events Related Routes */
router.post("/postEvent", validator.postEventValidator, auth.loginAuth, utility.events.postEvent); // Api to post new event.
router.post("/updateEvent/:eventId", validator.postEventValidator, auth.loginAuth, utility.events.updateEvent); // Api to post new event.
router.get("/fetchEvent/:eventId", auth.loginAuth, utility.events.fetchEvent); // Api fetch one event.
router.get("/fetchAllEvents", auth.loginAuth, utility.events.fetchAllEvents); // Api fetch all events.
router.get("/deleteEvent/:eventId", auth.loginAuth, utility.events.deleteEvent); // Api to delete event.


module.exports = router;