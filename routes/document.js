var express = require("express");
var router = express.Router();
const utility = require("./utility");
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");
const { uploadFile, updateFile } = require("../routes/utility/Commons/functions")

/* Documents Related Routes */
router.post("/postDocument", validator.postDocumentValidator, auth.loginAuth, uploadFile, utility.documents.postDocument); // Api post one document.
router.post("/updateDocument/:documentId", validator.documentIdValidator, validator.updateDocumentValidator, auth.loginAuth, updateFile, utility.documents.updateDocument); // Api to update document.
router.get("/publishDocument/:documentId", validator.documentIdValidator, auth.loginAuth, utility.documents.publishDocument); // Api fetch publish Document.
router.get("/unPublishDocument/:documentId", validator.documentIdValidator, auth.loginAuth, utility.documents.unPublishDocument); // Api fetch unPublish Document.
router.get("/fetchDocument/:documentId", validator.documentIdValidator, auth.loginAuth, utility.documents.fetchDocument); // Api fetch one document.
router.get("/fetchAllDocuments", auth.loginAuth, utility.documents.fetchAllDocuments); // Api fetch all documents.
router.get("/deleteDocument/:documentId", validator.documentIdValidator, auth.loginAuth, utility.documents.deleteDocument); // Api to delete document.


module.exports = router;