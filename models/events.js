const mongoose = require("mongoose");
const { now } = require("moment-timezone");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  type: {
    trim: true,
    type: String,
    required: [true, "Type is required"],
    enum: ['Webinar', 'Live Talk']
  },
  title: {
    trim: true,
    type: String,
    required: [true, "Title is required"],
    validate(value) {
      if (value.length < 10 || value.length > 100) {
        throw new Error("Title at least 10 and at most 100 characters!");
      }
    }
  },
  description: {
    trim: true,
    type: String,
    required: [true, "Description is required"],
    validate(value) {
      if (value.length < 10 || value.length > 500) {
        throw new Error("Description at least 10 and at most 500 characters!");
      }
    }
  },
  createdBy: {
    trim: true,
    type: String,
    required: [true, "Creator Name is required"],
    validate(value) {
      if (value.length < 2 || value.length > 100) {
        throw new Error("Creator Name at least 2 and at most 100 characters!");
      }
    }
  },
  createrDetails: {
    trim: true,
    type: String,
    required: [true, "Creator details is required"],
    validate(value) {
      if (value.length < 2 || value.length > 500) {
        throw new Error("Creator Details at least 2 and at most 500 characters!");
      }
    }
  },
  startTime: {
    trim: true,
    type: Date,
    default: Date.now(),
    required: [true, "Start Time is required"]
  },
  duration: {
    trim: true,
    type: Number,
    default: 0,
    required: [true, "Duration is required"]
  },
  points: {
    trim: true,
    type: Number,
    default: 0,
    required: [true, "Points is required"]
  },
  price: {
    trim: true,
    type: Number,
    default: 0,
    required: [true, "Price is required"]
  },
},
  {
    timestamps: true
  }
);

const Events = mongoose.model("Events", eventSchema);

module.exports = Events;