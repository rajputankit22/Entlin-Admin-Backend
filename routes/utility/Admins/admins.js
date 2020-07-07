const Employees = require("../../../models/employees");
const { check, validationResult } = require("express-validator");

/* Add new employee */
module.exports.addEmployee = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }
  try {
    const employee = new Employees({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      mobile: req.body.mobile,
      employeeId: req.body.employeeId,
    });
    const savedEmployee = await employee.save();
    res.status(200).send({
      success: true,
      message: "Employee added Successfully!",
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

/* Update employee's profile */
module.exports.updateProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array()
    });
  }
  try {
    const findEmployee = await Employees.findAdminById(req.body._id);
    findEmployee.firstName = req.body.firstName;
    findEmployee.lastName = req.body.lastName;
    findEmployee.email = req.body.email;
    findEmployee.mobile = req.body.mobile;
    findEmployee.employeeId = req.body.employeeId;
    const saveEmployee = await findEmployee.save();
    res.status(200).json({
      success: true,
      admin: saveEmployee.getPublicProfileEmployee()
    });
  } catch (err) {
    console.log(err);
    if (err) {
      if (err.name == 'ValidationError') {
        for (field in err.errors) {
          res.status(422).send({ error: err.errors[field].message });
        }
      } else if (err.name == 'MongoError' && err.code == 11000) {
        res.status(422).send({ success: false, error: "User already exist!" });
      } else { res.status(500).json({ success: false, error: err }); }
    }
  }
};

/* Fetch all employee */
module.exports.fetchEmployees = async (req, res, next) => {
  try {
    const employees = await Employees.find({}, { password: 0, createdAt: 0, updatedAt: 0, refreshToken: 0 });
    res.status(200).json({
      success: true,
      employees: employees
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Fetch employee */
module.exports.fetchEmployee = async (req, res, next) => {
  try {
    const employee = await Employees.findById({ _id: req.params.id }, { password: 0, createdAt: 0, updatedAt: 0 });
    res.status(200).json({
      success: true,
      employees: employee.getPublicProfileEmployee()
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Remove any employee */
module.exports.removeEmployee = async (req, res, next) => {
  try {
    if (req.employee._id == req.params.id) {
      res.status(501).json({
        success: false,
        error: "You can't delete yourself!",
      });
    } else {
      const deletedEmployee = await Employees.deleteOne({ _id: req.params.id });
      res.status(200).json({
        success: true,
        message: "Employee Removed Successfully!",
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

/* Fetch all employees' list */
module.exports.fetchAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employees.find({}, { employeeId: 0, password: 0, departments: 0, ACL: 0, mobile: 0, createdAt: 0, updatedAt: 0, refreshToken: 0 });
    res.status(200).json({
      success: true,
      employees: employees
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};