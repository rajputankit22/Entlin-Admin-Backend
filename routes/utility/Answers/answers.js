const moment = require("moment");
const Answers = require("../../../models/answers");
const {
  check,
  validationResult
} = require("express-validator");

/* Post new answer */
module.exports.postAnswer = async (req, res, next) => {
  try {
    const answer = new Answers({
      questionId: req.body.questionId,
      studentId: req.student._id,
      answer: req.body.answer,
    })
    const savedAnswer = await answer.save()
    res.status(200).json({
      success: true,
      answer: savedAnswer
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Post new answer by mentor */
module.exports.postMentorAnswer = async (req, res, next) => {
  try {
    const answer = new Answers({
      questionId: req.body.questionId,
      mentorId: req.mentor._id,
      answer: req.body.answer,
    })
    const savedAnswer = await answer.save()
    res.status(200).json({
      success: true,
      answer: savedAnswer
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Modifyanswer */
module.exports.modifyAnswer = async (req, res, next) => {
  try {
    let findAnswer = await Answers.findById(req.body.answerId)
    console.log(req.params.answerId)
    console.log(req.student._id)
    console.log(findAnswer)
    if (findAnswer && (findAnswer.studentId.toString() == req.student._id.toString())) {
      findAnswer.answer = req.body.answer
      const updatedAnswer = await findAnswer.save()
      res.status(200).json({
        success: true,
        answer: updatedAnswer
      });
    } else {
      res.status(400).send({
        success: false,
        error: "You can modify only which are gived by you!"
      });
    }
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Modify answer by mentor */
module.exports.modifyMentorAnswer = async (req, res, next) => {
  try {
    let findAnswer = await Answers.findById(req.body.answerId)
    if (findAnswer && (findAnswer.mentorId.toString() == req.mentor._id.toString())) {
      findAnswer.answer = req.body.answer
      const updatedAnswer = await findAnswer.save()
      res.status(200).json({
        success: true,
        answer: updatedAnswer
      });
    } else {
      res.status(400).send({
        success: false,
        error: "You can modify only which are gived by you!"
      });
    }
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* UpVote answer */
module.exports.upVoteAnswer = async (req, res, next) => {
  try {
    let updatedAnswer = await Answers.update({ _id: req.params.answerId }, { $inc: { votes: 1 } });
    res.status(200).json({
      success: true,
      answer: updatedAnswer
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* DownVote answer */
module.exports.downVoteAnswer = async (req, res, next) => {
  try {
    let updatedAnswer = await Answers.update({ _id: req.params.answerId }, { $inc: { votes: -1 } });
    res.status(200).json({
      success: true,
      answer: updatedAnswer
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Delete answer */
module.exports.deleteAnswer = async (req, res, next) => {
  try {
    const findAnswer = await Answers.findOne({ _id: req.params.answerId })
    if (findAnswer && (req.student._id.toString() == findAnswer.studentId.toString())) {
      const removedAnswer = await Answers.deleteOne({ _id: req.params.answerId, studentId: req.student._id })
      console.log(removedAnswer)
      res.status(200).send({
        success: true,
        message: "Answer has been successfully deleted!"
      });
    } else {
      res.status(400).send({
        success: false,
        error: "You can delete only which are created by you!"
      });
    }
  } catch (error) {
    console.log(error);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
}

/* Delete answer by mentor */
module.exports.deleteMentorAnswer = async (req, res, next) => {
  try {
    const findAnswer = await Answers.findOne({ _id: req.params.answerId })
    if (findAnswer && (req.mentor._id.toString() == findAnswer.mentorId.toString())) {
      const removedAnswer = await Answers.deleteOne({ _id: req.params.answerId, mentorId: req.mentor._id })
      res.status(200).send({
        success: true,
        message: "Answer has been successfully deleted!"
      });
    } else {
      res.status(400).send({
        success: false,
        error: "You can delete only which are created by you!"
      });
    }
  } catch (error) {
    console.log(error);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
}

/* Fetch single Answer */
module.exports.fetchAnswer = async (req, res, next) => {
  try {
    const answer = await Answers.findById(req.params.answerId, { createdAt: 0, updatedAt: 0 });
    res.status(200).json({
      success: true,
      answer: answer
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Fetch All Answers */
module.exports.fetchOwnAnswers = async (req, res, next) => {
  try {
    const answers = await Answers.find({ studentId: req.student._id }, { createdAt: 0, updatedAt: 0 });
    res.status(200).json({
      success: true,
      answers: answers
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Fetch All mentor's Answers */
module.exports.fetchMentorOwnAnswers = async (req, res, next) => {
  try {
    const answers = await Answers.find({ mentorId: req.mentor._id }, { createdAt: 0, updatedAt: 0 });
    res.status(200).json({
      success: true,
      answers: answers
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};


