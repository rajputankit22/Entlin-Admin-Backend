const Lenders = require("../../../models/lenders");
const { check, validationResult } = require("express-validator");

/* Update Lenders's profile */
module.exports.updateProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array()
    });
  }
  try {
    const findLender = await Lenders.findLenderById(req.body._id);
    findLender.applicantFirstName = req.body.applicantFirstName;
    findLender.applicantLastName = req.body.applicantLastName;
    findLender.businessName = req.body.businessName;
    findLender.applicantDesignation = req.body.applicantDesignation;
    const saveLender = await findLender.save();
    res.status(200).json({
      success: true,
      lender: saveLender.getPublicProfileLender(),
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
        res.status(422).send({ success: false, error: "Lender already exist!" });
      } else { res.status(500).json({ success: false, error: err }); }
    }
  }
};


/* Fetch Lender through Id */
module.exports.fetchLender = async (req, res, next) => {
  try {
    const lender = await Lenders.findById({ _id: req.params.id }, { password: 0, createdAt: 0, updatedAt: 0 });
    res.status(200).json({
      success: true,
      lender: lender.getPublicProfileLender()
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

/* Fetch all Lenders' list */
module.exports.fetchAllLenders = async (req, res, next) => {
  try {
    const employees = await Lenders.find({}, { employeeId: 0, password: 0, departments: 0, ACL: 0, mobile: 0, createdAt: 0, updatedAt: 0, refreshToken: 0 });
    res.status(200).json({
      success: true,
      lender: employees
    });
  } catch (err) {
    console.log(err);
    res.status(501).send({
      success: false,
      error: "Internal Server Error!"
    });
  }
};