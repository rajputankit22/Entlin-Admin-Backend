const moment = require("moment");
const Questions = require("../../../models/questions");
const {
  check,
  validationResult
} = require("express-validator");
const config = require("../../../config")
const { saveLoanHistory, getDayViseInterestAmount, roundOf } = require("../Commons/functions")


/* Delete question */
module.exports.deleteQuestion = async (req, res, next) => {
  try {
    const removedQuestion = await Questions.deleteOne({ _id: req.params.questionId, studentId: req.student._id })
    res.status(200).send({
      success: true,
      message: "Question has been successfully deleted!"
    });
  } catch (error) {
    console.log(error);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
}

/* Fetch single Question */
module.exports.fetchQuestion = async (req, res, next) => {
  try {
    const question = await Questions.findById(req.params.questionId, { createdAt: 0, updatedAt: 0 });
    res.status(200).json({
      success: true,
      question: question
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Fetch All Questions */
module.exports.fetchAllQuestions = async (req, res, next) => {
  try {
    const questions = await Questions.find({}, { createdAt: 0, updatedAt: 0 });
    res.status(200).json({
      success: true,
      questions: questions
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Fetch Single Student All Questions */
module.exports.fetchSingleStudentQuestions = async (req, res, next) => {
  try {
    const questions = await Questions.find({ studentId: req.params.studentId }, { createdAt: 0, updatedAt: 0 });
    res.status(200).json({
      success: true,
      questions: questions
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Close question. */
module.exports.closeQuestion = async (req, res, next) => {
  try {
    const closedQuestion = await Questions.findOneAndUpdate({ _id: req.params.questionId }, { $set: { status: 'close' } }, { new: true, fields: { createdAt: 0, updatedAt: 0 } });
    res.status(200).json({
      success: true,
      question: closedQuestion
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};


