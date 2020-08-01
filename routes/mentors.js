var express = require("express");
var router = express.Router();
const utility = require("./utility");
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");

/* Mentor Related Routes */
router.post("/addMentor", validator.addMentorValidator, auth.loginAuth, auth.adminAccessAuth, utility.mentors.addMentor); //  Api to add new mentor.
router.get("/fetchMentor/:mentorId", validator.mentorIdValidator, auth.loginAuth, auth.adminAccessAuth, utility.mentors.fetchMentor); // Api fetch one mentor.
router.get("/removeMentor/:mentorId", validator.mentorIdValidator, auth.loginAuth, auth.adminAccessAuth, utility.mentors.removeMentor); // Api to remove mentor.
router.post("/updateProfile/:mentorId", validator.mentorIdValidator, validator.updateMentorProfileValidator, auth.loginAuth, auth.adminAccessAuth, utility.mentors.updateProfile); // Api to update mentor profile.
router.get("/fetchAllMentors", auth.loginAuth, auth.adminAccessAuth, utility.mentors.fetchAllMentors); // Api to fetch all mentors.

module.exports = router;