const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseRatingSchema = new Schema({
  courseId: {
    trim: true,
    type: Schema.Types.ObjectId,
    ref: "Courses",
    required: [true, "Course ID is required"]
  },
  studentId: {
    trim: true,
    type: Schema.Types.ObjectId,
    ref: "Students",
    required: [true, "Student ID is required"]
  },
  courseRating: {
    trim: true,
    type: String,
    required: [true, "courseRating is required"],
    validate(value) {
      if (value.length < 1 || value.length > 1000) {
        throw new Error("Rating at most 5000 characters!");
      }
    }
  }
},
  {
    timestamps: true
  }
);

const CourseRatings = mongoose.model("CourseRatings", courseRatingSchema);

module.exports = CourseRatings;