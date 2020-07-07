const Borrowers = require("../../../models/borrowers");
const Loans = require("../../../models/loans");
const { check, validationResult } = require("express-validator");
const { getSignedUrlForFile, removeFile, saveUserHistory, getValues, unlinkFile } = require("../Commons/functions");
const { bankStatement, balanceSheet, pnlStatement, capitalAccountStatement, gstReturn, itr, updateCompanyPan, updateCompanyAddressProof, updateDirectorPan } = require("../Commons/functions");


// /* Update borrowers's profile */
// module.exports.updateProfile = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(422).json({
//       success: false,
//       errors: errors.array()
//     });
//   }
//   try {
//     const findBorrower = await Borrowers.findBorrowerById(req.body._id);
//     findBorrower.applicantFirstName = req.body.applicantFirstName;
//     findBorrower.applicantLastName = req.body.applicantLastName;
//     findBorrower.businessName = req.body.businessName;
//     findBorrower.applicantDesignation = req.body.applicantDesignation;
//     findBorrower.businessOperationalCity = req.body.businessOperationalCity;
//     findBorrower.businessTurnover = req.body.businessTurnover;
//     const saveBorrower = await findBorrower.save();
//     res.status(200).json({
//       success: true,
//       borrower: saveBorrower.getPublicProfileBorrower(),
//       message: "Successfully updated!"
//     });
//   } catch (err) {
//     console.log(err);
//     if (err) {
//       if (err.name == 'ValidationError') {
//         for (field in err.errors) {
//           res.status(422).send({ error: err.errors[field].message });
//         }
//       } else if (err.name == 'MongoError' && err.code == 11000) {
//         res.status(422).send({ success: false, error: "Borrower already exist!" });
//       } else { res.status(500).json({ success: false, error: err }); }
//     }
//   }
// };

/* Update borrowerr's business profile */
module.exports.updateBusinessProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array()
    });
  }
  try {
    const findBorrower = await Borrowers.findBorrowerById(req.params.borrowerId);
    if (findBorrower) {
      findBorrower.applicantFirstName = req.body.applicantFirstName || findBorrower.applicantFirstName
      findBorrower.applicantLastName = req.body.applicantLastName || findBorrower.applicantLastName
      findBorrower.applicantDesignation = req.body.applicantDesignation || findBorrower.applicantDesignation
      findBorrower.officeAddress = { ...req.body.officeAddress, ...findBorrower.officeAddress }
      findBorrower.registeredAddress = { ...req.body.registeredAddress, ...findBorrower.registeredAddress };
      findBorrower.business = { ...req.body.business, ...findBorrower.business };

      const saveBorrower = await findBorrower.save();
      Object.keys(req.body).forEach(async (item) => {
        console.log(item)
        // const oldDescription = (updatedTask[item] == undefined) ? "None" : updatedTask[item]
        let newDescription = await getValues(req.body[item])
        let oldDescription = await getValues(findBorrower[item])
        savedHistory = await saveUserHistory(req.params.borrowerId, req.params.borrowerId, oldDescription, newDescription, item)
        console.log(savedHistory)
      })
      res.status(200).json({
        success: true,
        borrower: saveBorrower.getPublicProfileBorrower()
      });
    } else {
      res.status(400).json({
        success: false,
        error: "Borrower don't exists!"
      });
    }
  } catch (err) {
    console.log(err);
    if (err) {
      if (err.name == 'ValidationError') {
        for (field in err.errors) {
          res.status(422).send({ error: err.errors[field].message });
        }
      } else if (err.name == 'MongoError' && err.code == 11000) {
        res.status(422).send({ success: false, error: "Borrower already exist!" });
      } else { res.status(500).json({ success: false, error: err }); }
    }
  }
};

// /* Fetch business's profile */
// module.exports.fetchBusinessProfile = async (req, res, next) => {
//   try {
//     const findBorrower = await Borrowers.findById(req.borrower._id, { applicantFirstName: 1, applicantLastName: 1, applicantDesignation: 1, officeAddress: 1, registeredAddress: 1, business: 1 });
//     res.status(200).json({
//       success: true,
//       borrower: findBorrower
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(501).send({
//       success: false,
//       error: "Internal Server Error!"
//     });
//   }
// };

/* Update Owner's profile */
module.exports.updateOwnerProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array()
    });
  }
  try {
    const findBorrower = await Borrowers.findBorrowerById(req.params.borrowerId);
    findBorrower.ownerDetails = { ...findBorrower.ownerDetails, ...req.body.ownerDetails };
    findBorrower.ownerAddress = { ...findBorrower.ownerAddress, ...req.body.ownerAddress };
    findBorrower.directors = req.body.directors || findBorrower.directors;
    const saveBorrower = await findBorrower.save();
    Object.keys(req.body).forEach(async (item) => {
      let newDescription = await getValues(req.body[item])
      let oldDescription = await getValues(findBorrower[item])
      savedHistory = await saveUserHistory(req.params.borrowerId, req.params.borrowerId, oldDescription, newDescription, item)
      console.log(savedHistory)
    })
    res.status(200).json({
      success: true,
      borrower: saveBorrower.getPublicProfileBorrower()
    });
  } catch (err) {
    console.log(err);
    if (err) {
      if (err.name == 'ValidationError') {
        for (field in err.errors) {
          res.status(422).send({ error: err.errors[field].message });
        }
      } else if (err.name == 'MongoError' && err.code == 11000) {
        res.status(422).send({ success: false, error: "Borrower already exist!" });
      } else { res.status(500).json({ success: false, error: err }); }
    }
  }
};

/* Update borrower's bank statements */
module.exports.updateBankStatement = [
  bankStatement,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array()
      });
    }
    try {
      console.log(req.bankStatement)
      let type = 'bankStatements'
      let condition = `documents.${type}`
      const findBorrower = await Borrowers.findOneAndUpdate({ _id: req.params.borrowerId }, { $push: { [condition]: req.bankStatement } }, { new: true });
      savedHistory = await saveUserHistory(req.params.borrowerId, req.params.borrowerId, '-', req.bankStatement.originalFilename, 'Add New Bank Statements')
      console.log(savedHistory)
      res.status(200).json({
        success: true,
        borrower: findBorrower.getPublicProfileBorrower()
      });
    } catch (err) {
      console.log(err);
      unlinkFile(req.upload)
      if (err) {
        if (err.name == 'ValidationError') {
          for (field in err.errors) {
            res.status(422).send({ error: err.errors[field].message });
          }
        } else if (err.name == 'MongoError' && err.code == 11000) {
          res.status(422).send({ success: false, error: "Borrower already exist!" });
        } else { res.status(500).json({ success: false, error: err }); }
      }
    }
  }];

/* Update borrower's Balance Sheet */
module.exports.updateBalanceSheet = [
  balanceSheet,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array()
      });
    }
    try {
      console.log(req.balanceSheet)
      let type = 'balanceSheets'
      let condition = `documents.${type}`
      const findBorrower = await Borrowers.findOneAndUpdate({ _id: req.params.borrowerId }, { $push: { [condition]: req.balanceSheet } }, { new: true });
      savedHistory = await saveUserHistory(req.params.borrowerId, req.params.borrowerId, '-', req.balanceSheet.originalFilename, 'Add New Balance Sheet')
      console.log(savedHistory)
      res.status(200).json({
        success: true,
        borrower: findBorrower.getPublicProfileBorrower()
      });
    } catch (err) {
      console.log(err);
      unlinkFile(req.upload);
      if (err) {
        if (err.name == 'ValidationError') {
          for (field in err.errors) {
            res.status(422).send({ error: err.errors[field].message });
          }
        } else if (err.name == 'MongoError' && err.code == 11000) {
          res.status(422).send({ success: false, error: "Borrower already exist!" });
        } else { res.status(500).json({ success: false, error: err }); }
      }
    }
  }];

/* Update borrower's Pnl Statement */
module.exports.updatePnlStatement = [
  pnlStatement,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array()
      });
    }
    try {
      console.log(req.pnlStatement)
      let type = 'pnlStatements'
      let condition = `documents.${type}`
      const findBorrower = await Borrowers.findOneAndUpdate({ _id: req.params.borrowerId }, { $push: { [condition]: req.pnlStatement } }, { new: true });
      savedHistory = await saveUserHistory(req.params.borrowerId, req.params.borrowerId, '-', req.pnlStatement.originalFilename, 'Add New Pnl Statement')
      console.log(savedHistory)
      res.status(200).json({
        success: true,
        borrower: findBorrower.getPublicProfileBorrower()
      });
    } catch (err) {
      console.log(err);
      unlinkFile(req.upload);
      if (err) {
        if (err.name == 'ValidationError') {
          for (field in err.errors) {
            res.status(422).send({ error: err.errors[field].message });
          }
        } else if (err.name == 'MongoError' && err.code == 11000) {
          res.status(422).send({ success: false, error: "Borrower already exist!" });
        } else { res.status(500).json({ success: false, error: err }); }
      }
    }
  }];

/* Update borrower's capital Account Statement */
module.exports.updateCapitalAccountStatement = [
  capitalAccountStatement,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array()
      });
    }
    try {
      console.log(req.capitalAccountStatement)
      let type = 'capitalAccountStatements'
      let condition = `documents.${type}`
      const findBorrower = await Borrowers.findOneAndUpdate({ _id: req.params.borrowerId }, { $push: { [condition]: req.capitalAccountStatement } }, { new: true });
      savedHistory = await saveUserHistory(req.params.borrowerId, req.params.borrowerId, '-', req.capitalAccountStatement.originalFilename, 'Add New Capital Statement')
      console.log(savedHistory)
      res.status(200).json({
        success: true,
        borrower: findBorrower.getPublicProfileBorrower()
      });
    } catch (err) {
      console.log(err);
      unlinkFile(req.upload);
      if (err) {
        if (err.name == 'ValidationError') {
          for (field in err.errors) {
            res.status(422).send({ error: err.errors[field].message });
          }
        } else if (err.name == 'MongoError' && err.code == 11000) {
          res.status(422).send({ success: false, error: "Borrower already exist!" });
        } else { res.status(500).json({ success: false, error: err }); }
      }
    }
  }];

/* Update borrower's GST Return */
module.exports.updateGstReturn = [
  gstReturn,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array()
      });
    }
    try {
      console.log(req.gstReturn)
      let type = 'gstReturns'
      let condition = `documents.${type}`
      const findBorrower = await Borrowers.findOneAndUpdate({ _id: req.params.borrowerId }, { $push: { [condition]: req.gstReturn } }, { new: true });
      savedHistory = await saveUserHistory(req.params.borrowerId, req.params.borrowerId, '-', req.gstReturn.originalFilename, 'Add New Gst Return')
      console.log(savedHistory)
      res.status(200).json({
        success: true,
        borrower: findBorrower.getPublicProfileBorrower()
      });
    } catch (err) {
      console.log(err);
      unlinkFile(req.upload);
      if (err) {
        if (err.name == 'ValidationError') {
          for (field in err.errors) {
            res.status(422).send({ error: err.errors[field].message });
          }
        } else if (err.name == 'MongoError' && err.code == 11000) {
          res.status(422).send({ success: false, error: "Borrower already exist!" });
        } else { res.status(500).json({ success: false, error: err }); }
      }
    }
  }];

/* Update borrower's Itr */
module.exports.updateItr = [
  itr,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array()
      });
    }
    try {
      console.log(req.itr)
      let type = 'itr'
      let condition = `documents.${type}`
      const findBorrower = await Borrowers.findOneAndUpdate({ _id: req.params.borrowerId }, { $push: { [condition]: req.itr } }, { new: true });
      savedHistory = await saveUserHistory(req.params.borrowerId, req.params.borrowerId, '-', req.itr.originalFilename, 'Add New Itr')
      console.log(savedHistory)
      res.status(200).json({
        success: true,
        borrower: findBorrower.getPublicProfileBorrower()
      });
    } catch (err) {
      console.log(err);
      unlinkFile(req.upload);
      if (err) {
        if (err.name == 'ValidationError') {
          for (field in err.errors) {
            res.status(422).send({ error: err.errors[field].message });
          }
        } else if (err.name == 'MongoError' && err.code == 11000) {
          res.status(422).send({ success: false, error: "Borrower already exist!" });
        } else { res.status(500).json({ success: false, error: err }); }
      }
    }
  }];

/* Update borrower's Company Pan */
module.exports.updateCompanyPan = [
  updateCompanyPan,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array()
      });
    }
    try {
      console.log(req.companyPan)
      const findBorrower = await Borrowers.findOneAndUpdate({ _id: req.params.borrowerId }, { $set: { 'documents.companyPan': req.companyPan } }, { new: true });
      savedHistory = await saveUserHistory(req.params.borrowerId, req.params.borrowerId, '-', req.companyPan.originalFilename, 'Update Company Pan')
      console.log(savedHistory)
      res.status(200).json({
        success: true,
        borrower: findBorrower.getPublicProfileBorrower()
      });
    } catch (err) {
      console.log(err);
      unlinkFile(req.upload);
      if (err) {
        if (err.name == 'ValidationError') {
          for (field in err.errors) {
            res.status(422).send({ error: err.errors[field].message });
          }
        } else if (err.name == 'MongoError' && err.code == 11000) {
          res.status(422).send({ success: false, error: "Borrower already exist!" });
        } else { res.status(500).json({ success: false, error: err }); }
      }
    }
  }];

/* Update borrower's Comapny Address proof */
module.exports.updateCompanyAddressProof = [
  updateCompanyAddressProof,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array()
      });
    }
    try {
      console.log(req.companyAddressProof)
      const findBorrower = await Borrowers.findOneAndUpdate({ _id: req.params.borrowerId }, { $set: { 'documents.companyAddressProof': req.companyAddressProof } }, { new: true });
      savedHistory = await saveUserHistory(req.params.borrowerId, req.params.borrowerId, '-', req.companyAddressProof.originalFilename, 'Update Company Address proof')
      console.log(savedHistory)
      res.status(200).json({
        success: true,
        borrower: findBorrower.getPublicProfileBorrower()
      });
    } catch (err) {
      console.log(err);
      unlinkFile(req.upload);
      if (err) {
        if (err.name == 'ValidationError') {
          for (field in err.errors) {
            res.status(422).send({ error: err.errors[field].message });
          }
        } else if (err.name == 'MongoError' && err.code == 11000) {
          res.status(422).send({ success: false, error: "Borrower already exist!" });
        } else { res.status(500).json({ success: false, error: err }); }
      }
    }
  }];

/* Update borrower's company director's pan */
module.exports.updateDirectorPan = [
  updateDirectorPan,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array()
      });
    }
    try {
      console.log(req.directorPan)
      const findBorrower = await Borrowers.findOneAndUpdate({ _id: req.params.borrowerId }, { $set: { 'documents.directorPan': req.directorPan } }, { new: true });
      savedHistory = await saveUserHistory(req.params.borrowerId, req.params.borrowerId, '-', req.directorPan.originalFilename, 'Update Director pan')
      console.log(savedHistory)
      res.status(200).json({
        success: true,
        borrower: findBorrower.getPublicProfileBorrower()
      });
    } catch (err) {
      console.log(err);
      unlinkFile(req.upload);
      if (err) {
        if (err.name == 'ValidationError') {
          for (field in err.errors) {
            res.status(422).send({ error: err.errors[field].message });
          }
        } else if (err.name == 'MongoError' && err.code == 11000) {
          res.status(422).send({ success: false, error: "Borrower already exist!" });
        } else { res.status(500).json({ success: false, error: err }); }
      }
    }
  }];


/* Fetch Borrower through Id */
module.exports.fetchBorrower = async (req, res, next) => {
  try {
    const borrower = await Borrowers.findById({ _id: req.params.id }, { password: 0, createdAt: 0, updatedAt: 0 });
    res.status(200).json({
      success: true,
      borrower: borrower.getPublicProfileBorrower()
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Fetch all Borrowers' list */
module.exports.fetchAllBorrowers = async (req, res, next) => {
  try {
    const borrowers = await Borrowers.find({}, { employeeId: 0, password: 0, departments: 0, ACL: 0, mobile: 0, createdAt: 0, updatedAt: 0, refreshToken: 0 });
    res.status(200).json({
      success: true,
      borrowers: borrowers
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Fetch Borrower's details with loans through Id */
module.exports.fetchBorrowerDetails = async (req, res, next) => {
  try {
    const borrower = await Borrowers.findById({ _id: req.params.id }, { password: 0, createdAt: 0, updatedAt: 0 });
    const loans = await Loans.find({ borrowerId: req.params.id }, { emi: 0, createdAt: 0, updatedAt: 0 }).populate({ path: 'borrowerId', select: 'business.name' });
    res.status(200).json({
      success: true,
      borrower: borrower.getPublicProfileBorrower(),
      loans: loans
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Generate pre singed url for file */
module.exports.getSignedUrlForFile = async (req, res, next) => {
  try {
    let url = await getSignedUrlForFile(req.params.fileName, req.params.originalFileName)
    res.status(200).send({
      success: true,
      url: url
    });
  } catch (error) {
    console.log(error);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
}

/* Remove file from borrower's profile */
module.exports.removeFile = async (req, res, next) => {
  try {
    let type = req.params.type
    let condition = `documents.${type}`
    if (["companyPan", "companyAddressProof", "directorPan"].includes(type)) {
      updatedProfile = await Borrowers.findOneAndUpdate({ _id: req.params.borrowerId }, { $unset: { [condition]: "" } }, { new: true })
    } else {
      let condition = `documents.${type}`
      updatedProfile = await Borrowers.findOneAndUpdate({ _id: req.params.borrowerId }, { $pull: { [condition]: { _id: req.params.fileId } } }, { new: true })
    }
    const savedHistory = await saveUserHistory(req.params.borrowerId, req.params.borrowerId, req.params.type, "-", "Delete File")
    let removedFile = await removeFile(req.params.fileName)
    res.status(200).send({
      success: true,
      message: "File has been successfully removed!",
      updatedProfile: updatedProfile
    });
  } catch (error) {
    console.log(error);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
}