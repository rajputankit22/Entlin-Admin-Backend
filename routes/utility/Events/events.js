const moment = require("moment");
const Events = require("../../../models/events");
const {
  check,
  validationResult
} = require("express-validator");
const config = require("../../../config");
const { findById } = require("../../../models/events");
const Registrations = require("../../../models/registrations");

/* Post new Event */
module.exports.postEvent = async (req, res, next) => {
  try {
    const event = new Events({
      type: req.body.type,
      title: req.body.title,
      description: req.body.description,
      createdBy: req.body.createdBy,
      createrDetails: req.body.createrDetails,
      startTime: moment(req.body.startTime),
      duration: req.body.duration,
      points: req.body.points,
      price: req.body.price,
    })
    const savedEvent = await event.save()
    res.status(200).json({
      success: true,
      event: savedEvent
    });
  } catch (err) {
    console.log(err);
    if (err) {
      if (err.name == 'ValidationError') {
        for (field in err.errors) {
          res.status(422).send({ success: false, error: err.errors[field].message });
        }
      } else if (err.name == 'MongoError' && err.code == 11000) {
        res.status(422).send({ success: false, error: "Event already exist!" });
      } else { res.status(500).json({ success: false, error: err }); }
    }
  }
};

/* Update Event */
module.exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Events.findById(req.params.eventId)
    event.type = req.body.type;
    event.title = req.body.title;
    event.description = req.body.description;
    event.createdBy = req.body.createdBy;
    event.createrDetails = req.body.createrDetails;
    event.startTime = moment(req.body.startTime);
    event.duration = req.body.duration;
    event.points = req.body.points;
    event.price = req.body.price;
    const savedEvent = await event.save()
    res.status(200).json({
      success: true,
      event: savedEvent
    });
  } catch (err) {
    console.log(err);
    if (err) {
      if (err.name == 'ValidationError') {
        for (field in err.errors) {
          res.status(422).send({ success: false, error: err.errors[field].message });
        }
      } else if (err.name == 'MongoError' && err.code == 11000) {
        res.status(422).send({ success: false, error: "Event already exist!" });
      } else { res.status(500).json({ success: false, error: err }); }
    }
  }
};

/* Delete event */
module.exports.deleteEvent = async (req, res, next) => {
  try {
    const removedEvent = await Events.deleteOne({ _id: req.params.eventId })
    res.status(200).send({
      success: true,
      message: "Event has been successfully deleted!"
    });
  } catch (error) {
    console.log(error);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
}

/* Fetch single Event */
module.exports.fetchEvent = async (req, res, next) => {
  try {
    const event = await Events.findById(req.params.eventId, { createdAt: 0, updatedAt: 0 });
    const registrations = await Registrations.find({ eventId: req.params.eventId }, { createdAt: 0, updatedAt: 0 }).populate({ path: 'studentId', select: 'studentName email mobile' });;
    res.status(200).json({
      success: true,
      event: event,
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

/* Fetch All Events */
module.exports.fetchAllEvents = async (req, res, next) => {
  try {
    const events = await Events.find({}, { createdAt: 0, updatedAt: 0 });
    res.status(200).json({
      success: true,
      events: events
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Fetch Single Student All Questions */
module.exports.fetchSingleStudentQuestions = async (req, res, next) => {
  try {
    const questions = await Questions.find({ studentId: req.params.studentId }, { createdAt: 0, updatedAt: 0 });
    res.status(200).json({
      success: true,
      questions: questions
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Close question. */
module.exports.closeQuestion = async (req, res, next) => {
  try {
    const closedQuestion = await Questions.findOneAndUpdate({ _id: req.params.questionId }, { $set: { status: 'close' } }, { new: true, fields: { createdAt: 0, updatedAt: 0 } });
    res.status(200).json({
      success: true,
      question: closedQuestion
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};


