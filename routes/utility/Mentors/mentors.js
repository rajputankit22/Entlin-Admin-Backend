const moment = require("moment");
const Mentors = require("../../../models/mentors");
const Students = require("../../../models/students");
const {
  check,
  validationResult
} = require("express-validator");

/* Add new mentor */
module.exports.addMentor = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }
  try {
    const findStudent = await Students.findOne({ email: req.body.email });
    if (findStudent) {
      throw new Error("Email is registered as a student!");
    }
    const mentor = new Mentors({
      mentorName: req.body.mentorName,
      email: req.body.email,
      password: req.body.password,
      mobile: req.body.mobile,
      dob: req.body.dob,
      totalExperience: req.body.totalExperience,
      higerEducation: req.body.higerEducation,
      skills: req.body.skills,
      currentlyWorking: req.body.currentlyWorking,
      aboutMe: req.body.aboutMe,
      address: req.body.address,
    });
    const savedMentor = await mentor.save();
    // const token = await savedMentor.generateAuthToken();
    // const newRefreshToken = await savedMentor.generateRefreshToken();
    // const updatedMentor = await Mentors.findByIdAndUpdate(savedMentor._id, { refreshToken: newRefreshToken }, { new: true })
    res.status(200).send({
      success: true,
      message: "Mentor added Successfully!",
    });
  } catch (err) {
    console.log(err);
    if (err) {
      if (err.name == 'ValidationError') {
        for (field in err.errors) {
          res.status(422).send({ error: err.errors[field].message });
        }
      } else if (err.name == 'MongoError' && err.code == 11000) {
        res.status(422).send({ success: false, error: "Mentor already exist!" });
      } else { res.status(500).json({ success: false, error: err.message || err }); }
    }
  }
};

/* Update mentors's profile */
module.exports.updateProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }
  try {
    const findMentor = await Mentors.findMentorById(req.params.mentorId);
    findMentor.mentorName = req.body.mentorName;
    findMentor.email = req.body.email;
    findMentor.mobile = req.body.mobile;
    findMentor.dob = req.body.dob;
    findMentor.totalExperience = req.body.totalExperience;
    findMentor.higerEducation = req.body.higerEducation;
    findMentor.skills = req.body.skills;
    findMentor.currentlyWorking = req.body.currentlyWorking;
    findMentor.aboutMe = req.body.aboutMe;
    findMentor.address = req.body.address;
    const savedMentor = await findMentor.save();
    res.status(200).send({
      success: true,
      message: "Mentor Updated Successfully!",
      mentor: savedMentor.getPublicProfileMentor(),
    });
  } catch (err) {
    console.log(err);
    if (err) {
      if (err.name == 'ValidationError') {
        for (field in err.errors) {
          res.status(422).send({ error: err.errors[field].message });
        }
      } else if (err.name == 'MongoError' && err.code == 11000) {
        res.status(422).send({ success: false, error: "Mentor already exist!" });
      } else { res.status(500).json({ success: false, error: err }); }
    }
  }
};

/* Fetch mentor */
module.exports.fetchMentor = async (req, res, next) => {
  try {
    const mentor = await Mentors.findById({ _id: req.params.mentorId }, { password: 0, createdAt: 0, updatedAt: 0 });
    res.status(200).json({
      success: true,
      mentor: mentor.getPublicProfileMentor()
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Remove any mentor */
module.exports.removeMentor = async (req, res, next) => {
  try {
    const deletedMentor = await Mentors.deleteOne({ _id: req.params.mentorId });
    res.status(200).json({
      success: true,
      message: "Mentor Removed Successfully!",
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Fetch all mentors' list */
module.exports.fetchAllMentors = async (req, res, next) => {
  try {
    const mentors = await Mentors.find({}, { password: 0, ACL: 0, createdAt: 0, updatedAt: 0, refreshToken: 0 });
    res.status(200).json({
      success: true,
      mentors: mentors
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

