var express = require("express");
var router = express.Router();
const utility = require("./utility");
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");

/* Student Related Routes */
router.get("/fetchStudent/:studentId", auth.loginAuth, utility.students.fetchStudent); // Api to fetch single student.
router.get("/fetchAllStudents", auth.loginAuth, utility.students.fetchAllStudents); // Api to fetch all student.
router.get("/removeStudent/:studentId", auth.loginAuth, utility.students.removeStudent); // Api to remove student.
router.post("/updateProfile", validator.updateStudentProfileValidator, auth.loginAuth, utility.students.updateProfile); // Api to update student's profile

module.exports = router;