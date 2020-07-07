var express = require("express");
var router = express.Router();
const utility = require("./utility");
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");

/* Fees Related Routes */
router.post("/createFees", validator.createFeesValidator, auth.loginAuth, utility.fees.createFees); //Api to create fees 
router.get("/fetchFees/:feesId", auth.loginAuth, utility.fees.fetchFees); //Api to fetch single fees's detail 
router.get("/deleteFees/:feesId", auth.loginAuth, utility.fees.deleteFees); //Api to delete single fees 
router.get("/paidFees/:feesId", auth.loginAuth, utility.fees.paidFees); //Api to paid fees 
router.get("/fetchAllFees/:borrowerId", auth.loginAuth, utility.fees.fetchAllFees); //Api to fetch single user's fees 

module.exports = router;