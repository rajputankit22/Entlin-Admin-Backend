const {
    check,
    validationResult
} = require("express-validator");
const common = require("../Commons/functions")
const Documents = require("../../../models/documents");

/* Post new document */
module.exports.postDocument = async (req, res, next) => {
    try {
        const document = new Documents({
            title: req.body.title,
            description: req.body.description,
            originalFileName: req.body.originalFileName,
            fileName: req.upload
        })
        const savedDocument = await document.save()
        res.status(200).json({
            success: true,
            document: savedDocument,
            message: "Document Successfully Added!"
        });
    } catch (err) {
        common.unlinkFile(req.upload)
        console.log(err);
        if (err) {
            if (err.name == 'ValidationError') {
                for (field in err.errors) {
                    res.status(422).send({ success: false, error: err.errors[field].message });
                }
            } else if (err.name == 'MongoError' && err.code == 11000) {
                res.status(422).send({ success: false, error: "Document already exist!" });
            } else { res.status(500).json({ success: false, error: err }); }
        }
    }
};

/* Update Document */
module.exports.updateDocument = async (req, res, next) => {
    try {
        const document = await Documents.findById(req.params.documentId);
        document.title = req.body.title;
        document.description = req.body.description;
        document.originalFileName = req.body.originalFileName;
        document.fileName = req.upload || document.fileName
        const savedDocument = await document.save()
        res.status(200).json({
            success: true,
            document: savedDocument,
            message: "Document Successfully Updated!"
        });
    } catch (err) {
        console.log(err);
        if (err) {
            if (err.name == 'ValidationError') {
                for (field in err.errors) {
                    res.status(422).send({ success: false, error: err.errors[field].message });
                }
            } else if (err.name == 'MongoError' && err.code == 11000) {
                res.status(422).send({ success: false, error: "Document already exist!" });
            } else { res.status(500).json({ success: false, error: err }); }
        }
    }
};

/* Publish Document */
module.exports.publishDocument = async (req, res, next) => {
    try {
        const publishedDocument = await Documents.findOneAndUpdate({ _id: req.params.documentId }, { $set: { publish: true } }, { new: true, fields: { createdAt: 0, updatedAt: 0 } });
        res.status(200).json({
            success: true,
            document: publishedDocument,
            message: "Document Successfully Published!"
        });
    } catch (err) {
        console.log(err);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
};

/* UnPublish Document */
module.exports.unPublishDocument = async (req, res, next) => {
    try {
        const unPublishedDocument = await Documents.findOneAndUpdate({ _id: req.params.documentId }, { $set: { publish: false } }, { new: true, fields: { createdAt: 0, updatedAt: 0 } });
        res.status(200).json({
            success: true,
            document: unPublishedDocument,
            message: "Document Successfully UnPublished!"
        });
    } catch (err) {
        console.log(err);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
};

/* Fetch All Documents */
module.exports.fetchAllDocuments = async (req, res, next) => {
    try {
        const documents = await Documents.find({}, { createdAt: 0, updatedAt: 0 });
        res.status(200).json({
            success: true,
            documents: documents
        });
    } catch (err) {
        console.log(err);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
};

/* Fetch One document */
module.exports.fetchDocument = async (req, res, next) => {
    try {
        const document = await Documents.findOne({ _id: req.params.documentId }, { createdAt: 0, updatedAt: 0 });
        res.status(200).json({
            success: true,
            document: document
        });
    } catch (err) {
        console.log(err);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
};

/* Delete document */
module.exports.deleteDocument = async (req, res, next) => {
    try {
        const removedDocument = await Documents.findByIdAndDelete(req.params.documentId)
        res.status(200).send({
            success: true,
            documentId: removedDocument._id,
            message: "Document successfully deleted!"
        });
    } catch (error) {
        console.log(error);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
}








