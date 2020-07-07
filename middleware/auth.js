const jwt = require("jsonwebtoken");
const Users = require("../models/employees");
const Employees = require("../models/employees");
const config = require("../config")
const validator = require("./validator");
const {
  check,
  validationResult
} = require("express-validator");

/* This auth function for login authentication. */
const loginAuth = [validator.jwtTokenValidator, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array()
    });
  }
  try {
    const token = req.header("Authorization").replace("JWT ", "");
    const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET, {
      algorithms: ["HS256"]
    });
    const employee = await Employees.findOne({
      _id: decoded._id
    });
    if (!employee) {
      throw new Error();
    }
    req.token = token;
    req.employee = employee.getPublicProfileEmployee();
    next();
  } catch (error) {
    res.status(403).send({
      success: false,
      error: "Your session has expired!"
    });
  }
}];

/* This auth function for admin access. */
const adminAccessAuth = (req, res, next) => {
  if (req.employee.ACL.adminAccess) {
    next();
  } else {
    res.status(401).json({
      success: false,
      error: "You don't have permission for this action!"
    });
  }
};

module.exports.loginAuth = loginAuth;
module.exports.adminAccessAuth = adminAccessAuth;
