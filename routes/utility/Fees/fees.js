const Fees = require("../../../models/fees");
const { check, validationResult } = require("express-validator");
const { saveUserHistory } = require("../Commons/functions")
const moment = require("moment");


/* Create fees */
module.exports.createFees = async (req, res, next) => {
    try {
        const fee = new Fees({
            borrowerId: req.body.borrowerId,
            amount: req.body.amount,
            description: req.body.description,
        });
        const savedFee = await fee.save();
        const savedHistory = await saveUserHistory(req.body.borrowerId, req.body.borrowerId, "-", "-", "Fees Created")
        res.status(200).send({
            success: true,
            fee: savedFee,
        });
    } catch (error) {
        console.log(error);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
}

/* Fetch single fees */
module.exports.fetchFees = async (req, res, next) => {
    try {
        const fee = await Fees.findById({ _id: req.params.feesId }, { createdAt: 0, updatedAt: 0 }).populate({ path: 'borrowerId', select: 'business.name' });
        res.status(200).json({
            success: true,
            fee: fee
        });
    } catch (err) {
        console.log(err);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
};

/* Fetch single fees */
module.exports.deleteFees = async (req, res, next) => {
    try {
        const fee = await Fees.deleteOne({ _id: req.params.feesId });
        res.status(200).json({
            success: true,
            fee: fee
        });
    } catch (err) {
        console.log(err);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
};

/* Paid fees */
module.exports.paidFees = async (req, res, next) => {
    try {
        const fee = await Fees.findOneAndUpdate({ _id: req.params.feesId }, { $set: { paidTimestamp: moment(), _paidMark: true } }, { new: true, fields: { createdAt: 0, updatedAt: 0 } }).populate({ path: 'borrowerId', select: 'business.name' });
        const savedHistory = await saveUserHistory(fee.borrowerId, fee.borrowerId, "-", "-", "Paid Fees")
        res.status(200).json({
            success: true,
            fee: fee
        });
    } catch (err) {
        console.log(err);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
};

/* Fetch all fees */
module.exports.fetchAllFees = async (req, res, next) => {
    try {
        const fees = await Fees.find({ borrowerId: req.params.borrowerId }, { emi: 0, createdAt: 0, updatedAt: 0 }).populate({ path: 'borrowerId', select: 'business.name' });
        res.status(200).json({
            success: true,
            fees: fees
        });
    } catch (err) {
        console.log(err);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
};