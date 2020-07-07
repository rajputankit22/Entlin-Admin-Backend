var express = require("express");
var router = express.Router();
const utility = require("./utility");
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");

/* Admin Related Routes */
/* For Admin */
router.post("/addEmployee", validator.addEmployeeValidator, auth.loginAuth, auth.adminAccessAuth, utility.admins.addEmployee); //  Api to add new employee.
router.get("/fetchEmployee/:id", auth.loginAuth, auth.adminAccessAuth, utility.admins.fetchEmployee); // Api fetch one employee.
router.get("/removeEmployee/:id", auth.loginAuth, auth.adminAccessAuth, utility.admins.removeEmployee); // Api to remove employee.
router.post("/updateProfile", validator.updateProfileValidator, auth.loginAuth, auth.adminAccessAuth, utility.admins.updateProfile); // Api to update employee profile.
router.get("/fetchAllEmployees", auth.loginAuth, auth.adminAccessAuth, utility.admins.fetchAllEmployees); // Api to fetch all employees.

module.exports = router;