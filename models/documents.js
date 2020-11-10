const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const documentSchema = new Schema({
  title: {
    trim: true,
    type: String,
    required: [true, "Title is required"],
    validate(value) {
      if (value.length < 2 || value.length > 100) {
        throw new Error("Title at least 2 and at most 100 characters!");
      }
    }
  },
  description: {
    trim: true,
    type: String,
    required: [true, "Description is required"],
    validate(value) {
      if (value.length < 2 || value.length > 2000) {
        throw new Error("Description at least 2 and at most 2000 characters!");
      }
    }
  },
  uploaded: {
    trim: true,
    type: Boolean,
    default: false,
    required: [true, 'Uploaded is required!']
  },
  publish: {
    trim: true,
    type: Boolean,
    default: false,
    required: [true, 'Public is required!']
  },
  originalFileName: {
    trim: true,
    type: String,
    required: [true, "Document Original File Name is required"],
    validate(value) {
      if (value.length < 1 || value.length > 5000) {
        throw new Error("Document FileName at least 1 and at most 5000 characters!");
      }
    }
  },
  fileName: {
    trim: true,
    type: String,
    unique: [true, "Document Encrypt File Name already registered"],
    required: [true, "Document Encrypt File Name is required"],
    validate(value) {
      if (value.length < 10 || value.length > 5000) {
        throw new Error("Document Encrypt File Name at least 10 and at most 5000 characters!");
      }
    }
  }
},
  {
    timestamps: true
  }
);

const Documents = mongoose.model("Documents", documentSchema);

module.exports = Documents;