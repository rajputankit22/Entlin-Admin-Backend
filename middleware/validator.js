const {
    check,
    header,
    validationResult
} = require('express-validator');

/* Signin related validation */
module.exports.signInValidator = [
    check("email").isEmail().withMessage("Email is invalid!"),
    check("password").isLength({ min: 6 }).withMessage("Password is invalid!")
]

/* Add employee related validation */
module.exports.addEmployeeValidator = [
    check("firstName").isAlpha().withMessage("First name is invalid!"),
    check("lastName").isAlpha().withMessage("Last name is invalid!"),
    check("email").isEmail().withMessage("Email is invalid!"),
    check("password").isLength({ min: 6 }).withMessage("Password is invalid!"),
    check("mobile").isMobilePhone().isLength({ min: 10, max: 10 }).withMessage("Mobile is invalid!"),
    check("employeeId").isLength({ min: 3, max: 3 }).withMessage("Employee Id is invalid!"),
]

/* Post Video Validator */
module.exports.postVideoValidator = [
    check("title").not().isEmpty().withMessage("Title is required!").isLength({ min: 2, max: 100 }).withMessage("Title should be at least 2 and at most 100 characters!"),
    check("description").not().isEmpty().withMessage("Description is required!").isLength({ min: 2, max: 2000 }).withMessage("Description should be at least 2 and at most 2000 characters!"),
    check("createdBy").not().isEmpty().withMessage("Name is required!").isLength({ min: 2, max: 100 }).withMessage("Creator Name should be at least 2 and at most 100 characters!"),
    check("createrDetails").not().isEmpty().withMessage("Creater Details is required!").isLength({ min: 2, max: 2000 }).withMessage("Creater Details should be at least 2 and at most 2000 characters!"),
    check("prefix").not().isEmpty().withMessage("prefix is required!").isLength({ min: 1, max: 100 }).withMessage("prefix should be at least 1 and at most 100 characters!"),
    check("tags").optional().isArray().withMessage("Tag should be in array formate!"),
]

/* Update Video Validator */
module.exports.updateVideoValidator = [
    check("title").not().isEmpty().withMessage("Title is required!").isLength({ min: 2, max: 100 }).withMessage("Title should be at least 2 and at most 100 characters!"),
    check("description").not().isEmpty().withMessage("Description is required!").isLength({ min: 2, max: 2000 }).withMessage("Description should be at least 2 and at most 2000 characters!"),
    check("createdBy").not().isEmpty().withMessage("Name is required!").isLength({ min: 2, max: 100 }).withMessage("Creator Name should be at least 2 and at most 100 characters!"),
    check("createrDetails").not().isEmpty().withMessage("Creater Details is required!").isLength({ min: 10, max: 2000 }).withMessage("Creater Details should be at least 2 and at most 2000 characters!"),
]

/* Post Video Validator */
module.exports.postCourseValidator = [
    check("title").not().isEmpty().withMessage("Title is required!").isLength({ min: 2, max: 100 }).withMessage("Title should be at least 2 and at most 100 characters!"),
    check("description").not().isEmpty().withMessage("Description is required!").isLength({ min: 2, max: 2000 }).withMessage("Description should be at least 2 and at most 100 characters!"),
    check("createdBy").not().isEmpty().withMessage("Name is required!").isLength({ min: 2, max: 100 }).withMessage("Creator Name should be at least 2 and at most 100 characters!"),
    check("createrDetails").not().isEmpty().withMessage("Creater Details is required!").isLength({ min: 2, max: 2000 }).withMessage("Creater Details should be at least 2 and at most 2000 characters!"),
    check("numberOfVideos").not().isEmpty().withMessage("numberOfVideos is required!").isNumeric().withMessage("Number Of Videos is invalid!"),
    check("videosList").not().isEmpty().withMessage("video List is required!").isArray().withMessage("Video List is invalid!"),
    check("prefix").not().isEmpty().withMessage("prefix is required!").isLength({ min: 1, max: 100 }).withMessage("prefix should be at least 1 and at most 100 characters!"),
]

/* Post Event Validator */
module.exports.postEventValidator = [
    check("type").not().isEmpty().withMessage("Type is required!").isIn(['Webinar', 'Live Talk']).withMessage("Type is invalid!"),
    check("title").not().isEmpty().withMessage("Title is required!").isLength({ min: 2, max: 100 }).withMessage("Title should be at least 2 and at most 100 characters!"),
    check("description").not().isEmpty().withMessage("Description is required!").isLength({ min: 2, max: 2000 }).withMessage("Description should be at least 2 and at most 2000 characters!"),
    check("createdBy").not().isEmpty().withMessage("Name is required!").isLength({ min: 2, max: 100 }).withMessage("Creator Name should be at least 2 and at most 100 characters!"),
    check("createrDetails").not().isEmpty().withMessage("Creater Details is required!").isLength({ min: 2, max: 2000 }).withMessage("Creater Details should be at least 10 and at most 500 characters!"),
    check("startTime").not().isEmpty().withMessage("Start Time is required!").isAfter().withMessage("Start Time should be greater than today!"),
    check("duration").not().isEmpty().withMessage("Duration is required!").isNumeric().withMessage("Duration is invalid!"),
    check("points").not().isEmpty().withMessage("Points is required!").isNumeric().withMessage("Points is invalid!"),
    check("price").not().isEmpty().withMessage("Price is required!").isNumeric().withMessage("Price is invalid!"),
]

/* Add mentor related validation */
module.exports.addMentorValidator = [
    check("mentorName").not().isEmpty().withMessage("Name is required").isLength({ min: 1, max: 50 }).withMessage("Mentor's Name shoudn't greater than 50 characters!"),
    check("email").isEmail().withMessage("Email is invalid!"),
    check("password").isLength({ min: 6 }).withMessage("Password is invalid!"),
    check("mobile").isMobilePhone().isLength({ min: 10, max: 10 }).withMessage("Mobile is invalid!"),
    check('dob').isBefore().withMessage("DOB cannot be empty"),
    check("totalExperience").isNumeric().withMessage("Total Experience is invalid!"),
    check("higerEducation").isIn(["MCA", "MSC", "BSC"]).withMessage("Higer Education is invalid!"),
    check("skills").isArray().withMessage("Skills is invalid!"),
    check("currentlyWorking").isLength({ min: 1, max: 50 }).withMessage("Company Name shoudn't greater than 50 characters!"),
    check("aboutMe").isLength({ min: 1, max: 500 }).withMessage("AboutMe shoudn't greater than 50 characters!"),
    check("address.address").not().isEmpty().withMessage("Mentor's address can't be empty!").isLength({ max: 200 }).withMessage("Mentor's address can't be more than 200 characters!"),
    check("address.city").not().isEmpty().withMessage("Mentor's address City can't be empty!").isLength({ max: 50 }).withMessage("Mentor's address City can't be more than 50 characters!"),
    check("address.state").not().isEmpty().withMessage("Mentor's address state can't be empty!").isLength({ max: 50 }).withMessage("Mentor's address state can't be more than 50 characters!"),
    check("address.pin").isNumeric().isLength({ min: 6, max: 6 }).withMessage("Mentor's address pincode is invalid!"),
]

/* Update password related validation */
module.exports.updatePasswordValidator = [
    check("password").not().isEmpty().withMessage("Current Password is required"),
    check("newPassword").not().isEmpty().withMessage("New Password is required")
]

/* Update mentor's profile validation */
module.exports.updateMentorProfileValidator = [
    check("mentorName").not().isEmpty().withMessage("Name is required").isLength({ min: 1, max: 50 }).withMessage("Mentor's Name shoudn't greater than 50 characters!"),
    check("email").isEmail().withMessage("Email is invalid!"),
    check("mobile").isMobilePhone().isLength({ min: 10, max: 10 }).withMessage("Mobile is invalid!"),
    check('dob').isBefore().withMessage("DOB cannot be empty"),
    check("totalExperience").isNumeric().withMessage("Total Experience is invalid!"),
    check("higerEducation").isIn(["MCA", "MBA", "BSC"]).withMessage("Higer Education is invalid!"),
    check("skills").isArray().withMessage("Skills is invalid!"),
    check("currentlyWorking").isLength({ min: 1, max: 50 }).withMessage("Company Name shoudn't greater than 50 characters!"),
    check("aboutMe").isLength({ min: 10, max: 500 }).withMessage("AboutMe should be at least 10 and at most 2000 characters!"),
    check("address.address").not().isEmpty().withMessage("Mentor's address can't be empty!").isLength({ max: 200 }).withMessage("Mentor's address can't be more than 200 characters!"),
    check("address.city").not().isEmpty().withMessage("Mentor's address City can't be empty!").isLength({ max: 50 }).withMessage("Mentor's address City can't be more than 50 characters!"),
    check("address.state").not().isEmpty().withMessage("Mentor's address state can't be empty!").isLength({ max: 50 }).withMessage("Mentor's address state can't be more than 50 characters!"),
    check("address.pin").isNumeric().isLength({ min: 6, max: 6 }).withMessage("Mentor's address pincode is invalid!"),
]

/* Update employee profile related validation */
module.exports.updateProfileValidator = [
    check("firstName").isAlpha().withMessage("First Name is invalid"),
    check("lastName").isAlpha().withMessage("Last Name is required"),
    check("email").isEmail().withMessage("Email is required"),
    check("mobile").notEmpty().withMessage("Mobile number is required"),
    check("employeeId").isLength({ min: 3, max: 3 }).withMessage("Employee Id is invalid!"),
]

/* Update profile related validation */
module.exports.updateStudentProfileValidator = [
    check("studentName").not().isEmpty().withMessage("Name is required").isLength({ min: 1, max: 50 }).withMessage("Student's Name shoudn't greater than 50 characters!"),
    check("email").isEmail().withMessage("Email is invalid!"),
    check("mobile").isMobilePhone().isLength({ min: 10, max: 10 }).withMessage("Mobile is invalid!"),
    check('dob').isBefore().withMessage("DOB cannot be empty"),
    check("higerEducation").isIn(["MCA", "MBA", "BSC"]).withMessage("Higer Education is invalid!"),
    check("skills").isArray().withMessage("Skills is invalid!"),
    check("aboutMe").isLength({ min: 10, max: 2000 }).withMessage("AboutMe should be at least 10 and at most 2000 characters!"),

    // check("address.address").optional().not().isEmpty().withMessage("Student's address can't be empty!").isLength({ max: 200 }).withMessage("Student's address can't be more than 200 characters!"),
    // check("address.city").optional().not().isEmpty().withMessage("Student's address City can't be empty!").isLength({ max: 50 }).withMessage("Student's address City can't be more than 50 characters!"),
    // check("address.state").optional().not().isEmpty().withMessage("Student's address state can't be empty!").isLength({ max: 50 }).withMessage("Student's address state can't be more than 50 characters!"),
    // check("address.pin").optional().isNumeric().isLength({ min: 6, max: 6 }).withMessage("Student's address pincode is invalid!"),
]

// /* Update borrower profile related validation */
// module.exports.updateBorrowerProfileValidator = [
//     check("applicantFirstName").isAlpha().withMessage("Applicant First Name is invalid!"),
//     check("applicantLastName").isAlpha().withMessage("Applicant Last Name is invalid!"),
//     check("businessName").isAlpha().withMessage("Business Name is invalid!"),
//     check("applicantDesignation").isAlpha().withMessage("Applicant Designation is invalid!"),
//     check("businessOperationalCity").isAlpha().withMessage("Business Operational City is invalid!"),
//     check('businessTurnover').isIn(["Less than 5 Lac", "05-10Lac", "11-25Lac", "26-50Lac", "51Lac-01Cr", "01-05Cr", "05Cr+"]).withMessage("Business Turnover is invalid!"),
// ]

/* User Business profile related validation */
module.exports.updateBusinessProfileValidator = [
    check("applicantFirstName").optional().isAlpha().withMessage("Applicant First Name is invalid!"),
    check("applicantLastName").optional().isAlpha().withMessage("Applicant Last Name is invalid!"),
    check("applicantDesignation").optional().not().isEmpty().withMessage("Applicant Designation is invalid!"),
    check("officeAddress.address").optional().not().isEmpty().withMessage("Office address can't be empty!").isLength({ max: 200 }).withMessage("Office address can't be more than 200 characters!"),
    check("officeAddress.city").optional().not().isEmpty().withMessage("Office address City can't be empty!").isLength({ max: 50 }).withMessage("Office address City can't be more than 50 characters!"),
    check("officeAddress.state").optional().not().isEmpty().withMessage("Office address state can't be empty!").isLength({ max: 50 }).withMessage("Office address state can't be more than 50 characters!"),
    check("officeAddress.pin").optional().isNumeric().isLength({ min: 6, max: 6 }).withMessage("Office address pincode is invalid!"),
    check("registeredAddress.address").optional().not().isEmpty().withMessage("Registere address can't be empty!").isLength({ max: 200 }).withMessage("Registere address can't be more than 200 characters!"),
    check("registeredAddress.city").optional().not().isEmpty().withMessage("Registere address City can't be empty!").isLength({ max: 50 }).withMessage("Registere address City can't be more than 50 characters!"),
    check("registeredAddress.state").not().isEmpty().withMessage("Registere address state can't be empty!").isLength({ max: 50 }).withMessage("Registere address state can't be more than 50 characters!"),
    check("registeredAddress.pin").optional().isNumeric().isLength({ min: 6, max: 6 }).withMessage("Registere address pincode is invalid!"),
    check('business.name').not().exists().withMessage("You can't update business name!"),
    check('business.incorporationDate').optional().isBefore().withMessage("Business Incorporation Date can't be empty!"),
    check('business.businessTurnover').optional().isIn(["Less than 5 Lac", "05-10Lac", "11-25Lac", "26-50Lac", "51Lac-01Cr", "01-05Cr", "05Cr+"]).withMessage("Business turnover invalid!"),
    check('business.type').optional().isIn(["Private Limited", "LLP", "Partnership", "Sole Proprietorship", "Public Limited"]).withMessage("Business type is invalid!"),
    check('business.sector').optional().isIn(["AGRICULTURE AND ALLIED INDUSTRIES", "AUTOMOBILES", "AUTO COMPONENTS", "AVIATION", "BANKING", "CEMENT", "CONSUMER DURABLES", "ECOMMERCE", "EDUCATION AND TRAINING", "ENGINEERING AND CAPITAL GOODS", "FINANCIAL SERVICES", "FMCG", "GEMS AND JEWELLERY", "HEALTHCARE", "INFRASTRUCTURE", "INSURANCE", "IT & ITES", "MANUFACTURING", "MEDIA AND ENTERTAINMENT", "METALS AND MINING", "OIL AND GAS", "PHARMACEUTICALS", "PORTS", "POWER", "RAILWAYS", "REAL ESTATE", "RENEWABLE ENERGY", "RETAIL", "ROADS", "SCIENCE AND TECHNOLOGY", "SERVICES", "STEEL", "TELECOMMUNICATIONS", "TEXTILES", "TOURISM AND HOSPITALITY"]).withMessage("Business sector is invalid!"),
    check('business.pan').optional().isLength({ min: 10, max: 10 }).withMessage("Business pan is invalid"),
    check('business.gst').optional().isLength({ min: 15, max: 15 }).withMessage("GST number is invalid"),
]

/* User Owner profile related validation */
module.exports.updateOwnerProfileValidator = [
    check("ownerDetails.firstName").optional().isAlpha().withMessage("Owner First Name is invalid!"),
    check("ownerDetails.lastName").optional().isAlpha().withMessage("Owner Last Name is invalid!"),
    check("ownerDetails.designation").optional().not().isEmpty().withMessage("Owner Designation is invalid!").isLength({ max: 50 }).withMessage("Owner Designation can't be more than 50 characters!"),
    check('ownerDetails.gender').optional().isIn(["male", "female"]).withMessage("Owner gender is invalid!"),
    check("ownerDetails.email").optional().isEmail().withMessage("Email is required!").isLength({ max: 50 }).withMessage("Email can't be more than 50 characters!"),
    check("ownerDetails.mobile").optional().isNumeric().withMessage("Mobile number is invalid!").isLength({ max: 10 }).withMessage("Mobile can't be more than 10 numeric!"),
    check('ownerDetails.dob').optional().isBefore().withMessage("Date of Birth is invalid!"),
    check('ownerDetails.pan').optional().not().isEmpty().withMessage("Pan number can't be empty!").isLength({ min: 10, max: 10 }).withMessage("Business pan is invalid"),
    check("ownerAddress.address").optional().not().isEmpty().withMessage("Owner address can't be empty!").isLength({ max: 200 }).withMessage("Owner address can't be more than 200 characters!"),
    check("ownerAddress.city").optional().not().isEmpty().withMessage("Owner address City can't be empty!").isLength({ max: 50 }).withMessage("Owner address City can't be more than 50 characters!"),
    check("ownerAddress.state").optional().not().isEmpty().withMessage("Owner address state can't be empty!").isLength({ max: 50 }).withMessage("Owner address state can't be more than 50 characters!"),
    check("ownerAddress.pin").optional().isNumeric().isLength({ min: 6, max: 6 }).withMessage("Owner address pincode is invalid!"),
    check("directors").optional().isArray().not().isEmpty().withMessage("Directors details can't be empty!")
]

/* Borrower's bank statements validator */
module.exports.updateBankStatementValidator = [
    check("bankStatement.filename").not().isEmpty().withMessage("File Name can't be empty!").isLength({ min: 1, max: 200 }).withMessage("File Name shouldn't greater than 200 characters!"),
    check("bankStatement.bankName").not().isEmpty().withMessage("Bank Name can't be empty!").isLength({ min: 1, max: 100 }).withMessage("Bank Name shouldn't greater than 100 characters!"),
    check("bankStatement.fileData").not().isEmpty().withMessage("File data can't be empty!"),
    check("bankStatement.password").optional().not().isEmpty().withMessage("File password can't be empty!"),
]
/* Borrower's company balance sheet validator */
module.exports.updateBalanceSheetValidator = [
    check("balanceSheet.filename").not().isEmpty().withMessage("File Name can't be empty!").isLength({ min: 1, max: 200 }).withMessage("File Name shouldn't greater than 200 characters!"),
    check("balanceSheet.fileData").not().isEmpty().withMessage("File data can't be empty!")
]

/* Borrower's company Pnl validator */
module.exports.updatePnlStatementValidator = [
    check("pnlStatement.filename").not().isEmpty().withMessage("File Name can't be empty!").isLength({ min: 1, max: 200 }).withMessage("File Name shouldn't greater than 200 characters!"),
    check("pnlStatement.fileData").not().isEmpty().withMessage("File data can't be empty!")
]

/* Borrower's Capital Account Statements validator */
module.exports.updateCapitalAccountStatementValidator = [
    check("capitalAccountStatement.filename").not().isEmpty().withMessage("File Name can't be empty!").isLength({ min: 1, max: 200 }).withMessage("File Name shouldn't greater than 200 characters!"),
    check("capitalAccountStatement.fileData").not().isEmpty().withMessage("File data can't be empty!")
]
/* Borrower's Gst returns validator */
module.exports.updateGstReturnValidator = [
    check("gstReturn.filename").not().isEmpty().withMessage("File Name can't be empty!").isLength({ min: 1, max: 200 }).withMessage("File Name shouldn't greater than 200 characters!"),
    check("gstReturn.fileData").not().isEmpty().withMessage("File data can't be empty!")
]

/* Borrower's Itrs validator */
module.exports.updateItrValidator = [
    check("itr.filename").not().isEmpty().withMessage("File Name can't be empty!").isLength({ min: 1, max: 200 }).withMessage("File Name shouldn't greater than 200 characters!"),
    check("itr.fileData").not().isEmpty().withMessage("File data can't be empty!")
]

/* Borrower's company pan validator */
module.exports.updateCompanyPanValidator = [
    check("companyPan.fileData").optional().not().isEmpty().withMessage("Company Pan can't be empty!"),
    check("companyPan.filename").optional().not().isEmpty().withMessage("Company Pan can't be empty!").isLength({ min: 1, max: 200 }).withMessage("File Name shouldn't greater than 200 characters!"),
]
/* Borrower's company address proof validator */
module.exports.updateCompanyAddressProofValidator = [
    check("companyAddressProof.fileData").optional().not().isEmpty().withMessage("Company Address Proof can't be empty!"),
    check("companyAddressProof.filename").optional().not().isEmpty().withMessage("Company Address Proof can't be empty!").isLength({ min: 1, max: 200 }).withMessage("File Name shouldn't greater than 200 characters!"),
]

/* Borrower's director pan validator */
module.exports.updateDirectorPanValidator = [
    check("directorPan.fileData").optional().not().isEmpty().withMessage("Director Pan can't be empty!"),
    check("directorPan.filename").optional().not().isEmpty().withMessage("Director Pan can't be empty!").isLength({ min: 1, max: 200 }).withMessage("File Name shouldn't greater than 200 characters!")
]

// /* User Document profile related validation */
// module.exports.updateDocumentsValidator = [
//     check("bankStatements").optional().isArray().withMessage("Bank Statements should be an array!").not().isEmpty().withMessage("Bank Statements can't be empty!"),
//     check("balanceSheets").optional().isArray().withMessage("Balance Sheets should be an array!").not().isEmpty().withMessage("Balance Sheets can't be empty!"),
//     check("pnlStatements").optional().isArray().withMessage("Pnl Statements should be an array!").not().isEmpty().withMessage("Pnl Statements can't be empty!"),
//     check("capitalAccountStatements").optional().isArray().withMessage("Capital Account Statements should be an array!").not().isEmpty().withMessage("Capital Account Statements can't be empty!"),
//     check("gstReturns").optional().isArray().withMessage("GST Returns should be an array!").not().isEmpty().withMessage("GST Returns can't be empty!"),
//     check("itr").optional().isArray().withMessage("ITR Statements should be an array!").not().isEmpty().withMessage("ITR Statements can't be empty!"),
//     check("companyPan.fileData").optional().not().isEmpty().withMessage("Company Pan can't be empty!"),
//     check("companyPan.filename").optional().not().isEmpty().withMessage("Company Pan can't be empty!").isLength({ min: 1, max: 200 }).withMessage("File Name shouldn't greater than 200 characters!"),
//     check("companyAddressProof.fileData").optional().not().isEmpty().withMessage("Company Address Proof can't be empty!"),
//     check("companyAddressProof.filename").optional().not().isEmpty().withMessage("Company Address Proof can't be empty!").isLength({ min: 1, max: 200 }).withMessage("File Name shouldn't greater than 200 characters!"),
//     check("directorPan.fileData").optional().not().isEmpty().withMessage("Director Pan can't be empty!"),
//     check("directorPan.filename").optional().not().isEmpty().withMessage("Director Pan can't be empty!").isLength({ min: 1, max: 200 }).withMessage("File Name shouldn't greater than 200 characters!"),
// ]

/* Update Lender profile related validation */
module.exports.updateLenderProfileValidator = [
    check("applicantFirstName").isAlpha().withMessage("Applicant First Name is invalid!"),
    check("applicantLastName").isAlpha().withMessage("Applicant Last Name is invalid!"),
    check("businessName").isAlpha().withMessage("Business Name is invalid!"),
    check("applicantDesignation").isAlpha().withMessage("Applicant Designation is invalid!"),
]

/* Update borrower's owne profile related validation */
module.exports.updateOwnProfileValidator = [
    check("firstName").isAlpha().withMessage("First Name is invalid"),
    check("lastName").isAlpha().withMessage("Last Name is required"),
    check("email").isEmail().withMessage("Email is required"),
    check("mobile").notEmpty().withMessage("Mobile number is required"),
]

/* Update intrest validation */
module.exports.changeTotalIntrestValidator = [
    check('intrestRate').isNumeric().withMessage("Intrest Rate is invalid!"),
    check('loanId').isAlphanumeric().withMessage("Loan Id is invalid!"),
]

/* Update paid emi validation */
module.exports.paidAmountValidator = [
    check('paidAmount').isNumeric().withMessage("Paid Amount is invalid!"),
]

/* JWT related validation */
module.exports.jwtTokenValidator = [
    header("Authorization").isJWT().withMessage("Token is invalid!")
]

/* Fees related validation */
module.exports.createFeesValidator = [
    check("borrowerId").isAlphanumeric().withMessage("Borrower Id is invalid!"),
    check("amount").isNumeric().withMessage("Amount is required!"),
    check("description").notEmpty().withMessage("Email is required!").isLength({ min: 1, max: 150 }).withMessage("Description shouldn't greater than 150 characters!"),
    check("paidTimestamp").not().exists().withMessage("Can't update Paid Timestamp!"),
]

/* Comments related validation */
module.exports.changeCommentValidator = [
    check("loanId").isAlphanumeric().withMessage("Loan Id should be alphaNumeric!"),
    check("comment").not().isEmpty().withMessage("Comment can't be empty!").isLength({ min: 1, max: 300 }).withMessage("Comment should be less than 3000 characters!"),
]

/* Event Id validation */
module.exports.eventIdValidator = [
    check("eventId").not().isEmpty().withMessage("Event Id shouldn't Empty!").isMongoId().withMessage("Event Id is inavlid!"),
]

/* Question Id validation */
module.exports.questionIdValidator = [
    check("questionId").not().isEmpty().withMessage("Question Id shouldn't Empty!").isMongoId().withMessage("Question Id is inavlid!"),
]

/* Answer Id validation */
module.exports.answerIdValidator = [
    check("answerId").not().isEmpty().withMessage("Answer Id shouldn't Empty!").isMongoId().withMessage("Answer Id is inavlid!"),
]

/* Student Id validation */
module.exports.studentIdValidator = [
    check("studentId").not().isEmpty().withMessage("Student Id shouldn't Empty!").isMongoId().withMessage("Student Id is inavlid!"),
]

/* Video Id validation */
module.exports.videoIdValidator = [
    check("videoId").not().isEmpty().withMessage("Video Id shouldn't Empty!").isMongoId().withMessage("Video Id is inavlid!"),
]

/* Mentor Id validation */
module.exports.mentorIdValidator = [
    check("mentorId").not().isEmpty().withMessage("Mentor Id shouldn't Empty!").isMongoId().withMessage("Mentor Id is inavlid!"),
]

/* Course Id validation */
module.exports.courseIdValidator = [
    check("courseId").not().isEmpty().withMessage("Course Id shouldn't Empty!").isMongoId().withMessage("Course Id is inavlid!"),
]

/* Rating Id validation */
module.exports.ratingIdValidator = [
    check("ratingId").not().isEmpty().withMessage("Rating Id shouldn't Empty!").isMongoId().withMessage("Rating Id is inavlid!"),
]

/* Employee Id validation */
module.exports.employeeIdValidator = [
    check("employeeId").not().isEmpty().withMessage("Employee Id shouldn't Empty!").isMongoId().withMessage("Employee Id is inavlid!"),
]

/* Subscription Id validation */
module.exports.subscriptionIdValidator = [
    check("subscriptionId").not().isEmpty().withMessage("Subscription Id shouldn't Empty!").isMongoId().withMessage("Subscription Id is inavlid!"),
]

/* Incubation Id validation */
module.exports.incubationIdValidator = [
    check("incubationId").not().isEmpty().withMessage("Incubation Id shouldn't Empty!").isMongoId().withMessage("Incubation Id is inavlid!"),
]

/* Incubation related validations */
module.exports.incubationValidator = [
    check("startupName").not().isEmpty().withMessage("Startup Name is required").isLength({ min: 1, max: 100 }).withMessage("Startup Name shoudn't greater than 100 characters!"),
    check("registered").not().isEmpty().withMessage("Registered is required").isBoolean().withMessage("Registered is invalid!"),
    check("typeOfRegistration").optional().not().isEmpty().withMessage("Type Of Registration is required").isIn(['Sole Proprietor', 'LLP', 'Partnership', 'Private Limited']).withMessage("Type Of Registration is invalid!"),
    check("yaerOfRegistration").optional().not().isEmpty().withMessage("Yaer Of Registration is required").isLength({ min: 4, max: 4 }).withMessage("Yaer Of Registration is invalid!"),
    check("startupStage").not().isEmpty().withMessage("StartUp stage is required").isIn(['Idea', 'Product Development', 'Pre-revenue(Just Launched)', 'Revenue Stage']).withMessage("StartUp stage is invalid!"),
    check("startWorkingOnIdea").not().isEmpty().withMessage("Start Working On Idea is required").isBefore().withMessage("Start Working On Idea shoudn't greater than yestarday!"),
    check("currentMonthlyRevenue").not().isEmpty().withMessage("Current Monthly Revenue is required").isIn(['0', 'Under 1 lac', '1-5 Lac', 'Above 5 lac']).withMessage("Current Monthly Revenue is invalid!"),
    check("problemYouAreSolving").not().isEmpty().withMessage("Problem you are solving is required").isLength({ min: 1, max: 60 }).withMessage("Problem you are solving shoudn't greater than 60 characters!"),
    check("productDescription").not().isEmpty().withMessage("Product Description is required").isLength({ min: 1, max: 100 }).withMessage("Product Description shoudn't greater than 100 characters!"),
    check("numberOfFounders").not().isEmpty().withMessage("Number Of founders is required").isIn([1, 2, 3, 4, 5]).withMessage("Number Of founders is invalid!"),
    check("foundersDetails").not().isEmpty().withMessage("Founders Details is required").isArray().withMessage("Founders Details is invalid!"),
    check("financialPlan.s3FileName").not().isEmpty().withMessage("S3 file is required"),
    check("financialPlan.originalFileName").not().isEmpty().withMessage("Original file is required"),
    check("pitchDeck.s3FileName").not().isEmpty().withMessage("S3 file is required"),
    check("pitchDeck.originalFileName").not().isEmpty().withMessage("Original file is required"),
    check("contactsDetails.name").not().isEmpty().withMessage("Name is required").isLength({ min: 1, max: 50 }).withMessage("Name shoudn't greater than 50 characters!"),
    check("contactsDetails.role").not().isEmpty().withMessage("Role is required").isLength({ min: 1, max: 50 }).withMessage("Role shoudn't greater than 50 characters!"),
    check("contactsDetails.email").isEmail().withMessage("Email is invalid!"),
    check("contactsDetails.mobile").isMobilePhone().isLength({ min: 10, max: 10 }).withMessage("Mobile is invalid!"),
    check("address.address").not().isEmpty().withMessage("Company's address can't be empty!").isLength({ max: 200 }).withMessage("Student's address can't be more than 200 characters!"),
    check("address.city").not().isEmpty().withMessage("Company's address City can't be empty!").isLength({ max: 50 }).withMessage("Student's address City can't be more than 50 characters!"),
    check("address.state").not().isEmpty().withMessage("Company's address state can't be empty!").isLength({ max: 50 }).withMessage("Student's address state can't be more than 50 characters!"),
    check("address.pin").isNumeric().isLength({ min: 6, max: 6 }).withMessage("Company's address pincode is invalid!"),
]

/* Update Incubation related validations */
module.exports.incubationUpdateValidator = [
    check("typeOfRegistration").optional().not().isEmpty().withMessage("Type Of Registration is required").isIn(['Sole Proprietor', 'LLP', 'Partnership', 'Private Limited']).withMessage("Type Of Registration is invalid!"),
    check("yaerOfRegistration").optional().not().isEmpty().withMessage("Yaer Of Registration is required").isLength({ min: 4, max: 4 }).withMessage("Yaer Of Registration is invalid!"),
    check("startupStage").not().isEmpty().withMessage("StartUp stage is required").isIn(['Idea', 'Product Development', 'Pre-revenue(Just Launched)', 'Revenue Stage']).withMessage("StartUp stage is invalid!"),
    check("startWorkingOnIdea").not().isEmpty().withMessage("Start Working On Idea is required").isBefore().withMessage("Start Working On Idea shoudn't greater than yestarday!"),
    check("currentMonthlyRevenue").not().isEmpty().withMessage("Current Monthly Revenue is required").isIn(['0', 'Under 1 lac', '1-5 Lac', 'Above 5 lac']).withMessage("Current Monthly Revenue is invalid!"),
    check("problemYouAreSolving").not().isEmpty().withMessage("Problem you are solving is required").isLength({ min: 1, max: 60 }).withMessage("Problem you are solving shoudn't greater than 60 characters!"),
    check("productDescription").not().isEmpty().withMessage("Product Description is required").isLength({ min: 1, max: 100 }).withMessage("Product Description shoudn't greater than 100 characters!"),
    check("numberOfFounders").not().isEmpty().withMessage("Number Of founders is required").isIn([1, 2, 3, 4, 5]).withMessage("Number Of founders is invalid!"),
]

/* Create Subscription validation */
module.exports.createSubscriptionValidator = [
    check("studentId").not().isEmpty().withMessage("Student Id shouldn't Empty!").isMongoId().withMessage("Student Id is inavlid!"),
    check("subscriptionType").not().isEmpty().withMessage("Subscription Type shouldn't Empty!").isIn(['monthly', 'quarterly', 'yearly']).withMessage("Subscription Type is inavlid!"),
]

/* File Name validation */
module.exports.fileNameValidator = [
    check("fileName").not().isEmpty().isLength({ min: 10, max: 500 }).withMessage("File Name is invalid!"),
]
