var express = require("express");
var router = express.Router();
const utility = require("./utility");
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");

/* Subscription Related Routes */
router.get("/fetchAllSubscriptions", auth.loginAuth, utility.subscriptions.fetchAllSubscriptions); // Api to fetch all subscriptions.
router.get("/fetchStudentSubscriptions/:studentId", validator.studentIdValidator, auth.loginAuth, utility.subscriptions.fetchStudentSubscriptions); // Api to fetch student all subscriptions.
router.post("/createSubscription", validator.createSubscriptionValidator, auth.loginAuth, utility.subscriptions.createSubscription); // Api to create a subscription.
router.get("/subscriptionPayment/:subscriptionId", validator.subscriptionIdValidator, auth.loginAuth, utility.subscriptions.subscriptionPayment); // Api to create a subscription.
router.get("/deleteSubscription/:subscriptionId", validator.subscriptionIdValidator, auth.loginAuth, utility.subscriptions.deleteSubscription); // Api to delete a subscription.

module.exports = router;