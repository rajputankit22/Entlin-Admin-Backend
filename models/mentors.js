const mongoose = require("mongoose");
const cryptoRandomString = require("crypto-random-string");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config")
const Schema = mongoose.Schema;

/* Student's Address */
const ADDRESS = {
    address: {
        trim: true,
        type: String,
        required: [true, "Mentor's address is required!"],
        validate(value) {
            if (value.length < 2 || value.length > 50) {
                throw new Error("Registered Address should be atleast 5 and at most 200 characters!");
            }
        }
    },
    city: {
        trim: true,
        type: String,
        required: [true, "Mentor's city is required!"],
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
        required: [true, "Mentor's state is required!"],
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
        required: [true, "Mentor's pin code is required!"],
        require: [true, "Registered Address Pin is required"],
        validate(value) {
            if (!(value >= 100000 && value <= 999999)) {
                throw new Error("Registered Address Pin is invalid!");
            }
        }
    }
}

const mentorSchema = new Schema(
    {
        mentorName: {
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
        profilePicName: {
            trim: true,
            type: String,
            unique: [true, "Profile pic name already taken"],
        },
        dob: {
            trim: true,
            type: Date,
        },
        enrollments: {
            trim: true,
            type: Number,
            Default: 0
        },
        totalExperience: {
            trim: true,
            type: Number
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
        currentlyWorking: {
            trim: true,
            type: String,
            validate(value) {
                if (value.length < 5 || value.length > 50) {
                    throw new Error("Company name should be atleast 5 and at most 50 characters!");
                }
            }
        },
    },
    {
        timestamps: true
    }
);

// Profile without password
mentorSchema.methods.getPublicProfile = function () {
    const mentor = this;
    const mentorObject = mentor.toObject();
    delete mentorObject.password;
    delete mentorObject.token;
    delete mentorObject.createdAt;
    delete mentorObject.updatedAt;
    return mentorObject;
};

// Profile without password & refresh token
mentorSchema.methods.getPublicProfileMentor = function () {
    const mentor = this;
    const mentorObject = mentor.toObject();
    delete mentorObject.password;
    delete mentorObject.token;
    delete mentorObject.createdAt;
    delete mentorObject.updatedAt;
    delete mentorObject.refreshToken;
    return mentorObject;
};

// Generate jwt token
mentorSchema.methods.generateAuthToken = async function () {
    const mentor = this;
    const randomNumber = Math.floor(Math.random() * 150 + 100);
    const randomString = cryptoRandomString({
        length: randomNumber,
        type: "base64"
    });
    const token = jwt.sign(
        {
            _id: mentor._id.toString(),
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
mentorSchema.methods.generateRefreshToken = async function () {
    const mentor = this;
    const randomNumber = Math.floor(Math.random() * 150 + 100);
    const randomString = cryptoRandomString({
        length: randomNumber,
        type: "base64"
    });
    const token = jwt.sign(
        {
            _id: mentor._id.toString(),
            randomString
        },
        config.REFRESH_TOKEN_SECRET,
    );
    return token;
};

mentorSchema.methods.comparePassword = async function (password) {
    const mentor = this;
    const isMatch = await bcrypt.compare(password, mentor.password);
    if (!isMatch) {
        return false;
    } else {
        return true;
    }
};

// Check password match
mentorSchema.statics.findByCredentials = async (email, password) => {
    const mentor = await Mentors.findOne({
        email: email
    });
    if (!mentor) {
        throw new Error("Email is not registered!");
    }
    const isMatch = await bcrypt.compare(password, mentor.password);
    if (!isMatch) {
        throw new Error("Invalid password!");
    }
    return mentor;
};

// Find mentor by _id
mentorSchema.statics.findMentorById = async _id => {
    const mentor = await Mentors.findById({
        _id: _id
    });
    if (!mentor) {
        throw new Error("Mentor not found");
    }
    return mentor;
};

// Hash the plain text password before saving
mentorSchema.pre("save", async function (next) {
    const mentor = this;
    try {
        if (mentor.isModified("password")) {
            mentor.password = await bcrypt.hash(mentor.password, 8);
        }
        next();
    } catch (error) {
        next(error);
    }
});

const Mentors = mongoose.model("Mentors", mentorSchema);

module.exports = Mentors;
