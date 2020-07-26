const Registrations = require("../../../models/registrations");
const {
  check,
  validationResult
} = require("express-validator");

/* Fetch all reigstrations */
module.exports.fetchAllRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registrations.find({}, { createdAt: 0, updatedAt: 0 });
    res.status(200).json({
      success: true,
      registrations: registrations
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Fetch single event reigstrations */
module.exports.fetchSingleEventRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registrations.find({ eventId: req.params.eventId }, { createdAt: 0, updatedAt: 0 });
    res.status(200).json({
      success: true,
      registrations: registrations
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};