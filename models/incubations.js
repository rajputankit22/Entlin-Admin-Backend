
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cryptoRandomString = require("crypto-random-string");

/* Incubation's Address */
const ADDRESS = {
  address: {
    trim: true,
    type: String,
    required: [true, "Company address is required!"],
    validate(value) {
      if (value.length < 1 || value.length > 200) {
        throw new Error("Registered Address shouldn't greater than 200 characters!");
      }
    }
  },
  city: {
    trim: true,
    type: String,
    required: [true, "Company city is required!"],
    validate(value) {
      if (value.length < 2 || value.length > 50) {
        throw new Error("Registered Address City shouldn't greater than 50 characters!");
      }
    }
  },
  state: {
    trim: true,
    uppercase: true,
    type: String,
    required: [true, "Company state is required!"],
    validate(value) {
      if (value.length < 2 || value.length > 50) {
        throw new Error("Registered Address State shouldn't greater than 50 characters!");
      }
    }
  },
  pin: {
    trim: true,
    uppercase: true,
    type: Number,
    required: [true, "Company pin code is required!"],
    require: [true, "Registered Address Pin is required"],
    validate(value) {
      if (!(value >= 100000 && value <= 999999)) {
        throw new Error("Registered Address Pin is invalid!");
      }
    }
  }
}

/* Founder's Details */
const FOUNDERDETAILS = {
  founderName: {
    trim: true,
    type: String,
    required: [true, "Founder Name is required!"],
    validate(value) {
      if (value.length < 1 || value.length > 50) {
        throw new Error("Founder Name should be atleast 1 and at most 50 characters!");
      }
    }
  },
  founderRole: {
    trim: true,
    type: String,
    required: [true, "Founder Role is required!"],
    validate(value) {
      if (value.length < 1 || value.length > 50) {
        throw new Error("Founder Role should be atleast 1 and at most 50 characters!");
      }
    }
  },
  founderSkills: {
    trim: true,
    type: String,
    required: [true, "Founder Skills is required!"],
    validate(value) {
      if (value.length < 1 || value.length > 50) {
        throw new Error("Founder Skills should be atleast 1 and at most 50 characters!");
      }
    }
  },
  founderCurrentlyIn: {
    trim: true,
    type: String,
    required: [true, "Founder Currently In is required"],
    enum: ['In School', 'In College', 'Working in a job', 'Not working']
  },
}

const incubationsSchema = new Schema(
  {
    studentId: {
      trim: true,
      type: Schema.Types.ObjectId,
      ref: "Students",
      required: [true, "Student ID is required"]
    },
    startupName: {
      trim: true,
      type: String,
      required: [true, "Startup Name is required!"],
      validate(value) {
        if (value.length < 1 || value.length > 100) {
          throw new Error("Startup Name is invalid!");
        }
      }
    },
    registered: {
      trim: true,
      type: Boolean,
      default: false,
      required: [true, "Registered is required"]
    },
    typeOfRegistration: {
      trim: true,
      type: String,
      enum: ['Sole Proprietor', 'LLP', 'Partnership', 'Private Limited']
    },
    yaerOfRegistration: {
      trim: true,
      type: String,
    },
    startupStage: {
      trim: true,
      type: String,
      required: [true, "Startup Stage is required"],
      enum: ['Idea', 'Product Development', 'Pre-revenue(Just Launched)', 'Revenue Stage']
    },
    startWorkingOnIdea: {
      trim: true,
      type: Date,
      required: [true, "Start Time is required"]
    },
    currentMonthlyRevenue: {
      trim: true,
      type: String,
      required: [true, "Current monthly revenue is required"],
      enum: ['0', 'Under 1 lac', '1-5 Lac', 'Above 5 lac']
    },
    problemYouAreSolving: {
      trim: true,
      type: String,
      required: [true, "The problem you are solving is required"],
      validate(value) {
        if (value.length < 5 || value.length > 60) {
          throw new Error("The problem you are solving is invalid!");
        }
      }
    },
    productDescription: {
      trim: true,
      type: String,
      required: [true, "Product Description is required"],
      validate(value) {
        if (value.length < 5 || value.length > 100) {
          throw new Error("Product Description is invalid!");
        }
      }
    },
    numberOfFounders: {
      trim: true,
      type: Number,
      required: [true, "Number of founders is required"],
      enum: [1, 2, 3, 4, 5]
    },
    foundersDetails: [FOUNDERDETAILS],
    address: ADDRESS,
    pitchDeck: {
      s3FileName: {
        trim: true,
        type: String,
        unique: [true, "s3FileName already registered"],
        required: [true, "Pitch Deck is required"],
      },
      originalFileName: {
        trim: true,
        type: String,
        required: [true, "Pitch Deck is required"],
      }
    },
    financialPlan: {   // 12 Months PLan
      s3FileName: {
        trim: true,
        type: String,
        unique: [true, "s3FileName already registered"],
        required: [true, "Financial Plan is required"],
      },
      originalFileName: {
        trim: true,
        type: String,
        required: [true, "Financial Plan is required"],
      }
    },
    contactsDetails: {
      name: {
        trim: true,
        type: String,
        required: [true, "Name is required!"],
        validate(value) {
          if (value.length < 1 || value.length > 50) {
            throw new Error("Name is invalid!");
          }
        }
      },
      role: {
        trim: true,
        type: String,
        required: [true, "Role is required!"],
        validate(value) {
          if (value.length < 1 || value.length > 50) {
            throw new Error("Role is invalid!");
          }
        }
      },
      email: {
        trim: true,
        type: String,
        required: [true, "Email is required"],
        validate(value) {
          if (value.length < 5 || value.length > 50) {
            throw new Error("Email is invalid!");
          }
        }
      },
      mobile: {
        trim: true,
        type: String,
        required: [true, "Mobile Number is required"],
        validate(value) {
          if (value.length !== 10) {
            throw new Error("Mobile Number is invalid!");
          }
        }
      },
    }
  },
  {
    timestamps: true
  }
);


const Incubations = mongoose.model("Incubations", incubationsSchema);

module.exports = Incubations;
