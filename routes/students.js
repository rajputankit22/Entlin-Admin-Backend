var express = require("express");
var router = express.Router();
const utility = require("./utility");
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");

/* Student Related Routes */
router.get("/fetchStudent/:studentId", validator.studentIdValidator, auth.loginAuth, utility.students.fetchStudent); // Api to fetch single student.
router.get("/fetchAllStudents", auth.loginAuth, utility.students.fetchAllStudents); // Api to fetch all student.
router.get("/removeStudent/:studentId", validator.studentIdValidator, auth.loginAuth, utility.students.removeStudent); // Api to remove student.
router.post("/updateProfile/:studentId", validator.studentIdValidator, validator.updateStudentProfileValidator, auth.loginAuth, utility.students.updateProfile); // Api to update student's profile

/* Incubation Related Routes */
router.get("/fetchIncubation/:incubationId", validator.incubationIdValidator, auth.loginAuth, utility.students.fetchIncubation); // Api to fetch single Incubation.
router.get("/fetchAllIncubations", auth.loginAuth, utility.students.fetchAllIncubations); // Api to fetch all Incubations.
router.get("/deleteIncubation/:incubationId", validator.incubationIdValidator, auth.loginAuth, utility.students.deleteIncubation); // Api to delete incubation.
router.post("/updateIncubation/:incubationId", validator.incubationUpdateValidator, auth.loginAuth, utility.students.updateIncubation); // Api to update incubation.
router.get("/getPreSignedUrl/:fileName", validator.fileNameValidator, auth.loginAuth, utility.students.getPreSignedUrl); //Api to generate pre singed url for file.

module.exports = router;