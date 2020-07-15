var express = require("express");
var router = express.Router();
const utility = require("./utility");
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");

/* Videos Related Routes */
router.post("/postVideo", validator.postVideoValidator, auth.loginAuth, utility.videos.postVideo); // Api post one video.
router.get("/uploadVideo/:videoId", auth.loginAuth, utility.videos.uploadVideo); // Api upload video.
router.get("/unUploadVideo/:videoId", auth.loginAuth, utility.videos.unUploadVideo); // Api unUpload video.
router.get("/publishVideo/:videoId", auth.loginAuth, utility.videos.publishVideo); // Api fetch publish video.
router.get("/unPublishVideo/:videoId", auth.loginAuth, utility.videos.unPublishVideo); // Api fetch unPublish video.
router.get("/fetchVideo/:videoId", auth.loginAuth, utility.videos.fetchVideo); // Api fetch one video.
router.get("/fetchAllVideos", auth.loginAuth, utility.videos.fetchAllVideos); // Api fetch all videos.
router.get("/deleteVideo/:videoId", auth.loginAuth, utility.videos.deleteVideo); // Api to delete video.


module.exports = router;