const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const answerSchema = new Schema({
  questionId: {
    trim: true,
    type: Schema.Types.ObjectId,
    ref: "Questions",
    required: [true, "Question ID is required"]
  },
  studentId: {
    trim: true,
    type: Schema.Types.ObjectId,
    ref: "Students",
  },
  mentorId: {
    trim: true,
    type: Schema.Types.ObjectId,
    ref: "Mentors",
  },
  votes: {
    trim: true,
    type: Number,
    default: 0,
    required: [true, "Vote is required"]
  },
  answer: {
    trim: true,
    type: String,
    required: [true, "Answer is required"],
    validate(value) {
      if (value.length < 10 || value.length > 5000) {
        throw new Error("Answer details at least 10 and at most 5000 characters!");
      }
    }
  }
},
  {
    timestamps: true
  }
);

const Answers = mongoose.model("Answers", answerSchema);

module.exports = Answers;