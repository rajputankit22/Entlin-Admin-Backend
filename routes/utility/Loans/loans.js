const Mongoose = require('mongoose');
const ObjectId = Mongoose.Types.ObjectId;
const moment = require("moment");
const Loans = require("../../../models/loans");
const Lenders = require("../../../models/lenders");
const {
  check,
  validationResult
} = require("express-validator");
const config = require("../../../config")
const { roundOf, saveLoanHistory, getInterestAmountTerm, getDayViseInterestAmount, checkBusinessProfile, checkOwnerProfile, checkDocumntProfile } = require("../Commons/functions")


/* Fetch all pending loans */
module.exports.fetchPendingLoans = async (req, res, next) => {
  try {
    const pendingLoans = await Loans.find({ "status": "Pending" }, { emi: 0, createdAt: 0, updatedAt: 0 }).populate({ path: 'borrowerId', select: 'business.name' });
    res.status(200).json({
      success: true,
      pendingLoans: pendingLoans
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Fetch single loan */
module.exports.fetchLoan = async (req, res, next) => {
  try {
    const loan = await Loans.findById(req.params.loanId, { createdAt: 0, updatedAt: 0 }).populate({ path: 'borrowerId', select: 'business.name' });
    res.status(200).json({
      success: true,
      loan: loan
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Reject loan, which is neither disbursed nor Complete. */
module.exports.rejectLoan = async (req, res, next) => {
  try {
    let loan = await Loans.findOne({ _id: req.params.loanId, status: { $nin: ["Disbursed", "Completed", "RejectedByAdmin", "RejectedByFI"] } }, { createdAt: 0, updatedAt: 0 });
    if (loan) {
      loan.RejectedByAdminTimestamp = moment()
      loan.status = "RejectedByAdmin"
      const rejectedLoan = await loan.save()
      savedHistory = await saveLoanHistory(rejectedLoan.borrowerId, rejectedLoan._id, "-", "-", "Reject by Admin")
      res.status(200).json({
        success: true,
        rejectedLoan: rejectedLoan
      });
    } else {
      res.status(400).send({
        success: false,
        error: "Loan isn't exist in reject position!"
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

/* Fetch Rejected loans, which are rejected by FI or Admin. */
module.exports.fetchRejectedLoans = async (req, res, next) => {
  try {
    const rejectedLoans = await Loans.find({ $or: [{ status: "RejectedByAdmin" }, { status: "RejectedByFI" }] }, { emi: 0, createdAt: 0, updatedAt: 0 });
    res.status(200).json({
      success: true,
      rejectedLoans: rejectedLoans
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Change loan intrest */
module.exports.changeTotalIntrest = async (req, res, next) => {
  try {
    let loan = await Loans.findById(req.body.loanId)
    const newIntrestRate = roundOf(req.body.intrestRate)
    const totalInterestAmount = roundOf(getInterestAmountTerm(loan.principal, newIntrestRate, loan.emiCount));

    loan.totalInterestRate = newIntrestRate
    loan.totalInterestAmount = totalInterestAmount
    loan.companyInterestRate = roundOf(newIntrestRate - loan.lenderInterestRate)
    loan.lenderInterestAmount = roundOf(getInterestAmountTerm(loan.principal, loan.lenderInterestRate, loan.emiCount));;
    loan.companyInterestAmount = roundOf(totalInterestAmount - loan.lenderInterestAmount);
    loan.disbursedAmount = roundOf(loan.principal - totalInterestAmount);
    const updatedLoan = await loan.save()
    savedHistory = await saveLoanHistory(updatedLoan.borrowerId, updatedLoan._id, loan.totalInterestRate, newIntrestRate, "Changed Interest")
    res.status(200).json({
      success: true,
      loan: updatedLoan
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};


/* Assign loan to lender */
module.exports.assignLoan = async (req, res, next) => {
  try {
    let lender = await Lenders.findById(req.params.lenderId)
    const lenderInterestRate = (lender.lenderInterestRate) ? roundOf(lender.lenderInterestRate) : roundOf(config.LENDER_INTEREST); // Calculate lender intrest rate.
    let loan = await Loans.findOne({ _id: req.params.loanId, "status": "Pending" }, { emi: 0, createdAt: 0, updatedAt: 0 })
    if (loan) {
      const lenderInterestAmount = roundOf(getInterestAmountTerm(loan.principal, lenderInterestRate, loan.emiCount));  // Calculate lender intrest amount.
      loan.lenderInterestRate = lenderInterestRate;
      loan.lenderInterestAmount = (loan.loanType == "CreditLine") ? roundOf(0) : lenderInterestAmount;
      loan.companyInterestRate = roundOf(loan.totalInterestRate - lenderInterestRate)
      loan.companyInterestAmount = (loan.loanType == "CreditLine") ? roundOf(0) : roundOf(loan.totalInterestAmount - lenderInterestAmount);
      loan.status = "Assigned"
      loan.AssignedTimestamp = moment()
      loan.lenderId = lender._id
      const assignedLoan = await loan.save()
      savedHistory = await saveLoanHistory(assignedLoan.borrowerId, assignedLoan._id, '-', lender.businessName, "Assigned Loan to Lender")
      res.status(200).json({
        success: true,
        assignedLoan: assignedLoan
      });
    } else {
      res.status(400).send({
        success: false,
        error: "Loan isn't exist in pending!"
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

/* Fetch Assigned loans and Approved loans, which are approved by FI  */
module.exports.fetchAssignedLoans = async (req, res, next) => {
  try {
    const approvedLoans = await Loans.find({ $or: [{ status: "Assigned" }, { "status": "ApprovedByFI" }] }, { emi: 0, createdAt: 0, updatedAt: 0 }).populate({ path: 'borrowerId', select: 'business.name' }).populate({ path: 'lenderId', select: 'businessName' });
    res.status(200).json({
      success: true,
      approvedLoans: approvedLoans
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

// /* Fetch Fi Approved loans */
// module.exports.fetchFiApprovedLoans = async (req, res, next) => {
//   try {
//     const fiApprovedLoans = await Loans.find({ status: "ApprovedByFI" }, { emi: 0, createdAt: 0, updatedAt: 0 }).populate({ path: 'borrowerId', select: 'business.name fiCreditLimit' }).populate({ path: 'lenderId', select: 'businessName' });
//     res.status(200).json({
//       success: true,
//       fiApprovedLoans: fiApprovedLoans
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(501).send({
//       success: false,
//       error: "Internal Server Error!"
//     });
//   }
// };

/* Approve loan */
module.exports.approveLoan = async (req, res, next) => {
  try {
    let loan = await Loans.findOne({ _id: req.params.loanId, status: "ApprovedByFI" }, { createdAt: 0, updatedAt: 0 });
    if (loan) {
      loan.ApprovedByAdminTimestamp = moment()
      loan.status = "ApprovedByAdmin"
      const approvedLoan = await loan.save()
      savedHistory = await saveLoanHistory(approvedLoan.borrowerId, approvedLoan._id, "-", "-", "Approved by Admin")
      res.status(200).json({
        success: true,
        approvedLoan: approvedLoan
      });
    } else {
      res.status(400).send({
        success: false,
        error: "Loan isn't exist in FI's Approved!"
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

/* Fetch waiting for disbursal loans which are approved via admin and Fi also */
module.exports.fetchWaitingForDisbursalLoans = async (req, res, next) => {
  try {
    const approvedLoans = await Loans.find({ status: "ApprovedByAdmin" }, { emi: 0, createdAt: 0, updatedAt: 0 });
    res.status(200).json({
      success: true,
      approvedLoans: approvedLoans
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Disburse loan */
module.exports.disburseLoan = async (req, res, next) => {
  try {
    let emiList = []
    let loan = await Loans.findById(req.params.loanId, { createdAt: 0, updatedAt: 0 });
    const time = loan.emiCount;

    for (let index = 1; index <= time; index++) {
      let emiObject = {};
      emiObject.totalRepaymentAmount = roundOf(loan.totalRepaymentAmount / time);
      emiObject.dueDate = (loan.loanType == "CreditLine") ? moment().add(config.CREDIT_LINE_DAYS, "days") : moment().add(index, "months").format(`YYYY-MM-${loan.repaymentDay}`);
      emiObject.status = "Pending"
      emiList.push(emiObject)
    }
    loan.disbursedTimestamp = moment();
    loan.status = "Disbursed";
    loan.emi = emiList
    const disbursedLoan = await loan.save()
    savedHistory = await saveLoanHistory(disbursedLoan.borrowerId, disbursedLoan._id, '-', '-', "Disbursed Loan")
    res.status(200).json({
      success: true,
      disbursedLoan: disbursedLoan
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};


/* Fetch Disburesed loans */
module.exports.fetchDisburesedLoans = async (req, res, next) => {
  try {
    const disbursedLoans = await Loans.find({ status: "Disbursed" }, { emi: 0, createdAt: 0, updatedAt: 0 }).populate({ path: 'borrowerId', select: 'business.name fiCreditLimit' }).populate({ path: 'lenderId', select: 'businessName' });
    res.status(200).json({
      success: true,
      disbursedLoans: disbursedLoans
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Fetch Running Emis */
module.exports.fetchRunningEmis = async (req, res, next) => {
  const aggregate = [
    {
      $match: {
        "status": "Disbursed"
      }
    },
    {
      $unwind: '$emi'
    },
    {
      $match: {
        "emi.status": "Pending"
      }
    },
    {
      $lookup: {
        from: "borrowers",
        localField: "borrowerId",
        foreignField: "_id",
        as: "borrower"
      }
    },
    {
      $lookup: {
        from: "lenders",
        localField: "lenderId",
        foreignField: "_id",
        as: "lender"
      }
    },
    {
      "$project": {
        "borrower": { $arrayElemAt: ["$borrower.business.name", 0] },
        "lender": { $arrayElemAt: ["$lender.businessName", 0] },
        "emi": 1,
        "totalInterestRate": 1,
        "totalInterestAmount": 1,
        "lenderInterestRate": 1,
        "companyInterestRate": 1,
        "emiCount": 1,
        "borrowerId": 1,
        "lenderId": 1,
        "principal": 1,
        "totalRepaymentAmount": 1,
        "lenderInterestAmount": 1,
        "companyInterestAmount": 1,
        "disbursedTimestamp": 1,
        "status": 1,
        "loanType": 1,
        "appliedTimestamp": 1,
      }
    }
  ]
  try {
    const runningEmis = await Loans.aggregate(aggregate)
    let updatedRunningEmis = runningEmis.map((Emi) => {
      const todayDate = moment().tz("Asia/Kolkata").startOf('day');                                     // Todays date
      const dueDate = moment(Emi.emi.dueDate).tz("Asia/Kolkata").startOf('day');                        // Due date
      const disbursedDate = moment(Emi.disbursedTimestamp).tz("Asia/Kolkata").startOf('day');           // Disbursed Date
      const delayDays = todayDate.diff(dueDate, 'days');
      if (Emi.loanType == "CreditLine") {
        const totalDays = todayDate.diff(disbursedDate, 'days');
        const totalRepaymentAmount = getDayViseInterestAmount(Emi.principal, Emi.totalInterestRate, totalDays) + Emi.principal
        if (delayDays > 0) {
          const extensionCharge = getDayViseInterestAmount(Emi.principal, Emi.totalInterestRate, delayDays)
          return {
            ...Emi, totalRepaymentAmount: roundOf(totalRepaymentAmount), emi: { ...Emi.emi, totalRepaymentAmount: roundOf(totalRepaymentAmount), extensionCharge: roundOf(extensionCharge) }
          }
        } else {
          return {
            ...Emi, totalRepaymentAmount: roundOf(totalRepaymentAmount), emi: { ...Emi.emi, totalRepaymentAmount: roundOf(totalRepaymentAmount) }
          }
        }
      } else {
        if (delayDays > 0) {
          const extensionCharge = getDayViseInterestAmount(Emi.principal, Emi.totalInterestRate, delayDays)
          return {
            ...Emi, emi: { ...Emi.emi, extensionCharge: extensionCharge }
          }
        } else {
          return Emi
        }
      }
    })
    res.status(200).json({
      success: true,
      runningEmis: updatedRunningEmis
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Paid loan's Emi */
module.exports.paidEmi = async (req, res, next) => {
  try {
    let paidEmi = '';
    let loan = await Loans.findOne({ 'emi._id': req.params.emiId })
    const todayDate = moment().tz("Asia/Kolkata").startOf('day');                                     // Todays date
    const dueDate = moment(loan.dueDate).tz("Asia/Kolkata").startOf('day');                        // Due date
    const disbursedDate = moment(loan.disbursedTimestamp).tz("Asia/Kolkata").startOf('day');           // Disbursed Date
    const delayDays = todayDate.diff(dueDate, 'days');
    if (loan.loanType == "CreditLine") {
      const totalDays = todayDate.diff(disbursedDate, 'days');
      let totalRepaymentAmount = getDayViseInterestAmount(loan.principal, loan.totalInterestRate, totalDays) + loan.principal
      if (delayDays > 0) {
        const extensionCharge = getDayViseInterestAmount(loan.principal, loan.totalInterestRate, delayDays)
        paidEmi = await Loans.findOneAndUpdate({ 'emi._id': req.params.emiId }, { $set: { "emi.$.paidDate": moment(), "emi.$.status": "Paid", "emi.$.paidAmount": req.body.paidAmount, "emi.$.extensionCharge": roundOf(extensionCharge), "emi.$.totalRepaymentAmount": roundOf(totalRepaymentAmount) } }, { new: true, fields: { createdAt: 0, updatedAt: 0 } });
      } else {
        paidEmi = await Loans.findOneAndUpdate({ 'emi._id': req.params.emiId }, { $set: { "emi.$.paidDate": moment(), "emi.$.status": "Paid", "emi.$.paidAmount": req.body.paidAmount, "emi.$.totalRepaymentAmount": roundOf(totalRepaymentAmount) } }, { new: true, fields: { createdAt: 0, updatedAt: 0 } });
      }
    } else {
      if (delayDays > 0) {
        const extensionCharge = getDayViseInterestAmount(loan.principal, loan.totalInterestRate, delayDays)
        paidEmi = await Loans.findOneAndUpdate({ 'emi._id': req.params.emiId }, { $set: { "emi.$.paidDate": moment(), "emi.$.status": "Paid", "emi.$.paidAmount": req.body.paidAmount, "emi.$.extensionCharge": roundOf(extensionCharge), } }, { new: true, fields: { createdAt: 0, updatedAt: 0 } });
      } else {
        paidEmi = await Loans.findOneAndUpdate({ 'emi._id': req.params.emiId }, { $set: { "emi.$.paidDate": moment(), "emi.$.status": "Paid", "emi.$.paidAmount": req.body.paidAmount } }, { new: true, fields: { createdAt: 0, updatedAt: 0 } });
      }
    }
    savedHistory = await saveLoanHistory(paidEmi.borrowerId, paidEmi._id, '-', '-', "Paid Emi")
    res.status(200).json({
      success: true,
      paidEmi: paidEmi
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Fetch Paid Emis */
module.exports.fetchPaidEmis = async (req, res, next) => {
  const aggregate = [
    {
      $match: {
        "status": "Disbursed"
      }
    },
    {
      $unwind: '$emi'
    },
    {
      $match: {
        "emi.status": "Paid"
      }
    },
    {
      $lookup: {
        from: "borrowers",
        localField: "borrowerId",
        foreignField: "_id",
        as: "borrower"
      }
    },
    {
      $lookup: {
        from: "lenders",
        localField: "lenderId",
        foreignField: "_id",
        as: "lender"
      }
    },
    {
      "$project": {
        "borrower": { $arrayElemAt: ["$borrower.business.name", 0] },
        "lender": { $arrayElemAt: ["$lender.businessName", 0] },
        "emi": 1,
        "totalInterestRate": 1,
        "totalInterestAmount": 1,
        "lenderInterestRate": 1,
        "companyInterestRate": 1,
        "emiCount": 1,
        "borrowerId": 1,
        "lenderId": 1,
        "principal": 1,
        "totalRepaymentAmount": 1,
        "lenderInterestAmount": 1,
        "companyInterestAmount": 1,
        "status": 1,
        "loanType": 1,
        "appliedTimestamp": 1,
      }
    }
  ]
  try {
    const paidEmis = await Loans.aggregate(aggregate)
    res.status(200).json({
      success: true,
      runningEmis: paidEmis
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

// /* Settled loan's Emi */
// module.exports.settledEmi = async (req, res, next) => {
//   const aggregate = [
//     {
//       "$facet": {
//         "Total": [
//           {
//             $match: {
//               'emi._id': ObjectId(req.params.emiId)
//             }
//           },
//           {
//             $unwind: '$emi'
//           },
//           { "$count": "Total" },
//         ],
//         "Settled": [
//           {
//             $match: {
//               'emi._id': ObjectId(req.params.emiId)
//             }
//           },
//           {
//             $unwind: '$emi'
//           },
//           {
//             $match: { 'emi.status': "Settled" }
//           },
//           { "$count": "Settled" },
//         ]
//       }
//     },
//     {
//       "$project": {
//         "Total": { "$arrayElemAt": ["$Total.Total", 0] },
//         "Settled": { "$arrayElemAt": ["$Settled.Settled", 0] },
//       }
//     }
//   ]

//   try {
//     let settledEmi = await Loans.findOneAndUpdate({ 'emi._id': req.params.emiId }, { $set: { "emi.$.settledDate": moment(), "emi.$.status": "Settled" } }, { new: true, fields: { createdAt: 0, updatedAt: 0 } });
//     console.log(settledEmi)
//     const loan = await Loans.aggregate(aggregate)
//     console.log(loan)
//     console.log(loan[0].Total)
//     console.log(loan[0].Settled)
//     if (loan[0].Total == loan[0].Settled) {
//       settledEmi = await Loans.findOneAndUpdate({ 'emi._id': req.params.emiId }, { $set: { "completedTimestamp": moment(), "status": "Completed" } }, { new: true, fields: { createdAt: 0, updatedAt: 0 } });
//     }
//     res.status(200).json({
//       success: true,
//       loan: settledEmi
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(501).send({
//       success: false,
//       error: "Internal Server Error!"
//     });
//   }
// };

/* Complete Loan */
module.exports.completeLoan = async (req, res, next) => {
  try {
    completedLoan = await Loans.findOneAndUpdate({ _id: req.params.loanId }, { $set: { "completedTimestamp": moment(), "status": "Completed" } }, { new: true, fields: { createdAt: 0, updatedAt: 0 } });
    savedHistory = await saveLoanHistory(completedLoan.borrowerId, completedLoan._id, '-', '-', "Completed Loan")
    res.status(200).json({
      success: true,
      completedLoan: completedLoan
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Fetch Completed loans */
module.exports.fetchCompletedLoans = async (req, res, next) => {
  try {
    const completedLoans = await Loans.find({ status: "Completed" }, { emi: 0, createdAt: 0, updatedAt: 0 }).populate({ path: 'borrowerId', select: 'business.name fiCreditLimit' }).populate({ path: 'lenderId', select: 'businessName' });
    res.status(200).json({
      success: true,
      completedLoans: completedLoans
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Change loan's Global comment */
module.exports.changeGlobalComment = async (req, res, next) => {
  try {
    const updatedLoan = await Loans.findOneAndUpdate({ _id: req.body.loanId }, { $set: { globalComment: req.body.comment } }, { new: true, fields: { emi: 0, createdAt: 0, updatedAt: 0 } });
    res.status(200).json({
      success: true,
      updatedLoan: updatedLoan
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Change loan's Internal comment */
module.exports.changeInternalComment = async (req, res, next) => {
  try {
    const updatedLoan = await Loans.findOneAndUpdate({ _id: req.body.loanId }, { $set: { internalComment: req.body.comment } }, { new: true, fields: { emi: 0, createdAt: 0, updatedAt: 0 } });
    res.status(200).json({
      success: true,
      updatedLoan: updatedLoan
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};