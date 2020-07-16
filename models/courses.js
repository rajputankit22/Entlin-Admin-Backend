const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/* Videos Details */
const videoSchema = new Schema({
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
  description: {
    trim: true,
    type: String,
    required: [true, "Description is required"],
    validate(value) {
      if (value.length < 10 || value.length > 100) {
        throw new Error("Description at least 10 and at most 100 characters!");
      }
    }
  },
  uploaded: {
    trim: true,
    type: Boolean,
    default: false,
    required: [true, 'Uploaded is required!']
  },
  fileName: {
    trim: true,
    type: String,
    required: [true, "File Name is required"],
    validate(value) {
      if (value.length < 10 || value.length > 5000) {
        throw new Error("Video details at least 10 and at most 5000 characters!");
      }
    }
  }
})

const courseSchema = new Schema({
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
  description: {
    trim: true,
    type: String,
    required: [true, "Description is required"],
    validate(value) {
      if (value.length < 10 || value.length > 100) {
        throw new Error("Description at least 10 and at most 100 characters!");
      }
    }
  },
  createdBy: {
    trim: true,
    type: String,
    required: [true, "Creator Name is required"],
    validate(value) {
      if (value.length < 2 || value.length > 100) {
        throw new Error("Creator Name at least 2 and at most 100 characters!");
      }
    }
  },
  createrDetails: {
    trim: true,
    type: String,
    required: [true, "Creator detailsis required"],
    validate(value) {
      if (value.length < 2 || value.length > 100) {
        throw new Error("Creator Name at least 2 and at most 100 characters!");
      }
    }
  },
  uploaded: {
    trim: true,
    type: Boolean,
    default: false,
    required: [true, 'Uploaded is required!']
  },
  publish: {
    trim: true,
    type: Boolean,
    default: false,
    required: [true, 'Public is required!']
  },
  numberOfVideos: {
    trim: true,
    type: Number,
    required: [true, 'Number of Videes is required!']
  },
  videosList: [videoSchema]
},
  {
    timestamps: true
  }
);

// Validation for tags size
courseSchema.path('videosList').validate(function (value1) {
  courseSchema.path('numberOfVideos').validate(function (value2) {
    console.log(value1.length)
    console.log(value2)
    if (value1.length !== value2) {
      throw new Error("Number of videos should be less than or equal to 5!");
    }
  })
});

const Courses = mongoose.model("Courses", courseSchema);

module.exports = Courses;