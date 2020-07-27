var express = require("express");
var router = express.Router();
const utility = require("./utility");
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");

/* Course Ratings Related Routes */
router.get("/fetchCourseRating/:ratingId", validator.ratingIdValidator, auth.loginAuth, utility.courseRatings.fetchCourseRating); // Api fetch one rating.
router.get("/fetchCourseRatings/:courseId", validator.courseIdValidator, auth.loginAuth, utility.courseRatings.fetchCourseRatings); // Api fetch all ratings of one course.
router.get("/fetchAllCourseRatings", auth.loginAuth, utility.courseRatings.fetchAllCourseRatings); // Api fetch all ratings.


module.exports = router;