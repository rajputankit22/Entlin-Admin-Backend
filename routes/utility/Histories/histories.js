const Histories = require("../../../models/histories");
const { check, validationResult } = require("express-validator");


/* Fetch all task's history */
module.exports.fetchBorrowerHistories = async (req, res, next) => {
    try {
        const histories = await Histories.find({ borrowerId: req.params.borrowerId }, { updatedAt: 0 }).populate({ path: 'borrowerId', select: 'business.name' })
        res.status(200).send({
            success: true,
            histories: histories,
        });
    } catch (error) {
        console.log(error);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
}