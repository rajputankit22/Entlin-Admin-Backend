const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pointSchema = new Schema({
  studentId: {
    trim: true,
    type: Schema.Types.ObjectId,
    ref: "Students",
    required: [true, "Student ID is required"]
  },
  points: {
    trim: true,
    type: Number,
    default: 0,
    required: [true, "Poits is required"]
  },
  reason: {
    trim: true,
    type: String,
    enum: ['Video', 'AnswerUpvote', 'Project', 'QuestionUpVote', 'Event'],
    required: [true, "Reason is required"],
  }
},
  {
    timestamps: true
  }
);

const Points = mongoose.model("Points", pointSchema);

module.exports = Points;