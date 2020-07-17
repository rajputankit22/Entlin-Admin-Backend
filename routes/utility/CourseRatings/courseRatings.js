const moment = require("moment");
const CourseRatings = require("../../../models/coursesratings");
const {
    check,
    validationResult
} = require("express-validator");

/* Fetch All Ratings related to one course */
module.exports.fetchCourseRatings = async (req, res, next) => {
    try {
        const courseRatings = await CourseRatings.find({ courseId: req.params.courseId }, { createdAt: 0, updatedAt: 0 });
        res.status(200).json({
            success: true,
            ratings: courseRatings
        });
    } catch (err) {
        console.log(err);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
};

/* Fetch All Ratings */
module.exports.fetchAllCourseRatings = async (req, res, next) => {
    try {
        const courseRatings = await CourseRatings.find({}, { createdAt: 0, updatedAt: 0 });
        res.status(200).json({
            success: true,
            ratings: courseRatings
        });
    } catch (err) {
        console.log(err);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
};

/* Fetch One Rating */
module.exports.fetchCourseRating = async (req, res, next) => {
    try {
        const courseRating = await CourseRatings.findOne({ _id: req.params.ratingId }, { createdAt: 0, updatedAt: 0 });
        res.status(200).json({
            success: true,
            rating: courseRating
        });
    } catch (err) {
        console.log(err);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
};






