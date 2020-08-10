var express = require("express");
var router = express.Router();
const utility = require("./utility");
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");

/* Answer Related Routes */
router.get("/deleteAnswer/:answerId", validator.answerIdValidator, auth.loginAuth, utility.answers.deleteAnswer); // Api to delete one answer.
router.get("/fetchAnswer/:answerId", validator.answerIdValidator, auth.loginAuth, utility.answers.fetchAnswer); // Api to fetch a answer.
router.get("/fetchSingleStudentAnswers/:studentId", validator.studentIdValidator, auth.loginAuth, utility.answers.fetchSingleStudentAnswers); // Api to fetch single student answers.
router.get("/fetchAllAnswers", auth.loginAuth, utility.answers.fetchAllAnswers); // Api to fetch all answers.


// /* Mentor's Answer Related Routes */
// router.post("/postMentorAnswer", validator.postAnswerValidator, auth.loginMentorAuth, utility.answers.postMentorAnswer); // Api to post new answer.
// router.post("/modifyMentorAnswer", validator.modifyAnswerValidator, auth.loginMentorAuth, utility.answers.modifyMentorAnswer); // Api to update own answer.
// router.get("/deleteMentorAnswer/:answerId", auth.loginMentorAuth, utility.answers.deleteMentorAnswer); // Api to delete own question.
// router.get("/fetchMentorOwnAnswers", auth.loginMentorAuth, utility.answers.fetchMentorOwnAnswers); // Api to downVote a answer.



module.exports = router;