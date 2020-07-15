const Students = require("../../../models/students");
const jwt = require("jsonwebtoken");
const config = require("../../../config")
const { check, validationResult } = require("express-validator");


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
      admin: savedMentor.getPublicProfileMentor(),
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

/* Fetch one student */
module.exports.fetchStudent = async (req, res, next) => {
  try {
    const student = await Students.findById({ _id: req.params.studentId }, { password: 0, createdAt: 0, updatedAt: 0 });
    res.status(200).json({
      success: true,
      student: student.getPublicProfileStudent()
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Remove any student */
module.exports.removeStudent = async (req, res, next) => {
  try {
    const deletedStudent = await Students.deleteOne({ _id: req.params.studentId });
    res.status(200).json({
      success: true,
      message: "Student Removed Successfully!",
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Fetch all students' list */
module.exports.fetchAllStudents = async (req, res, next) => {
  try {
    const students = await Students.find({}, { password: 0, ACL: 0, mobile: 0, createdAt: 0, updatedAt: 0, refreshToken: 0 });
    res.status(200).json({
      success: true,
      students: students
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};
