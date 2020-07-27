var express = require("express");
var router = express.Router();
const utility = require("./utility");
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");

/* Courses Related Routes */
router.post("/postCourse", validator.postCourseValidator, auth.loginAuth, utility.courses.postCourse); // Api post one course.
router.get("/uploadCourse/:courseId", validator.courseIdValidator, auth.loginAuth, utility.courses.uploadCourse); // Api upload course.
router.get("/unUploadCourse/:courseId", validator.courseIdValidator, auth.loginAuth, utility.courses.unUploadCourse); // Api unUpload video.
router.get("/publishCourse/:courseId", validator.courseIdValidator, auth.loginAuth, utility.courses.publishCourse); // Api publish course.
router.get("/unPublishCourse/:courseId", validator.courseIdValidator, auth.loginAuth, utility.courses.unPublishCourse); // Api fetch unPublish video.
router.get("/fetchCourse/:courseId", validator.courseIdValidator, auth.loginAuth, utility.courses.fetchCourse); // Api fetch one course.
router.get("/fetchAllCourses", auth.loginAuth, utility.courses.fetchAllCourses); // Api fetch all courses.
router.get("/deleteCourse/:courseId", validator.courseIdValidator, auth.loginAuth, utility.courses.deleteCourse); // Api to delete courses.


module.exports = router;