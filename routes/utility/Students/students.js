const Students = require("../../../models/students");
const jwt = require("jsonwebtoken");
const config = require("../../../config")
const { check, validationResult } = require("express-validator");


/* Update student's profile */
module.exports.updateProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array()
    });
  }
  try {
    const findStudent = await Students.findStudentById(req.params.studentId);
    findStudent.studentName = req.body.studentName;
    findStudent.email = req.body.email;
    findStudent.mobile = req.body.mobile;
    findStudent.skills = req.body.skills;
    findStudent.higerEducation = req.body.higerEducation;
    findStudent.aboutMe = req.body.aboutMe;
    findStudent.dob = req.body.dob;
    const saveStudent = await findStudent.save();
    res.status(200).json({
      success: true,
      student: saveStudent.getPublicProfileStudent()
    });
  } catch (err) {
    console.log(err);
    if (err) {
      if (err.name == 'ValidationError') {
        for (field in err.errors) {
          res.status(422).send({ error: err.errors[field].message });
        }
      } else if (err.name == 'MongoError' && err.code == 11000) {
        res.status(422).send({ success: false, error: "Student already exist!" });
      } else { res.status(500).json({ success: false, error: err }); }
    }
  }
};

/* Fetch one student */
module.exports.fetchStudent = async (req, res, next) => {
  try {
    const student = await Students.findById(req.params.studentId, { password: 0, createdAt: 0, updatedAt: 0 });
    if (student) {
      res.status(200).json({
        success: true,
        student: student.getPublicProfileStudent()
      });
    } else {
      res.status(501).send({
        success: false,
        error: "Student is not present!"
      });
    }
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
    const students = await Students.find({}, { password: 0, createdAt: 0, updatedAt: 0, refreshToken: 0 });
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
