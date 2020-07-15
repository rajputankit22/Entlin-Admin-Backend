const moment = require("moment");
const Videos = require("../../../models/videos");
const {
    check,
    validationResult
} = require("express-validator");
const crypto = require("crypto");

/* Post new video */
module.exports.postVideo = async (req, res, next) => {
    try {
        const video = new Videos({
            title: req.body.title,
            description: req.body.description,
            createdBy: req.body.createdBy,
            createrDetails: req.body.createrDetails,
            videoFileName: req.body.prefix + "_" + crypto.randomBytes(16).toString("hex") + '.mp4',
        })
        const savedVideos = await video.save()
        res.status(200).json({
            success: true,
            video: savedVideos
        });
    } catch (err) {
        console.log(err);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
};

/* Upload video */
module.exports.uploadVideo = async (req, res, next) => {
    try {
        const uploadedVideo = await Videos.findOneAndUpdate({ _id: req.params.videoId }, { $set: { uploaded: true } }, { new: true, fields: { createdAt: 0, updatedAt: 0 } });
        res.status(200).json({
            success: true,
            video: uploadedVideo
        });
    } catch (err) {
        console.log(err);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
};

/* unUpload video */
module.exports.unUploadVideo = async (req, res, next) => {
    try {
        const unUploadedVideo = await Videos.findOneAndUpdate({ _id: req.params.videoId }, { $set: { uploaded: false } }, { new: true, fields: { createdAt: 0, updatedAt: 0 } });
        res.status(200).json({
            success: true,
            video: unUploadedVideo
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
module.exports.publishVideo = async (req, res, next) => {
    try {
        const publishedVideo = await Videos.findOneAndUpdate({ _id: req.params.videoId }, { $set: { publish: true } }, { new: true, fields: { createdAt: 0, updatedAt: 0 } });
        res.status(200).json({
            success: true,
            video: publishedVideo
        });
    } catch (err) {
        console.log(err);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
};

/* UnPublish video */
module.exports.unPublishVideo = async (req, res, next) => {
    try {
        const unPublishedVideo = await Videos.findOneAndUpdate({ _id: req.params.videoId }, { $set: { publish: false } }, { new: true, fields: { createdAt: 0, updatedAt: 0 } });
        res.status(200).json({
            success: true,
            video: unPublishedVideo
        });
    } catch (err) {
        console.log(err);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
};

/* Fetch All videos */
module.exports.fetchAllVideos = async (req, res, next) => {
    try {
        const videos = await Videos.find({}, { createdAt: 0, updatedAt: 0 });
        res.status(200).json({
            success: true,
            videos: videos
        });
    } catch (err) {
        console.log(err);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
};

/* Fetch One video */
module.exports.fetchVideo = async (req, res, next) => {
    try {
        const video = await Videos.findOne({ _id: req.params.videoId }, { createdAt: 0, updatedAt: 0 });
        res.status(200).json({
            success: true,
            video: video
        });
    } catch (err) {
        console.log(err);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
};

/* Delete question */
module.exports.deleteVideo = async (req, res, next) => {
    try {
        const removedVideo = await Videos.deleteOne({ _id: req.params.videoId })
        console.log(removedVideo)
        res.status(200).send({
            success: true,
            message: "Video has been successfully deleted!"
        });
    } catch (error) {
        console.log(error);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
}

/* Modify question */
module.exports.modifyQuestion = async (req, res, next) => {
    try {
        let findQuestion = await Questions.findById(req.body.questionId);
        if (findQuestion && (req.student._id.toString() == findQuestion.studentId.toString())) {
            findQuestion.tags = req.body.tags;
            findQuestion.title = req.body.title;
            findQuestion.detail = req.body.detail;
            const savedQuestion = await findQuestion.save()
            res.status(200).json({
                success: true,
                question: savedQuestion
            });
        } else {
            res.status(400).send({
                success: false,
                error: "You can modify only which are created by you!"
            });
        }
    } catch (err) {
        console.log(err);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
};

/* UpVote question */
module.exports.upVoteQuestion = async (req, res, next) => {
    try {
        let updatedQuestion = await Questions.update({ _id: req.params.questionId }, { $inc: { votes: 1 } });
        res.status(200).json({
            success: true,
            question: updatedQuestion
        });
    } catch (err) {
        console.log(err);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
};

/* UpVote question */
module.exports.downVoteQuestion = async (req, res, next) => {
    try {
        let updatedQuestion = await Questions.update({ _id: req.params.questionId }, { $inc: { votes: -1 } });
        res.status(200).json({
            success: true,
            question: updatedQuestion
        });
    } catch (err) {
        console.log(err);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
};

/* Delete question */
module.exports.deleteQuestion = async (req, res, next) => {
    try {
        const findQuestion = await Questions.findOne({ _id: req.params.questionId })
        console.log(findQuestion)
        if (findQuestion && (req.student._id.toString() == findQuestion.studentId.toString())) {
            const removedQuestion = await Questions.deleteOne({ _id: req.params.questionId, studentId: req.student._id })
            console.log(removedQuestion)
            res.status(200).send({
                success: true,
                message: "Question has been successfully deleted!"
            });
        } else {
            res.status(400).send({
                success: false,
                error: "You can delete only which are created by you!"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
}

/* Fetch single Question */
module.exports.fetchQuestion = async (req, res, next) => {
    try {
        const question = await Questions.findById(req.params.questionId, { createdAt: 0, updatedAt: 0 });
        res.status(200).json({
            success: true,
            question: question
        });
    } catch (err) {
        console.log(err);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
};

/* Fetch All Questions */
module.exports.fetchAllQuestions = async (req, res, next) => {
    try {
        const questions = await Questions.find({}, { createdAt: 0, updatedAt: 0 });
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

/* Fetch All Questions */
module.exports.fetchOwnQuestions = async (req, res, next) => {
    try {
        const questions = await Questions.find({ studentId: req.student._id }, { createdAt: 0, updatedAt: 0 });
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
        const findQuestion = await Questions.findOne({ _id: req.params.questionId })
        if (findQuestion && (req.student._id.toString() == findQuestion.studentId.toString())) {
            const closedQuestion = await Questions.findOneAndUpdate({ _id: req.params.questionId }, { $set: { status: 'close' } }, { new: true, fields: { createdAt: 0, updatedAt: 0 } });
            res.status(200).json({
                success: true,
                question: closedQuestion
            });
        } else {
            res.status(400).send({
                success: false,
                error: "You can close only which are created by you!"
            });
        }

    } catch (err) {
        console.log(err);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
};


