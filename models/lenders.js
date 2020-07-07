const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config")
const cryptoRandomString = require("crypto-random-string");
const { roundOf } = require("../routes/utility/Commons/functions");

const lenderSchema = new Schema(
  {
    applicantFirstName: {
      trim: true,
      type: String,
      required: [true, "Applicant First Name is required!"],
      validate(value) {
        if (value.length < 2 || value.length > 100) {
          throw new Error("Applicant First Name is invalid!");
        }
      }
    },
    applicantLastName: {
      trim: true,
      type: String,
      required: [true, "Applicant Last Name is required!"],
      validate(value) {
        if (value.length < 2 || value.length > 100) {
          throw new Error("Applicant Last Name is invalid!");
        }
      }
    },
    businessName: {
      trim: true,
      type: String,
      required: [true, "Business Name is required!"],
      validate(value) {
        if (value.length < 2 || value.length > 100) {
          throw new Error("Business Name is invalid!");
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
    applicantDesignation: {
      trim: true,
      type: String,
      required: [true, "Applicant Designation is required!"],
      validate(value) {
        if (value.length < 2 || value.length > 100) {
          throw new Error("Applicant Designation is invalid!");
        }
      }
    },
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
    lenderInterestRate: {
      trim: true,
      type: Number,
      default: roundOf(config.LENDER_INTEREST),
      required: [true, "Lender Interest is required"]
    },
  },
  {
    timestamps: true
  }
);

// Profile without password
lenderSchema.methods.getPublicProfile = function () {
  const lender = this;
  const userObject = lender.toObject();
  delete userObject.password;
  delete userObject.token;
  delete userObject.createdAt;
  delete userObject.updatedAt;
  return userObject;
};

// Profile without password & refresh token
lenderSchema.methods.getPublicProfileLender = function () {
  const lender = this;
  const userObject = lender.toObject();
  delete userObject.password;
  delete userObject.token;
  delete userObject.createdAt;
  delete userObject.updatedAt;
  delete userObject.refreshToken;
  return userObject;
};

// Generate jwt token
lenderSchema.methods.generateAuthToken = async function () {
  const lender = this;
  const randomNumber = Math.floor(Math.random() * 150 + 100);
  const randomString = cryptoRandomString({
    length: randomNumber,
    type: "base64"
  });
  const token = jwt.sign(
    {
      _id: lender._id.toString(),
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
lenderSchema.methods.generateRefreshToken = async function () {
  const lender = this;
  const randomNumber = Math.floor(Math.random() * 150 + 100);
  const randomString = cryptoRandomString({
    length: randomNumber,
    type: "base64"
  });
  const token = jwt.sign(
    {
      _id: lender._id.toString(),
      randomString
    },
    config.REFRESH_TOKEN_SECRET,
  );
  return token;
};

lenderSchema.methods.comparePassword = async function (password) {
  const lender = this;
  const isMatch = await bcrypt.compare(password, lender.password);
  if (!isMatch) {
    return false;
  } else {
    return true;
  }
};

// Check password match
lenderSchema.statics.findByCredentials = async (email, password) => {
  const lender = await Lenders.findOne({
    email: email
  });
  if (!lender) {
    throw new Error("Email is not registered!");
  }
  const isMatch = await bcrypt.compare(password, lender.password);
  if (!isMatch) {
    throw new Error("Invalid password!");
  }
  return lender;
};

// Find user by _id
lenderSchema.statics.findLenderById = async _id => {
  const lender = await Lenders.findById({
    _id: _id
  });
  if (!lender) {
    throw new Error("User not found");
  }
  return lender;
};

// Hash the plain text password before saving
lenderSchema.pre("save", async function (next) {
  const lender = this;
  try {
    if (lender.isModified("password")) {
      lender.password = await bcrypt.hash(lender.password, 8);
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Lenders = mongoose.model("Lenders", lenderSchema);

module.exports = Lenders;
