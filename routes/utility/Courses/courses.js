const moment = require("moment");
const Courses = require("../../../models/courses");
const {
    check,
    validationResult
} = require("express-validator");
const crypto = require("crypto");

/* Post new course */
module.exports.postCourse = async (req, res, next) => {
    if (req.body.numberOfVideos != req.body.videosList.length) {
        res.status(500).json({ success: false, error: "Number should be same!" });
    }
    try {
        videosList = [];
        const course = new Courses({
            title: req.body.title,
            description: req.body.description,
            createdBy: req.body.createdBy,
            createrDetails: req.body.createrDetails,
            numberOfVideos: req.body.numberOfVideos,
        })
        req.body.videosList.forEach(element => {
            element.fileName = req.body.prefix + "_" + crypto.randomBytes(32).toString("hex") + '.mp4';
            videosList.push(element)
        });
        course.videosList = videosList;
        const savedCourses = await course.save()
        res.status(200).json({
            success: true,
            course: savedCourses,
            message: "Course Successfully Added!"
        });
    } catch (err) {
        console.log(err);
        if (err) {
            if (err.name == 'ValidationError') {
                for (field in err.errors) {
                    res.status(422).send({ success: false, error: err.errors[field].message });
                }
            } else if (err.name == 'MongoError' && err.code == 11000) {
                res.status(422).send({ success: false, error: "Course already exist!" });
            } else { res.status(500).json({ success: false, error: err }); }
        }
    }
};

/* Upload course */
module.exports.uploadCourse = async (req, res, next) => {
    try {
        const uploadedCourse = await Courses.findOneAndUpdate({ _id: req.params.courseId }, { $set: { uploaded: true } }, { new: true, fields: { createdAt: 0, updatedAt: 0 } });
        res.status(200).json({
            success: true,
            course: uploadedCourse,
            message: "Course Successfully Uploaded!"
        });
    } catch (err) {
        console.log(err);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!",
            message: "Course Successfully Uploaded!"
        });
    }
};

/* unUpload video */
module.exports.unUploadCourse = async (req, res, next) => {
    try {
        const unUploadedCourse = await Courses.findOneAndUpdate({ _id: req.params.courseId }, { $set: { uploaded: false } }, { new: true, fields: { createdAt: 0, updatedAt: 0 } });
        res.status(200).json({
            success: true,
            course: unUploadedCourse,
            message: "Course Successfully Unuploaded!"
        });
    } catch (err) {
        console.log(err);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
};

/* Publish video */
module.exports.publishCourse = async (req, res, next) => {
    try {
        const publishedCourse = await Courses.findOneAndUpdate({ _id: req.params.courseId }, { $set: { publish: true } }, { new: true, fields: { createdAt: 0, updatedAt: 0 } });
        res.status(200).json({
            success: true,
            course: publishedCourse,
            message: "Course Successfully Published!"
        });
    } catch (err) {
        console.log(err);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
};

/* UnPublish course */
module.exports.unPublishCourse = async (req, res, next) => {
    try {
        const unPublishedCourse = await Courses.findOneAndUpdate({ _id: req.params.courseId }, { $set: { publish: false } }, { new: true, fields: { createdAt: 0, updatedAt: 0 } });
        res.status(200).json({
            success: true,
            course: unPublishedCourse,
            message: "Course Successfully UnPublished!"
        });
    } catch (err) {
        console.log(err);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
};

/* Fetch All courses */
module.exports.fetchAllCourses = async (req, res, next) => {
    try {
        const courses = await Courses.find({}, { createdAt: 0, updatedAt: 0 });
        res.status(200).json({
            success: true,
            courses: courses
        });
    } catch (err) {
        console.log(err);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
};

/* Fetch One course */
module.exports.fetchCourse = async (req, res, next) => {
    try {
        const course = await Courses.findOne({ _id: req.params.courseId }, { createdAt: 0, updatedAt: 0 });
        res.status(200).json({
            success: true,
            course: course
        });
    } catch (err) {
        console.log(err);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
};

/* Delete Course */
module.exports.deleteCourse = async (req, res, next) => {
    try {
        const removedCourse = await Courses.findByIdAndDelete(req.params.courseId)
        console.log(removedCourse)
        res.status(200).send({
            success: true,
            courseId: removedCourse._id,
            message: "Course Successfully deleted!"
        });
    } catch (error) {
        console.log(error);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
}








