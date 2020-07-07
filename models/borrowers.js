const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config")
const cryptoRandomString = require("crypto-random-string");
const { roundOf } = require("../routes/utility/Commons/functions");

/* Company Details */
const BUSINESS = {
  name: {
    trim: true,
    type: String,
    require: [true, "Bussiness Name is required"],
    validate(value) {
      if (value.length < 2 || value.length > 50) {
        throw new Error("Business Name should should be atleast 6 and at most 50 characters!");
      }
    }
  },
  type: {
    trim: true,
    type: String,
    enum: ["Private Limited", "LLP", "Partnership", "Sole Proprietorship", "Public Limited"],
  },
  incorporationDate: {
    trim: true,
    type: Date,
  },
  businessTurnover: {
    trim: true,
    enum: ["Less than 5 Lac", "05-10Lac", "11-25Lac", "26-50Lac", "51Lac-01Cr", "01-05Cr", "05Cr+"],
    type: String,
    required: [true, "Business Turnover is required"],
  },
  sector: {
    trim: true,
    type: String,
    enum: ["AGRICULTURE AND ALLIED INDUSTRIES", "AUTOMOBILES", "AUTO COMPONENTS", "AVIATION", "BANKING", "CEMENT", "CONSUMER DURABLES", "ECOMMERCE", "EDUCATION AND TRAINING", "ENGINEERING AND CAPITAL GOODS", "FINANCIAL SERVICES", "FMCG", "GEMS AND JEWELLERY", "HEALTHCARE", "INFRASTRUCTURE", "INSURANCE", "IT & ITES", "MANUFACTURING", "MEDIA AND ENTERTAINMENT", "METALS AND MINING", "OIL AND GAS", "PHARMACEUTICALS", "PORTS", "POWER", "RAILWAYS", "REAL ESTATE", "RENEWABLE ENERGY", "RETAIL", "ROADS", "SCIENCE AND TECHNOLOGY", "SERVICES", "STEEL", "TELECOMMUNICATIONS", "TEXTILES", "TOURISM AND HOSPITALITY"],
  },
  pan: {
    trim: true,
    type: String,
    uppercase: true,
    validate(value) {
      if (value.length !== 10) {
        throw new Error("Bussiness PAN is invalid!");
      }
    }
  },
  gst: {
    trim: true,
    uppercase: true,
    type: String,
    validate(value) {
      if (value.length !== 15) {
        throw new Error("Bussiness GST is invalid!");
      }
    }
  }
}

/* Company's Registered Address */
const REGISTEREDADDRESS = {
  address: {
    trim: true,
    type: String,
    validate(value) {
      if (value.length < 2 || value.length > 50) {
        throw new Error("Registered Address should be atleast 5 and at most 200 characters!");
      }
    }
  },
  city: {
    trim: true,
    type: String,
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
    require: [true, "Registered Address Pin is required"],
    validate(value) {
      if (!(value >= 100000 && value <= 999999)) {
        throw new Error("Registered Address Pin is invalid!");
      }
    }
  }
}

/* Company's Office Address */
const OFFICEADDRES = {
  address: {
    trim: true,
    type: String,
    validate(value) {
      if (value.length < 2 || value.length > 50) {
        throw new Error("Office Address should be atleast 5 and at most 200 characters!");
      }
    }
  },
  city: {
    trim: true,
    type: String,
    require: [true, "Operational City is required"],
    validate(value) {
      if (value.length < 2 || value.length > 50) {
        throw new Error("Office Address City should be atleast 2 and at most 50 characters!");
      }
    }
  },
  state: {
    trim: true,
    uppercase: true,
    type: String,
    validate(value) {
      if (value.length < 2 || value.length > 50) {
        throw new Error("Office Address State should be atleast 2 and at most 50 characters!");
      }
    }
  },
  pin: {
    trim: true,
    uppercase: true,
    type: Number,
    require: [true, "Office Address Pin is required"],
    validate(value) {
      if (!(value >= 100000 && value <= 999999)) {
        throw new Error("Office Address Pin is invalid!");
      }
    }
  }
}

/* Company's Owner Detail */
const OWNERDETAIL = {
  firstName: {
    trim: true,
    type: String,
    validate(value) {
      if (value.length < 2 || value.length > 50) {
        throw new Error("Owner firstName is invalid!");
      }
    }
  },
  lastName: {
    trim: true,
    type: String,
    validate(value) {
      if (value.length < 1 || value.length > 50) {
        throw new Error("Owner lastName is invalid!");
      }
    }
  },
  designation: {
    trim: true,
    type: String,
    validate(value) {
      if (value.length < 2 || value.length > 50) {
        throw new Error("Owner's Designation is invalid!");
      }
    }
  },
  gender: {
    trim: true,
    type: String,
    enum: ["male", "female"],
  },
  email: {
    trim: true,
    type: String,
    validate(value) {
      if (value.length < 5 || value.length > 50) {
        throw new Error("Owner's  email is invalid!");
      }
    }
  },
  mobile: {
    trim: true,
    type: String,
    validate(value) {
      if (value.length !== 10) {
        throw new Error("Owner mobile number is invalid!");
      }
    }
  },
  dob: {
    trim: true,
    type: Date,
  },
  pan: {
    trim: true,
    uppercase: true,
    type: String,
    validate(value) {
      if (value.length !== 10) {
        throw new Error("Owner pan is invalid!");
      }
    }
  }
}

/* Company's Owner Address */
const OWNERADDRESS = {
  address: {
    trim: true,
    type: String,
    validate(value) {
      if (value.length < 2 || value.length > 50) {
        throw new Error("Owner's Address should be atleast 5 and at most 200 characters!");
      }
    }
  },
  city: {
    trim: true,
    type: String,
    validate(value) {
      if (value.length < 2 || value.length > 50) {
        throw new Error("Owner's Address City should be atleast 2 and at most 50 characters!");
      }
    }
  },
  state: {
    trim: true,
    uppercase: true,
    type: String,
    validate(value) {
      if (value.length < 2 || value.length > 50) {
        throw new Error("Owner's Address State should be atleast 2 and at most 50 characters!");
      }
    }
  },
  pin: {
    trim: true,
    uppercase: true,
    type: Number,
    require: [true, "Owner's Address Pin is required"],
    validate(value) {
      if (!(value >= 100000 && value <= 999999)) {
        throw new Error("Owner's Address Pin is invalid!");
      }
    }
  }
}

/* Company's Directors' Details */
const DIRECTORS = {
  name: {
    trim: true,
    type: String,
    validate(value) {
      if (value.length < 2 || value.length > 50) {
        throw new Error("Director's Name is invalid!");
      }
    }
  },
  email: {
    trim: true,
    type: String,
    validate(value) {
      if (value.length < 5 || value.length > 50) {
        throw new Error("Email should be atleast 5 and atmost 50 characters!");
      }
    }
  },
  mobile: {
    trim: true,
    type: String,
    validate(value) {
      if (value.length !== 10) {
        throw new Error("Mobile Number should be 10 numerics!");
      }
    }
  }
}

/* Company's Documents */
const DOCUMENTS = {
  bankStatements: [{
    originalFilename: {
      type: String,
      trim: true,
      validate(value) {
        if (value.length < 2 || value.length > 200) {
          throw new Error("File Name should be less than 200 characters!");
        }
      }
    },
    filename: {
      type: String,
      trim: true,
      validate(value) {
        if (value.length < 2 || value.length > 200) {
          throw new Error("File Name should be less than 200 characters!");
        }
      }
    },
    bankName: {
      trim: true,
      type: String,
      validate(value) {
        if (value.length < 2 || value.length > 50) {
          throw new Error("Bank Name should be less than 50 characters!");
        }
      }
    },
    password: {
      trim: true,
      type: String
    }
  }],
  balanceSheets: [{
    originalFilename: {
      type: String,
      trim: true,
      validate(value) {
        if (value.length < 2 || value.length > 200) {
          throw new Error("File Name should be less than 200 characters!");
        }
      }
    },
    filename: {
      type: String,
      trim: true,
      validate(value) {
        if (value.length < 2 || value.length > 200) {
          throw new Error("File Name should be less than 200 characters!");
        }
      }
    }
  }],
  pnlStatements: [{
    originalFilename: {
      type: String,
      trim: true,
      validate(value) {
        if (value.length < 2 || value.length > 200) {
          throw new Error("File Name should be less than 200 characters!");
        }
      }
    },
    filename: {
      type: String,
      trim: true,
      validate(value) {
        if (value.length < 2 || value.length > 200) {
          throw new Error("File Name should be less than 200 characters!");
        }
      }
    }
  }],
  capitalAccountStatements: [{
    originalFilename: {
      type: String,
      trim: true,
      validate(value) {
        if (value.length < 2 || value.length > 200) {
          throw new Error("File Name should be less than 200 characters!");
        }
      }
    },
    filename: {
      type: String,
      trim: true,
      validate(value) {
        if (value.length < 2 || value.length > 200) {
          throw new Error("File Name should be less than 200 characters!");
        }
      }
    }
  }],
  gstReturns: [{
    originalFilename: {
      type: String,
      trim: true,
      validate(value) {
        if (value.length < 2 || value.length > 200) {
          throw new Error("File Name should be less than 200 characters!");
        }
      }
    },
    filename: {
      type: String,
      trim: true,
      validate(value) {
        if (value.length < 2 || value.length > 200) {
          throw new Error("File Name should be less than 200 characters!");
        }
      }
    }
  }],
  itr: [{
    originalFilename: {
      type: String,
      trim: true,
      validate(value) {
        if (value.length < 2 || value.length > 200) {
          throw new Error("File Name should be less than 200 characters!");
        }
      }
    },
    filename: {
      type: String,
      trim: true,
      validate(value) {
        if (value.length < 2 || value.length > 200) {
          throw new Error("File Name should be less than 200 characters!");
        }
      }
    }
  }],
  companyPan: {
    originalFilename: {
      type: String,
      trim: true,
      validate(value) {
        if (value.length < 2 || value.length > 200) {
          throw new Error("File Name should be less than 200 characters!");
        }
      }
    },
    filename: {
      type: String,
      trim: true,
      validate(value) {
        if (value.length < 2 || value.length > 200) {
          throw new Error("File Name should be less than 200 characters!");
        }
      }
    }
  },
  companyAddressProof: {
    originalFilename: {
      type: String,
      trim: true,
      validate(value) {
        if (value.length < 2 || value.length > 200) {
          throw new Error("File Name should be less than 200 characters!");
        }
      }
    },
    filename: {
      type: String,
      trim: true,
      validate(value) {
        if (value.length < 2 || value.length > 200) {
          throw new Error("File Name should be less than 200 characters!");
        }
      }
    }
  },
  directorPan: {
    originalFilename: {
      type: String,
      trim: true,
      validate(value) {
        if (value.length < 2 || value.length > 200) {
          throw new Error("File Name should be less than 200 characters!");
        }
      }
    },
    filename: {
      type: String,
      trim: true,
      validate(value) {
        if (value.length < 2 || value.length > 200) {
          throw new Error("File Name should be less than 200 characters!");
        }
      }
    }
  }
}

const borrowerSchema = new Schema(
  {
    applicantFirstName: {
      trim: true,
      type: String,
      required: [true, "Applicant First Name is required!"],
      validate(value) {
        if (value.length < 2 || value.length > 50) {
          throw new Error("Applicant First Name is invalid!");
        }
      }
    },
    applicantLastName: {
      trim: true,
      type: String,
      required: [true, "Applicant Last Name is required!"],
      validate(value) {
        if (value.length < 1 || value.length > 50) {
          throw new Error("Applicant Last Name is invalid!");
        }
      }
    },
    email: {
      trim: true,
      type: String,
      unique: [true, "Email already registered"],
      required: [true, "Email is required"],
      validate(value) {
        if (value.length < 10 || value.length > 50) {
          throw new Error("Email should be atleast 5 and atmost 50 characters!");
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
    officeLandlineNumber: {
      type: String,
      trim: true,
      validate(value) {
        if (value.length < 15) {
          throw new Error("Landline is invalid!");
        }
      }
    },
    totalInterest: {
      trim: true,
      type: Number,
      default: roundOf(config.TOTAL_INTEREST),
      required: [true, "Total Interest is required"]
    },
    payMateCreditLimit: {
      trim: true,
      type: Number,
      default: roundOf(0),
      default: 0,
      min: [0, 'PayMate Credit Limit should be grater than 0'],
      max: [2000000, , 'PayMate Credit Limit should be less than 2000000'],
      required: [true, "PayMate Credit Limit is required"]
    },
    termLoanLimit: {
      trim: true,
      type: Number,
      default: roundOf(0),
      default: 0,
      min: [0, 'Term Loan Limit should be grater than 0'],
      max: [2000000, , 'Term Loan Limit should be less than 2000000'],
      required: [true, "Term Loan Limit is required"]
    },
    fiCreditLimit: {
      trim: true,
      type: Number,
      default: roundOf(0),
      default: 0,
      min: [0, 'Fi Credit Limit should be grater than 0'],
      max: [2000000, , 'Fi Credit Limit should be less than 2000000'],
      required: [true, "Fi Credit Limit is required"]
    },
    business: BUSINESS,
    registeredAddress: REGISTEREDADDRESS,
    officeAddress: OFFICEADDRES,
    ownerDetails: OWNERDETAIL,
    ownerAddress: OWNERADDRESS,
    documents: DOCUMENTS,
    directors: [DIRECTORS]
  },
  {
    timestamps: true
  }
);

// Validation for directors' size
borrowerSchema.path('directors').validate(function (value) {
  if (value.length < 1 && value.length > 3) {
    throw new Error("Directors' size can't be greater than 3!");
  }
});

// Validation for Bank Statements size
borrowerSchema.path('documents.bankStatements').validate(function (value) {
  if (value.length < 1 && value.length > 10) {
    throw new Error("Number of Bank Statements should be less than 10!");
  }
});

// Validation for Balance Sheets size
borrowerSchema.path('documents.balanceSheets').validate(function (value) {
  if (value.length < 1 && value.length > 10) {
    throw new Error("Number of Balance Sheets should be less than 10!");
  }
});

// Validation for PNL Statements size
borrowerSchema.path('documents.pnlStatements').validate(function (value) {
  if (value.length < 1 && value.length > 10) {
    throw new Error("Number of PNL Statements should be less than 10!");
  }
});

// Validation for Capital Account Statements filse
borrowerSchema.path('documents.capitalAccountStatements').validate(function (value) {
  if (value.length < 1 && value.length > 10) {
    throw new Error("Number of Capital Account Statements should be less than 10!");
  }
});

// Validation for GST Returns filse
borrowerSchema.path('documents.gstReturns').validate(function (value) {
  if (value.length < 1 && value.length > 10) {
    throw new Error("Number of GST Returns should be less than 10!");
  }
});

// Validation for number of ITR filse
borrowerSchema.path('documents.itr').validate(function (value) {
  if (value.length < 1 && value.length > 10) {
    throw new Error("Number of ITR Statements should be less than 10!");
  }
});

// Profile without password
borrowerSchema.methods.getPublicProfile = function () {
  const admin = this;
  const userObject = admin.toObject();
  delete userObject.password;
  delete userObject.token;
  delete userObject.createdAt;
  delete userObject.updatedAt;
  delete userObject.documents;
  delete userObject.directors;
  return userObject;
};

// Profile without password
borrowerSchema.methods.getPublicProfileBorrower = function () {
  const admin = this;
  const userObject = admin.toObject();
  delete userObject.password;
  delete userObject.token;
  delete userObject.createdAt;
  delete userObject.updatedAt;
  delete userObject.refreshToken;
  return userObject;
};

// Generate jwt token
borrowerSchema.methods.generateAuthToken = async function () {
  const admin = this;
  const randomNumber = Math.floor(Math.random() * 150 + 100);
  const randomString = cryptoRandomString({
    length: randomNumber,
    type: "base64"
  });
  const token = jwt.sign(
    {
      _id: admin._id.toString(),
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
borrowerSchema.methods.generateRefreshToken = async function () {
  const borrower = this;
  const randomNumber = Math.floor(Math.random() * 150 + 100);
  const randomString = cryptoRandomString({
    length: randomNumber,
    type: "base64"
  });
  const token = jwt.sign(
    {
      _id: borrower._id.toString(),
      randomString
    },
    config.REFRESH_TOKEN_SECRET,
  );
  return token;
};

borrowerSchema.methods.comparePassword = async function (password) {
  const borrower = this;
  const isMatch = await bcrypt.compare(password, borrower.password);
  if (!isMatch) {
    return false;
  } else {
    return true;
  }
};

// Check password match
borrowerSchema.statics.findByCredentials = async (email, password) => {
  const borrower = await Borrowers.findOne({
    email: email
  });
  if (!borrower) {
    throw new Error("Email is not registered!");
  }
  const isMatch = await bcrypt.compare(password, borrower.password);
  if (!isMatch) {
    throw new Error("Invalid password!");
  }
  return borrower;
};

// Find user by _id
borrowerSchema.statics.findBorrowerById = async _id => {
  const borrower = await Borrowers.findById({
    _id: _id
  });
  if (!borrower) {
    throw new Error("User not found");
  }
  return borrower;
};

// Hash the plain text password before saving
borrowerSchema.pre("save", async function (next) {
  const borrower = this;
  try {
    if (borrower.isModified("password")) {
      borrower.password = await bcrypt.hash(borrower.password, 8);
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Borrowers = mongoose.model("Borrowers", borrowerSchema);

module.exports = Borrowers;
