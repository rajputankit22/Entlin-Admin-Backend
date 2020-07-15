const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  studentId: {
    trim: true,
    type: Schema.Types.ObjectId,
    ref: "Students",
    required: [true, "Student ID is required"]
  },
  votes: {
    trim: true,
    type: Number,
    default: 0,
    required: [true, "Vote is required"]
  },
  status: {
    trim: true,
    type: String,
    default: 'open',
    enum: ['open', 'close'],
    required: [true, "Status is required"]
  },
  tags: [
    {
      trim: true,
      type: String
    }
  ],
  title: {
    trim: true,
    type: String,
    required: [true, "Title is required"],
    validate(value) {
      if (value.length < 10 || value.length > 100) {
        throw new Error("Title at least 10 and at most 100 characters!");
      }
    }
  },
  detail: {
    trim: true,
    type: String,
    required: [true, "Question detail is required"],
    validate(value) {
      if (value.length < 10 || value.length > 500) {
        throw new Error("Question details at least 10 and at most 500 characters!");
      }
    }
  }
},
  {
    timestamps: true
  }
);

// Validation for tags size
questionSchema.path('tags').validate(function (value) {
  if (value.length < 1 && value.length > 6) {
    throw new Error("Number of tags should be less than or equal to 5!");
  }
});

const Questions = mongoose.model("Questions", questionSchema);

module.exports = Questions;