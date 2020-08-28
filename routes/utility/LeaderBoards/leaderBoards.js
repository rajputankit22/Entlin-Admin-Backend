const moment = require("moment");
const Points = require("../../../models/points");
const {
  check,
  validationResult
} = require("express-validator");
const config = require("../../../config");
const Students = require("../../../models/students");

/* Get students based on points for leader Boards */
module.exports.getTopStudents = async (req, res, next) => {
  const aggregate = [
    {
      "$group": {
        "_id": "$studentId",
        "total": {
          "$sum": "$points"
        }
      }
    },
    { "$sort": { "total": -1 } },
    { "$limit": 10 },
    {
      "$lookup":
      {
        "from": "students",
        "localField": "_id",
        "foreignField": "_id",
        "as": "student"
      }
    },
    {
      "$project": {
        "_id": 1,
        "total": 1,
        "studentName": { "$arrayElemAt": ["$student.studentName", 0] },
        "email": { "$arrayElemAt": ["$student.email", 0] },
        "mobile": { "$arrayElemAt": ["$student.mobile", 0] },
      }
    }
  ];
  try {
    const students = await Points.aggregate(aggregate)
    res.status(200).json({
      success: true,
      students: students
    });
  } catch (error) {
    console.log(error);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

