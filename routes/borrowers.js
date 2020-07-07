var express = require("express");
var router = express.Router();
const utility = require("./utility");
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");

/* Borrower Related Routes */
router.get("/fetchBorrower/:id", auth.loginAuth, auth.adminAccessAuth, utility.borrowers.fetchBorrower); // Api fetch one Borrower.
// router.post("/updateProfile", validator.updateBorrowerProfileValidator, auth.loginAuth, auth.adminAccessAuth, utility.borrowers.updateProfile); // Api to update borrower's profile.
router.post("/updateBusinessProfile/:borrowerId", validator.updateBusinessProfileValidator, auth.loginAuth, utility.borrowers.updateBusinessProfile); // Api to update borrower's bussiness profile
router.post("/updateOwnerProfile/:borrowerId", validator.updateOwnerProfileValidator, auth.loginAuth, utility.borrowers.updateOwnerProfile); // Api to update company owner's profile
router.post("/updateBankStatement/:borrowerId", validator.updateBankStatementValidator, auth.loginAuth, utility.borrowers.updateBankStatement); // Api to update borrower's bank statements.
router.post("/updateBalanceSheet/:borrowerId", validator.updateBalanceSheetValidator, auth.loginAuth, utility.borrowers.updateBalanceSheet); // Api to update borrower's balance sheet.
router.post("/updatePnlStatement/:borrowerId", validator.updatePnlStatementValidator, auth.loginAuth, utility.borrowers.updatePnlStatement); // Api to update borrower's pnl statements.
router.post("/updateCapitalAccountStatement/:borrowerId", validator.updateCapitalAccountStatementValidator, auth.loginAuth, utility.borrowers.updateCapitalAccountStatement); // Api to update borrower's capital account statements.
router.post("/updateGstReturn/:borrowerId", validator.updateGstReturnValidator, auth.loginAuth, utility.borrowers.updateGstReturn); // Api to update borrower's gst returns.
router.post("/updateItr/:borrowerId", validator.updateItrValidator, auth.loginAuth, utility.borrowers.updateItr); // Api to update borrower's itr.
router.post("/updateCompanyPan/:borrowerId", validator.updateCompanyPanValidator, auth.loginAuth, utility.borrowers.updateCompanyPan); // Api to update borrower's company pan.
router.post("/updateCompanyAddressProof/:borrowerId", validator.updateCompanyAddressProofValidator, auth.loginAuth, utility.borrowers.updateCompanyAddressProof); // Api to update borrower's company address proof.
router.post("/updateDirectorPan/:borrowerId", validator.updateDirectorPanValidator, auth.loginAuth, utility.borrowers.updateDirectorPan); // Api to update borrower's company Director pan.
router.get("/fetchAllBorrowers", auth.loginAuth, auth.adminAccessAuth, utility.borrowers.fetchAllBorrowers); // Api to fetch all Borrowers.
router.get("/fetchBorrowerDetails/:id", auth.loginAuth, auth.adminAccessAuth, utility.borrowers.fetchBorrowerDetails); // Api fetch one Borrower's deatils with loans.
router.get("/getSignedUrlForFile/:fileName/:originalFileName", auth.loginAuth, utility.borrowers.getSignedUrlForFile); //Api to generate pre singed url for file
router.get("/removeFile/:borrowerId/:type/:fileId/:fileName", auth.loginAuth, utility.borrowers.removeFile); //Api to remove file from borrower's profile.


module.exports = router;