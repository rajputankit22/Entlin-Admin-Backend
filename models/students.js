const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config")
const cryptoRandomString = require("crypto-random-string");

/* Student's Address */
const ADDRESS = {
  address: {
    trim: true,
    type: String,
    required: [true, "Students's address is required!"],
    validate(value) {
      if (value.length < 2 || value.length > 50) {
        throw new Error("Registered Address should be atleast 5 and at most 200 characters!");
      }
    }
  },
  city: {
    trim: true,
    type: String,
    required: [true, "Students's city is required!"],
    validate(value) {
      if (value.length < 2 || value.length > 50) {
        throw new Error("Registered Address City should be atleast 2 and at most 50 characters!");
      }
    }
  },
  state: {
    trim: true,
    uppercase: true,
    type: String,
    required: [true, "Students's state is required!"],
    validate(value) {
      if (value.length < 2 || value.length > 50) {
        throw new Error("Registered Address State should be atleast 2 and at most 50 characters!");
      }
    }
  },
  pin: {
    trim: true,
    uppercase: true,
    type: Number,
    required: [true, "Students's pin code is required!"],
    require: [true, "Registered Address Pin is required"],
    validate(value) {
      if (!(value >= 100000 && value <= 999999)) {
        throw new Error("Registered Address Pin is invalid!");
      }
    }
  }
}

const studentSchema = new Schema(
  {
    studentName: {
      trim: true,
      type: String,
      required: [true, "Applicant First Name is required!"],
      validate(value) {
        if (value.length < 2 || value.length > 100) {
          throw new Error("Applicant First Name is invalid!");
        }
      }
    },
    email: {
      trim: true,
      type: String,
      unique: [true, "Email already registered"],
      required: [true, "Email is required"],
      validate(value) {
        if (value.length < 5 || value.length > 100) {
          throw new Error("Email is invalid!");
        }
      }
    },
    mobile: {
      trim: true,
      type: String,
      unique: [true, "Mobile Number already available"],
      required: [true, "Mobile Number is required"],
      validate(value) {
        if (value.length !== 10) {
          throw new Error("Mobile Number is invalid!");
        }
      }
    },
    rollNumber: {
      trim: true,
      type: String,
      unique: [true, "Roll Number already available"],
      required: [true, "Roll Number is required"],
      validate(value) {
        if (value.length !== 6) {
          throw new Error("Roll Number is invalid!");
        }
      }
    },
    mentorId: {
      trim: true,
      type: Schema.Types.ObjectId,
      ref: "Mentors",
      // required: [true, "MentorId ID is required"]
    },
    profilePicName: {
      trim: true,
      type: String,
      unique: [true, "Profile pic name already taken"],
    },
    lastLogin: {
      trim: true,
      type: Date,
      default: Date.now,
      required: [true, "Login Timestamp is required"]
    },
    dob: {
      trim: true,
      type: Date,
      // required: [true, "Date of Birth is required"]
    },
    socialMediaLinkes: {
      facebook: {
        trim: true,
        type: String
      },
      linkedIn: {
        trim: true,
        type: String
      },
      GitHub: {
        trim: true,
        type: String
      },
      SkypeId: {
        trim: true,
        type: String
      }
    },
    higerEducation: {
      trim: true,
      type: String,
      enum: ["MCA", "MSC", "BSC"]    // Degree Name
    },
    skills: [
      {
        trim: true,
        type: String
      }
    ],
    password: {
      trim: true,
      type: String,
      require: [true, "Password is required"],
      validate(value) {
        if (value.length < 6 || value.length > 200) {
          throw new Error("Password should be atleast 6 characters!");
        }
      }
    },
    refreshToken: {
      trim: true,
      type: String,
    },
    address: ADDRESS,
    aboutMe: {
      trim: true,
      type: String,
      validate(value) {
        if (value.length < 50 || value.length > 500) {
          throw new Error("AboutMe should be atleast 50 and at most 500 characters!");
        }
      }
    },
  },
  {
    timestamps: true
  }
);

// Profile without password
studentSchema.methods.getPublicProfile = function () {
  const student = this;
  const studentObject = student.toObject();
  delete studentObject.password;
  delete studentObject.token;
  delete studentObject.createdAt;
  delete studentObject.updatedAt;
  return studentObject;
};

// Profile without password & refresh token
studentSchema.methods.getPublicProfileStudent = function () {
  const student = this;
  const studentObject = student.toObject();
  delete studentObject.password;
  delete studentObject.token;
  delete studentObject.createdAt;
  delete studentObject.updatedAt;
  delete studentObject.refreshToken;
  return studentObject;
};

// Generate jwt token
studentSchema.methods.generateAuthToken = async function () {
  const student = this;
  const randomNumber = Math.floor(Math.random() * 150 + 100);
  const randomString = cryptoRandomString({
    length: randomNumber,
    type: "base64"
  });
  const token = jwt.sign(
    {
      _id: student._id.toString(),
      randomString
    },
    config.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "6h"
    }
  );
  return token;
};

// Generate Refreshjwt token
studentSchema.methods.generateRefreshToken = async function () {
  const student = this;
  const randomNumber = Math.floor(Math.random() * 150 + 100);
  const randomString = cryptoRandomString({
    length: randomNumber,
    type: "base64"
  });
  const token = jwt.sign(
    {
      _id: student._id.toString(),
      randomString
    },
    config.REFRESH_TOKEN_SECRET,
  );
  return token;
};

studentSchema.methods.comparePassword = async function (password) {
  const student = this;
  const isMatch = await bcrypt.compare(password, student.password);
  if (!isMatch) {
    return false;
  } else {
    return true;
  }
};

// Check password match
studentSchema.statics.findByCredentials = async (email, password) => {
  const student = await Students.findOne({
    email: email
  });
  if (!student) {
    throw new Error("Email is not registered!");
  }
  const isMatch = await bcrypt.compare(password, student.password);
  if (!isMatch) {
    throw new Error("Invalid password!");
  }
  return student;
};

// Find Student by _id
studentSchema.statics.findStudentById = async _id => {
  const student = await Students.findById({
    _id: _id
  });
  if (!student) {
    throw new Error("Student not found");
  }
  return student;
};

// Hash the plain text password before saving
studentSchema.pre("save", async function (next) {
  const student = this;
  try {
    if (student.isModified("password")) {
      student.password = await bcrypt.hash(student.password, 8);
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Students = mongoose.model("Students", studentSchema);

module.exports = Students;
