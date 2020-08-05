var express = require("express");
var router = express.Router();
const utility = require("./utility");
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");

/* Videos Related Routes */
router.post("/postVideo", validator.postVideoValidator, auth.loginAuth, utility.videos.postVideo); // Api post one video.
router.post("/updateVideo/:videoId", validator.videoIdValidator, validator.updateVideoValidator, auth.loginAuth, utility.videos.updateVideo); // Api to update video.
router.get("/uploadVideo/:videoId", validator.videoIdValidator, auth.loginAuth, utility.videos.uploadVideo); // Api upload video.
router.get("/unUploadVideo/:videoId", validator.videoIdValidator, auth.loginAuth, utility.videos.unUploadVideo); // Api unUpload video.
router.get("/publishVideo/:videoId", validator.videoIdValidator, auth.loginAuth, utility.videos.publishVideo); // Api fetch publish video.
router.get("/unPublishVideo/:videoId", validator.videoIdValidator, auth.loginAuth, utility.videos.unPublishVideo); // Api fetch unPublish video.
router.get("/fetchVideo/:videoId", validator.videoIdValidator, auth.loginAuth, utility.videos.fetchVideo); // Api fetch one video.
router.get("/fetchAllVideos", auth.loginAuth, utility.videos.fetchAllVideos); // Api fetch all videos.
router.get("/deleteVideo/:videoId", validator.videoIdValidator, auth.loginAuth, utility.videos.deleteVideo); // Api to delete video.


module.exports = router;