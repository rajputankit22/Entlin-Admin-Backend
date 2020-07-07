var express = require("express");
var router = express.Router();
const utility = require("./utility");
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");

/* Loans Related Routes */
router.get("/fetchPendingLoans", auth.loginAuth, utility.loans.fetchPendingLoans); // Api to fetch all pending loans
router.get("/fetchLoan/:loanId", auth.loginAuth, utility.loans.fetchLoan); // Api to fetch single loan
router.get("/rejectLoan/:loanId", auth.loginAuth, utility.loans.rejectLoan); // Api to reject loan on any status.
router.get("/fetchRejectedLoans", auth.loginAuth, utility.loans.fetchRejectedLoans); // Api to fetch rejected loans, which are rejected by FI or Admin.
router.post("/changeTotalIntrest", validator.changeTotalIntrestValidator, auth.loginAuth, utility.loans.changeTotalIntrest); // Api to chnage loan's intrest
router.get("/assignLoan/:loanId/:lenderId", auth.loginAuth, utility.loans.assignLoan); // Api to assign loan to lender
router.get("/fetchAssignedLoans", auth.loginAuth, utility.loans.fetchAssignedLoans); // Api to fetch Assigned loans and Approved loans, which are approved by FI
router.get("/approveLoan/:loanId", auth.loginAuth, utility.loans.approveLoan); // Api to approve loan
router.get("/fetchWaitingForDisbursalLoans", auth.loginAuth, utility.loans.fetchWaitingForDisbursalLoans); // Api to fetch waiting for disbursal loans, which are approved by FI and admin.
// router.get("/fetchFiApprovedLoans", auth.loginAuth, utility.loans.fetchFiApprovedLoans); // Api to fetch Fi approved loans
router.get("/disburseLoan/:loanId", auth.loginAuth, utility.loans.disburseLoan); // Api to disbursed loan
router.get("/fetchDisburesedLoans", auth.loginAuth, utility.loans.fetchDisburesedLoans); // Api to fetch disbursed loans
router.get("/fetchRunningEmis", auth.loginAuth, utility.loans.fetchRunningEmis); // Api to fetch Running Emis
router.post("/paidEmi/:emiId", validator.paidAmountValidator, auth.loginAuth, utility.loans.paidEmi); // Api to paid emi
router.get("/fetchPaidEmis", auth.loginAuth, utility.loans.fetchPaidEmis); // Api to fetch Paid Emis
// router.get("/settledEmi/:emiId", auth.loginAuth, utility.loans.settledEmi); // Api to settled emi
router.get("/completeLoan/:loanId", auth.loginAuth, utility.loans.completeLoan); // Api to complete loan
router.get("/fetchCompletedLoans", auth.loginAuth, utility.loans.fetchCompletedLoans); // Api to fetch completed loans
router.post("/changeGlobalComment", validator.changeCommentValidator, auth.loginAuth, utility.loans.changeGlobalComment); // Api to change global comment
router.post("/changeInternalComment", validator.changeCommentValidator, auth.loginAuth, utility.loans.changeInternalComment); // Api to change internal comment

module.exports = router;