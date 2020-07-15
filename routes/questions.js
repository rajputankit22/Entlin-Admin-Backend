var express = require("express");
var router = express.Router();
const utility = require("./utility");
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");

/* Questions Related Routes */
// router.get("/fetchQuestion/:questionId", auth.loginAuth, utility.questions.fetchQuestion); // Api fetch one question.
// router.get("/fetchOwnQuestions", auth.loginAuth, utility.questions.fetchOwnQuestions); // Api fetch all own questions.
// router.get("/fetchAllQuestions", auth.loginAuth, utility.questions.fetchAllQuestions); // Api fetch all questions.
// router.post("/postQuestion", validator.postQuestionValidator, auth.loginAuth, utility.questions.postQuestion); // Api to post new question.
// router.post("/modifyQuestion", validator.modifyQuestionValidator, auth.loginAuth, utility.questions.modifyQuestion); // Api to update own question.
// router.get("/deleteQuestion/:questionId", auth.loginAuth, utility.questions.deleteQuestion); // Api to delete own question.
// router.get("/closeQuestion/:questionId", auth.loginAuth, utility.questions.closeQuestion); // Api to close own question.
// router.get("/upVoteQuestion/:questionId", auth.loginAuth, utility.questions.upVoteQuestion); // Api to upVote question.
// router.get("/downVoteQuestion/:questionId", auth.loginAuth, utility.questions.downVoteQuestion); // Api to downVote question.


module.exports = router;