var express = require("express");
var router = express.Router();
const utility = require("./utility");
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");

/* Questions Related Routes */
router.get("/fetchQuestion/:questionId", auth.loginAuth, utility.questions.fetchQuestion); // Api fetch one question.
router.get("/fetchSingleStudentQuestions/:studentId", auth.loginAuth, utility.questions.fetchSingleStudentQuestions); // Api fetch all own questions.
router.get("/fetchAllQuestions", auth.loginAuth, utility.questions.fetchAllQuestions); // Api fetch all questions.
router.get("/deleteQuestion/:questionId", auth.loginAuth, utility.questions.deleteQuestion); // Api to delete own question.
router.get("/closeQuestion/:questionId", auth.loginAuth, utility.questions.closeQuestion); // Api to close own question.


module.exports = router;