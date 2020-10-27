const Students = require("../../../models/students");
const Incubations = require("../../../models/incubations");
const jwt = require("jsonwebtoken");
const config = require("../../../config")
const { check, validationResult } = require("express-validator");
const { removeFile, getPreSignedUrl } = require('../Commons/functions');
const common = require("../Commons/functions")



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

/* Delete Incubation */
module.exports.deleteIncubation = async (req, res, next) => {
  try {
    const removedIncubation = await Incubations.findByIdAndDelete(req.params.incubationId)
    const response1 = await removeFile(removedIncubation.pitchDeck.s3FileName);
    const response2 = await removeFile(removedIncubation.financialPlan.s3FileName);
    res.status(200).send({
      success: true,
      incubationId: removedIncubation._id,
      message: "Incubation Successfully Deleted!"
    });
  } catch (error) {
    console.log(error);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
}

/* Update Incubation */
module.exports.updateIncubation = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array()
    });
  }
  try {
    const findIncubation = await Incubations.findById(req.params.incubationId);
    // findIncubation.address = req.body.address
    // findIncubation.foundersDetails = req.body.foundersDetails
    // findIncubation.contactsDetails = req.body.contactsDetails
    // findIncubation.startupName = req.body.startupName
    // findIncubation.registered = req.body.registered
    findIncubation.typeOfRegistration = req.body.typeOfRegistration
    findIncubation.yaerOfRegistration = req.body.yaerOfRegistration
    findIncubation.startupStage = req.body.startupStage
    findIncubation.startWorkingOnIdea = req.body.startWorkingOnIdea
    findIncubation.currentMonthlyRevenue = req.body.currentMonthlyRevenue
    findIncubation.problemYouAreSolving = req.body.problemYouAreSolving
    findIncubation.productDescription = req.body.productDescription
    findIncubation.numberOfFounders = req.body.numberOfFounders
    // findIncubation.pitchDeck = req.body.pitchDeck
    // findIncubation.financialPlan = req.body.financialPlan
    const saveIncubation = await findIncubation.save();
    res.status(200).json({
      success: true,
      incubation: saveIncubation
    });
  } catch (err) {
    console.log(err);
    if (err) {
      if (err.name == 'ValidationError') {
        for (field in err.errors) {
          res.status(422).send({ error: err.errors[field].message });
        }
      } else if (err.name == 'MongoError' && err.code == 11000) {
        res.status(422).send({ success: false, error: "Incubation already exist!" });
      } else { res.status(500).json({ success: false, error: err }); }
    }
  }
};

/* Fetch all Incubations' list */
module.exports.fetchAllIncubations = async (req, res, next) => {
  try {
    const incubations = await Incubations.find({}, { createdAt: 0, updatedAt: 0 }).populate({ path: 'studentId', select: 'studentName' });
    res.status(200).json({
      success: true,
      incubations: incubations
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Fetch one Incubation */
module.exports.fetchIncubation = async (req, res, next) => {
  try {
    const incubation = await Incubations.findById(req.params.incubationId).populate({ path: "studentId", select: "studentName" });
    if (incubation) {
      res.status(200).json({
        success: true,
        incubation: incubation
      });
    } else {
      res.status(501).send({
        success: false,
        error: "Incubation is not present!"
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

/* Generate pre singed url for file */
module.exports.getPreSignedUrl = async (req, res, next) => {
  try {
    let url = await getPreSignedUrl(req.params.fileName)
    res.status(200).send({
      success: true,
      url: url
    });
  } catch (error) {
    console.log(error);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
}