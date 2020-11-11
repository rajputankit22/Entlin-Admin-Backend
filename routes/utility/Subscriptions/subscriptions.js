const Students = require("../../../models/students");
const { check, validationResult } = require("express-validator");
const Subscriptions = require("../../../models/subscriptions");
const moment = require("moment");

/* Fetch all Subscriptions */
module.exports.fetchAllSubscriptions = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array()
    });
  }
  try {
    const subscriptions = await Subscriptions.find({});
    res.status(200).json({
      success: true,
      subscriptions: subscriptions
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Fetch student all Subscriptions */
module.exports.fetchStudentSubscriptions = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array()
    });
  }
  try {
    const subscriptions = await Subscriptions.find({ studentId: req.params.studentId });
    res.status(200).json({
      success: true,
      subscriptions: subscriptions
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Create Subscription for student */
module.exports.createSubscription = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array()
    });
  }
  console.log(req.body)
  try {
    const subscription = new Subscriptions({
      studentId: req.body.studentId,
      subscriptionType: req.body.subscriptionType
    });
    const saveSubscription = await subscription.save();
    res.status(200).json({
      success: true,
      subscription: saveSubscription
    });
  } catch (err) {
    console.log(err);
    if (err) {
      if (err.name == 'ValidationError') {
        for (field in err.errors) {
          res.status(422).send({ success: false, error: err.errors[field].message });
        }
      } else if (err.name == 'MongoError' && err.code == 11000) {
        res.status(422).send({ success: false, error: "Subscription already exist!" });
      } else { res.status(500).json({ success: false, error: err }); }
    }
  }
};

// // Update payment details function
// const paymentFunction = async (subscriptionId, body) => {
//   try {
//     const subscription = await Subscriptions.findById(subscriptionId)
//     if (!subscription._paid) {
//       const endTime = subscription.subscriptionType == 'monthly' ? moment().add(1, 'months') : subscription.subscriptionType == 'quarterly' ? moment().add(3, 'months') : moment().add(1, 'years')
//       const updatedSubscription = await Subscriptions.findByIdAndUpdate(subscriptionId, { _paid: true, paid_timestamp: moment(), end_timestamp: endTime, casheFree: body }, { runValidators: true, new: true })
//       return {
//         success: true,
//         subscription: updatedSubscription
//       };
//     } else {
//       return {
//         success: true,
//         message: "Payment already paid!"
//       };
//     }
//   } catch (error) {
//     console.log(error)
//     throw new Error(error)
//   }
// }

/* Subscription payment */
module.exports.subscriptionPayment = async (req, res, next) => {
  const payment = {
    "orderId": req.params.subscriptionId,
    "orderAmount": 0.00,
    "referenceId": "111111",
    "txStatus": "SUCCESS",
    "paymentMode": "ENTLIN_CARD",
    "txMsg": "Transaction Successful",
    "txTime": moment(),
    "signature": "WwO55FykuzqX8jz8bVvHOFXQR3mCE7ex40bIjN0nc0k="
  }
  try {
    const subscription = await Subscriptions.findById(req.params.subscriptionId)
    if (!subscription._paid) {
      const endTime = subscription.subscriptionType == 'monthly' ? moment().add(1, 'months') : subscription.subscriptionType == 'quarterly' ? moment().add(3, 'months') : moment().add(1, 'years')
      const updatedSubscription = await Subscriptions.findByIdAndUpdate(req.params.subscriptionId, { _paid: true, paid_timestamp: moment(), end_timestamp: endTime, casheFree: payment }, { runValidators: true, new: true })
      res.status(200).send({
        success: true,
        subscription: updatedSubscription
      });
    } else {
      res.status(200).send({
        success: true,
        message: "Payment already paid!"
      });
    }
  } catch (error) {
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
}

// /* Subscription payment callback */
// module.exports.subscriptionPaymentCallback = async (req, res, next) => {
//   console.log("Payment Callback", subscriptionId)
//   console.log("Payment Callback", body)
//   try {
//     const updatedPayment = await paymentFunction(req.params.subscriptionId, req.body)
//     res.status(200).json(updatedPayment);
//   } catch (error) {
//     res.status(501).send({
//       success: false,
//       error: "Internal Server Error!"
//     });
//   }
// }

/* Delete subscription */
module.exports.deleteSubscription = async (req, res, next) => {
  try {
    const deletedSubscription = await Subscriptions.findByIdAndDelete(req.params.subscriptionId)
    res.status(200).send({
      success: true,
      message: "Subscription has been successfully deleted!",
      subscriptionId: deletedSubscription._id
    });
  } catch (error) {
    console.log(error);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
}