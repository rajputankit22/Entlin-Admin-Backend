const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CASHEFREE = {
  orderId: {
    trim: true,
    type: String
  },
  orderAmount: {
    trim: true,
    type: Number
  },
  paymentMode: {
    trim: true,
    type: String
  },
  referenceId: {
    trim: true,
    type: String
  },
  txStatus: {
    trim: true,
    type: String
  },
  txMsg: {
    trim: true,
    type: String
  },
  txTime: {
    trim: true,
    type: Date
  },
  signature: {
    trim: true,
    type: String
  }
}

const subscriptionSchema = new Schema({
  studentId: {
    trim: true,
    type: Schema.Types.ObjectId,
    ref: "Students",
    required: [true, "Student ID is required"]
  },
  subscriptionType: {
    trim: true,
    type: String,
    enum: ['monthly', 'quarterly', 'yearly'],
    required: [true, "Subscription Type is required"],
  },
  paid_timestamp: {
    trim: true,
    type: Date
  },
  end_timestamp: {
    trim: true,
    type: Date
  },
  _paid: {
    type: Boolean,
    default: false,
    required: true
  },
  casheFree: CASHEFREE
},
  {
    timestamps: true
  }
);

const Subscriptions = mongoose.model("Subscriptions", subscriptionSchema);

module.exports = Subscriptions;