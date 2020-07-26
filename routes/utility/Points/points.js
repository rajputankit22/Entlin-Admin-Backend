const moment = require("moment");
const Points = require("../../../models/points");
const {
  check,
  validationResult
} = require("express-validator");
const config = require("../../../config")

/* Icrease student's points */
module.exports.increasePoints = async (req, res, next) => {
  try {
    console.log(req.params.reason)
    console.log(config.Points[req.params.reason])
    const points = new Points({
      studentId: req.student._id,
      points: config.Points[req.params.reason],
      reason: req.params.reason,
    })
    const savedPoints = await points.save()
    res.status(200).json({
      success: true,
      point: savedPoints
    });
  } catch (err) {
    console.log(err);
    if (err) {
      if (err.name == 'ValidationError') {
        for (field in err.errors) {
          res.status(422).send({ success: false, error: err.errors[field].message });
        }
      } else if (err.name == 'MongoError' && err.code == 11000) {
        res.status(422).send({ success: false, error: "Points already exist!" });
      } else { res.status(500).json({ success: false, error: err }); }
    }
  }
};

