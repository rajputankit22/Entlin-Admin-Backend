const Employees = require("../../../models/employees");
const jwt = require("jsonwebtoken");
const config = require("../../../config")
const { check, validationResult } = require("express-validator");

/* SignIn */
module.exports.signIn = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }
  try {
    const findEmployee = await Employees.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await findEmployee.generateAuthToken();
    const newRefreshToken = await findEmployee.generateRefreshToken();
    let updatedEmployee = await Employees.findByIdAndUpdate(findEmployee._id, { refreshToken: newRefreshToken }, { new: true })
    res.status(200).json({
      success: true,
      employee: updatedEmployee.getPublicProfile(),
      token: token,
    });
  } catch (error) {
    console.log(error.message)
    res.status(401).send({
      error: error.message
    });
  }
};

/* Update Own's Password */
module.exports.updatePassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }
  try {
    const findEmployee = await Employees.findAdminById(req.employee._id);
    const passwordMatch = await findEmployee.comparePassword(req.body.password);
    if (passwordMatch) {
      findEmployee.password = req.body.newPassword;
      const saveEmployee = await findEmployee.save();
      res.status(200).json({
        success: true,
        message: "Password Successfully updated!",
      });
    } else {
      res.status(401).send({
        error: "Invalid current password!"
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error: "Internal Server Error"
    });
  }
};

/* load employee */
module.exports.loadEmployee = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      employee: req.employee,
      message: "Successfully loaded!"
    });
  } catch (error) {
    res.status(401).json({
      error: "Session Expired!"
    });
  }
};

/* SignOut */
module.exports.signOut = async (req, res, next) => {
  try {
    let updatedEmployee = await Employees.findByIdAndUpdate(req.employee._id, { $unset: { refreshToken: "" } }, { new: true })
    if (!updatedEmployee.refreshToken) {
      res.status(200).json({
        success: true,
        message: "Successfully signOut!"
      });
    } else {
      res.status(501).send({
        success: false,
        error: "Internal Server Error!"
      });
    }
  } catch (error) {
    res.status(401).json({
      error: "Session Expired!"
    });
  }
};

/* Update own's profile */
module.exports.updateProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array()
    });
  }
  try {
    const findEmployee = await Employees.findAdminById(req.employee._id);
    findEmployee.firstName = req.body.firstName;
    findEmployee.lastName = req.body.lastName;
    findEmployee.email = req.body.email;
    findEmployee.mobile = req.body.mobile;
    const saveEmployee = await findEmployee.save();
    res.status(200).json({
      success: true,
      employee: saveEmployee.getPublicProfileEmployee(),
      message: "Successfully updated!"
    });
  } catch (err) {
    console.log(err);
    if (err) {
      if (err.name == 'ValidationError') {
        for (field in err.errors) {
          res.status(422).send({ error: err.errors[field].message });
        }
      } else if (err.name == 'MongoError' && err.code == 11000) {
        res.status(422).send({ success: false, error: "Employee already exist!" });
      } else { res.status(500).json({ success: false, error: err }); }
    }
  }
};


/* Get new auth token through refresh token */
module.exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("JWT ", "");
    const refreshToken = await Employees.findOne({
      refreshToken: token
    });
    if (!refreshToken) {
      throw new Error("Refresh token is invalid!");
    }
    const decoded = jwt.verify(token, config.REFRESH_TOKEN_SECRET, {
      algorithms: ["HS256"]
    });
    const employee = await Employees.findOne({
      _id: decoded._id
    });
    const newToken = await employee.generateAuthToken();
    if (!employee) {
      throw new Error("Employee does not exist!");
    }
    res.status(200).send({
      success: true,
      token: newToken
    });
  } catch (error) {
    console.log(error)
    res.status(403).send({
      success: false,
      error: "Your session has expired!"
    });
  }
}