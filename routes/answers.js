var express = require("express");
var router = express.Router();
const utility = require("./utility");
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");

/* Answer Related Routes */
// router.post("/postAnswer", validator.postAnswerValidator, auth.loginAuth, utility.answers.postAnswer); // Api to post new answer.
// router.post("/modifyAnswer", validator.modifyAnswerValidator, auth.loginAuth, utility.answers.modifyAnswer); // Api to update own answer.
// router.get("/deleteAnswer/:answerId", auth.loginAuth, utility.answers.deleteAnswer); // Api to delete own question.
// router.get("/upVoteAnswer/:answerId", auth.loginAuth, utility.answers.upVoteAnswer); // Api to upVote a answer.
// router.get("/downVoteAnswer/:answerId", auth.loginAuth, utility.answers.downVoteAnswer); // Api to downVote a answer.
// router.get("/fetchAnswer/:answerId", auth.loginAuth, utility.answers.fetchAnswer); // Api to downVote a answer.
// router.get("/fetchOwnAnswers", auth.loginAuth, utility.answers.fetchOwnAnswers); // Api to downVote a answer.


// /* Mentor's Answer Related Routes */
// router.post("/postMentorAnswer", validator.postAnswerValidator, auth.loginMentorAuth, utility.answers.postMentorAnswer); // Api to post new answer.
// router.post("/modifyMentorAnswer", validator.modifyAnswerValidator, auth.loginMentorAuth, utility.answers.modifyMentorAnswer); // Api to update own answer.
// router.get("/deleteMentorAnswer/:answerId", auth.loginMentorAuth, utility.answers.deleteMentorAnswer); // Api to delete own question.
// router.get("/fetchMentorOwnAnswers", auth.loginMentorAuth, utility.answers.fetchMentorOwnAnswers); // Api to downVote a answer.



module.exports = router;