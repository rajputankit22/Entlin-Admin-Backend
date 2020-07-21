const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const registrationSchema = new Schema({
  studentId: {
    trim: true,
    type: Schema.Types.ObjectId,
    ref: "Students",
    required: [true, "Student ID is required"]
  },
  eventId: {
    trim: true,
    type: Schema.Types.ObjectId,
    ref: "Events",
    required: [true, "Student ID is required"]
  },
},
  {
    timestamps: true
  }
);

const Registrations = mongoose.model("Registrations", registrationSchema);

module.exports = Registrations;