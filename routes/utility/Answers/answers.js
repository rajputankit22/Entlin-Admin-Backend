const moment = require("moment");
const Answers = require("../../../models/answers");
const {
  check,
  validationResult
} = require("express-validator");


// /* Modifyanswer */
// module.exports.modifyAnswer = async (req, res, next) => {
//   try {
//     let findAnswer = await Answers.findById(req.body.answerId)
//     console.log(req.params.answerId)
//     console.log(req.student._id)
//     console.log(findAnswer)
//     if (findAnswer && (findAnswer.studentId.toString() == req.student._id.toString())) {
//       findAnswer.answer = req.body.answer
//       const updatedAnswer = await findAnswer.save()
//       res.status(200).json({
//         success: true,
//         answer: updatedAnswer
//       });
//     } else {
//       res.status(400).send({
//         success: false,
//         error: "You can modify only which are gived by you!"
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(501).send({
//       success: false,
//       error: "Internal Server Error!"
//     });
//   }
// };

// /* Modify answer by mentor */
// module.exports.modifyMentorAnswer = async (req, res, next) => {
//   try {
//     let findAnswer = await Answers.findById(req.body.answerId)
//     if (findAnswer && (findAnswer.mentorId.toString() == req.mentor._id.toString())) {
//       findAnswer.answer = req.body.answer
//       const updatedAnswer = await findAnswer.save()
//       res.status(200).json({
//         success: true,
//         answer: updatedAnswer
//       });
//     } else {
//       res.status(400).send({
//         success: false,
//         error: "You can modify only which are gived by you!"
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(501).send({
//       success: false,
//       error: "Internal Server Error!"
//     });
//   }
// };


/* Delete answer through answerId */
module.exports.deleteAnswer = async (req, res, next) => {
  try {
    const removedAnswer = await Answers.deleteOne({ _id: req.params.answerId })
    console.log(removedAnswer)
    res.status(200).send({
      success: true,
      message: "Answer has been successfully deleted!"
    });
  } catch (error) {
    console.log(error);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
}

// /* Delete answer by mentor */
// module.exports.deleteMentorAnswer = async (req, res, next) => {
//   try {
//     const findAnswer = await Answers.findOne({ _id: req.params.answerId })
//     if (findAnswer && (req.mentor._id.toString() == findAnswer.mentorId.toString())) {
//       const removedAnswer = await Answers.deleteOne({ _id: req.params.answerId, mentorId: req.mentor._id })
//       res.status(200).send({
//         success: true,
//         message: "Answer has been successfully deleted!"
//       });
//     } else {
//       res.status(400).send({
//         success: false,
//         error: "You can delete only which are created by you!"
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(501).send({
//       success: false,
//       error: "Internal Server Error!"
//     });
//   }
// }

/* Fetch single Answer through answerId */
module.exports.fetchAnswer = async (req, res, next) => {
  try {
    const answer = await Answers.findById(req.params.answerId).populate({ path: 'studentId', select: 'studentName' }).populate({ path: 'mentorId', select: 'mentorName' });
    const answers = await Answers.find({ questionId: answer.questionId }, { createdAt: 0, updatedAt: 0 }).populate({ path: 'studentId', select: 'studentName' }).populate({ path: 'mentorId', select: 'mentorName' });
    res.status(200).json({
      success: true,
      answer: answer,
      answers: answers,
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Fetch all Answers */
module.exports.fetchAllAnswers = async (req, res, next) => {
  try {
    const answers = await Answers.find({}, { createdAt: 0, updatedAt: 0 });
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

/* Fetch Single student's Answers */
module.exports.fetchSingleStudentAnswers = async (req, res, next) => {
  try {
    const answers = await Answers.find({ studentId: req.params.studentId }, { createdAt: 0, updatedAt: 0 });
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

/* Fetch Single mentor's Answers */
module.exports.fetchSingleMentorAnswers = async (req, res, next) => {
  try {
    const answers = await Answers.find({ mentorId: req.params.mentorId }, { createdAt: 0, updatedAt: 0 });
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


