const moment = require("moment");
const Videos = require("../../../models/videos");
const {
    check,
    validationResult
} = require("express-validator");
const crypto = require("crypto");

/* Post new video */
module.exports.postVideo = async (req, res, next) => {
    const randomByte = crypto.randomBytes(32).toString("hex")
    try {
        const video = new Videos({
            title: req.body.title,
            tags: req.body.tags,
            description: req.body.description,
            createdBy: req.body.createdBy,
            createrDetails: req.body.createrDetails,
            videoFileName: req.body.prefix + "_" + randomByte + '.mp4',
        })
        const savedVideos = await video.save()
        res.status(200).json({
            success: true,
            video: savedVideos,
            message: "Video Successfully Added!"
        });
    } catch (err) {
        console.log(err);
        if (err) {
            if (err.name == 'ValidationError') {
                for (field in err.errors) {
                    res.status(422).send({ success: false, error: err.errors[field].message });
                }
            } else if (err.name == 'MongoError' && err.code == 11000) {
                res.status(422).send({ success: false, error: "Video already exist!" });
            } else { res.status(500).json({ success: false, error: err }); }
        }
    }
};

/* Update video */
module.exports.updateVideo = async (req, res, next) => {
    try {
        const video = await Videos.findById(req.params.videoId);
        video.title = req.body.title;
        video.description = req.body.description;
        video.createdBy = req.body.createdBy;
        video.createrDetails = req.body.createrDetails;
        const savedVideos = await video.save()
        res.status(200).json({
            success: true,
            video: savedVideos,
            message: "Video Successfully Updated!"
        });
    } catch (err) {
        console.log(err);
        if (err) {
            if (err.name == 'ValidationError') {
                for (field in err.errors) {
                    res.status(422).send({ success: false, error: err.errors[field].message });
                }
            } else if (err.name == 'MongoError' && err.code == 11000) {
                res.status(422).send({ success: false, error: "Video already exist!" });
            } else { res.status(500).json({ success: false, error: err }); }
        }
    }
};

/* Upload video */
module.exports.uploadVideo = async (req, res, next) => {
    try {
        const uploadedVideo = await Videos.findOneAndUpdate({ _id: req.params.videoId }, { $set: { uploaded: true } }, { new: true, fields: { createdAt: 0, updatedAt: 0 } });
        res.status(200).json({
            success: true,
            video: uploadedVideo,
            message: "Video Successfully Uploaded!"
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
            video: unUploadedVideo,
            message: "Video Successfully UnUploaded!"
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
            video: publishedVideo,
            message: "Video Successfully Published!"
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
            video: unPublishedVideo,
            message: "Video Successfully UnPublished!"
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
        const removedVideo = await Videos.findByIdAndDelete(req.params.videoId)
        res.status(200).send({
            success: true,
            videoId: removedVideo._id,
            message: "Video successfully deleted!"
        });
    } catch (error) {
        console.log(error);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
}








