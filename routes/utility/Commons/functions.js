const Histories = require("../../../models/histories");
const config = require("../../../config");
const AWS = require("aws-sdk");
const crypto = require("crypto");
const regxPdf = new RegExp("^.*\.(pdf)$", 'i');
// var regx = new RegExp("^.*\.(jpg|jpeg|pdf|png|csv|xls|xlsx)$", 'i');
var regx = new RegExp("^.*\.(jpg|jpeg|pdf|png)$", 'i');

const s3 = new AWS.S3({
    endpoint: 's3-ap-south-1.amazonaws.com',
    accessKeyId: config.IAM_USER_KEY,
    secretAccessKey: config.IAM_USER_SECRET,
    Bucket: config.BUCKET_NAME,
    signatureVersion: 'v4',
    region: 'ap-south-1'
});

/* This function for save user history. */
module.exports.saveUserHistory = async (borrowerId, userId, oldDescription, newDescription, operation) => {
    try {
        let history = new Histories({
            borrowerId: borrowerId,
            userId: userId,
            oldDescription: oldDescription,
            newDescription: newDescription,
            operation: operation,
        });
        const savedHistory = await history.save();
        return savedHistory
    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
};

/* This function for save loan history. */
module.exports.saveLoanHistory = async (borrowerId, loanId, oldDescription, newDescription, operation) => {
    try {
        let history = new Histories({
            borrowerId: borrowerId,
            loanId: loanId,
            oldDescription: oldDescription,
            newDescription: newDescription,
            operation: operation,
        });
        const savedHistory = await history.save();
        return savedHistory
    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
};

// module.exports.roundOf = (number) => {
//     return number.toFixed(2)
// }

// Function for round number
module.exports.roundOf = (number) => {
    let temp = number * 100;
    let decimal = temp % 1;
    if (decimal < 0.5 || decimal > 0.55) {
        return Math.round(number * 100) / 100;
    } else {
        if (parseInt(temp) % 2 == 0) {
            return Math.floor(number * 100) / 100;
        } else {
            return Math.ceil(number * 100) / 100;
        }
    }
}

// Get interest Amount for term loan
module.exports.getInterestAmountTerm = (P, R, N) => {
    if (R == 0) {
        return 0
    } else {
        const AA = (R / 1200)
        const BB = (1 + AA)
        const CC = BB ** N
        const DD = ((N * AA) - 1)
        const EE = CC * DD
        const NUMERATOR = EE + 1
        const DENOMINATOR = CC - 1
        const final = P * (NUMERATOR / DENOMINATOR)
        console.log("final----", final)
        return final
    }
}

/* Get day vise Extension Amount */
module.exports.getDayViseInterestAmount = (principal, rate, time) => {
    return ((time * rate) / (365 * 100)) * principal
}

/* Generate pre singed url for file */
module.exports.getSignedUrlForFile = async (fileName, originalFileName) => {
    const params = {
        Bucket: config.BUCKET_NAME,
        Key: fileName,
        Expires: 60 * 5,
        ResponseContentDisposition: 'attachment; filename ="' + originalFileName + '"'
    };
    try {
        return await new Promise((resolve, reject) => {
            s3.getSignedUrl('getObject', params, (err, url) => {
                err ? reject(err) : resolve(url);
            });
        });
    } catch (err) {
        if (err) {
            console.log(err)
            throw new Error(err);
        }
    }
}

// Function for remove file from S3 Bucket
module.exports.removeFile = async (fileName) => {
    let params = {
        Bucket: config.BUCKET_NAME,
        Key: fileName
    };
    console.log(params)
    try {
        return await s3.deleteObject(params).promise()
    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
};

/* This function for get object values. */
module.exports.getValues = async (object) => {
    try {
        // delete object._id;
        return JSON.stringify(object)
    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
};

// Function for remove files from S3 Bucket
const unlinkFile = async (fileName) => {
    console.log("---------Unlink--------")
    let params = {
        Bucket: config.BUCKET_NAME,
        Key: fileName
    };
    try {
        let response = await s3.deleteObject(params).promise()
    } catch (error) {
        console.log(error)
    }
};

module.exports.unlinkFile = unlinkFile

// // Upload statements in S3 Bucket
// module.exports.bankStatement = async (req, res, next) => {
//     let files = req.body.bankStatements;
//     let bankStatements = [];
//     req.uploads = [];
//     async.forEachOfSeries(files, async (statement) => {
//         if (statement.filename && statement.fileData) {
//             if (statement.bankName) {
//                 if ((statement.filename).match(regxPdf)) {
//                     let fileName = "bank_statement_" + crypto.randomBytes(16).toString("hex") + ".pdf";
//                     console.log(fileName)
//                     let buf = Buffer.from(statement.fileData.replace(/^data:application\/[a-z]+;base64,/, ""), 'base64')
//                     // let buf = Buffer.from(statement.fileData.replace(/^data:image\/\w+;base64,/, ""), 'base64')
//                     console.log(buf)
//                     let params = {
//                         Bucket: 'sme-testing',
//                         Key: fileName,
//                         ContentEncoding: 'base64',
//                         ContentDisposition: 'inline',
//                         // ContentType: 'application/pdf',
//                         Body: buf
//                     };
//                     try {
//                         const data = await s3.putObject(params).promise();
//                         console.log(data);
//                         let obj = {
//                             bankName: statement.bankName,
//                             filename: fileName,
//                             originalFilename: statement.filename,
//                             password: statement.password
//                         };
//                         bankStatements.push(obj);
//                         req.uploads.push(fileName);
//                     } catch (err) {
//                         console.log(err)
//                         unlinkFiles(req.uploads);
//                         return res.status(500).send({
//                             error: err
//                         });
//                     }
//                 } else {
//                     unlinkFiles(req.uploads);
//                     throw new Error("Bank statement should be in pdf format!");
//                 }
//             } else {
//                 unlinkFiles(req.uploads);
//                 throw new Error("Bank name of statement uploaded is not provided!");
//             }
//         } else {
//             unlinkFiles(req.uploads);
//             throw new Error("File name and data can't be empty!");
//         }
//     }, function (err) {
//         if (err) {
//             return res.status(422).json({
//                 error: err.message
//             });
//         } else {
//             req.bankStatements = bankStatements;
//             next();
//         }
//     });
// }

// Upload bank statement in S3 Bucket
module.exports.bankStatement = async (req, res, next) => {
    var file = req.body.bankStatement;
    if (file.fileData && file.filename && file.bankName) {
        if ((file.filename).match(regxPdf)) {
            let fileName = "bank_statement_" + crypto.randomBytes(16).toString("hex") + ".pdf";
            console.log(fileName)
            let buf = Buffer.from(file.fileData.replace(/^data:application\/[a-z]+;base64,/, ""), 'base64')
            console.log(buf)
            let params = {
                Bucket: config.BUCKET_NAME,
                Key: fileName,
                ContentEncoding: 'base64',
                ContentDisposition: 'inline',
                Body: buf
            };
            try {
                const data = await s3.putObject(params).promise();
                console.log(data);
                let obj = {
                    bankName: file.bankName,
                    filename: fileName,
                    originalFilename: file.filename,
                    password: file.password
                };
                req.bankStatement = obj;
                req.upload = fileName;
                next()
            } catch (err) {
                console.log(err);
                unlinkFile(req.upload);
                return res.status(500).send({
                    error: err
                });
            }
        } else {
            unlinkFiles(req.uploads);
            return res.status(422).json({
                error: "Bank statement should be in pdf format!"
            });
        }
    } else {
        unlinkFiles(req.uploads);
        return res.status(422).json({
            error: "Bank Name, File name and data can't be empty!"
        });
    }
}

// Upload balance sheet in S3 Bucket
module.exports.balanceSheet = async (req, res, next) => {
    var file = req.body.balanceSheet;
    if (file.fileData && file.filename) {
        if ((file.filename).match(regxPdf)) {
            let fileName = "balance_sheet_" + crypto.randomBytes(16).toString("hex") + ".pdf";
            console.log(fileName)
            let buf = Buffer.from(file.fileData.replace(/^data:application\/[a-z]+;base64,/, ""), 'base64')
            console.log(buf)
            let params = {
                Bucket: config.BUCKET_NAME,
                Key: fileName,
                ContentEncoding: 'base64',
                ContentDisposition: 'inline',
                Body: buf
            };
            try {
                const data = await s3.putObject(params).promise();
                console.log(data);
                let obj = {
                    filename: fileName,
                    originalFilename: file.filename,
                };
                req.balanceSheet = obj;
                req.upload = fileName;
                next()
            } catch (err) {
                console.log(err);
                unlinkFile(req.upload);
                return res.status(500).send({
                    error: err
                });
            }
        } else {
            unlinkFile(req.uploads);
            return res.status(422).json({
                error: "Balance Sheets should be in pdf format!"
            });
        }
    } else {
        unlinkFile(req.uploads);
        return res.status(422).json({
            error: "File name and data can't be empty!"
        });
    }
}

// Upload Pnl statement in S3 Bucket
module.exports.pnlStatement = async (req, res, next) => {
    var file = req.body.pnlStatement;
    if (file.fileData && file.filename) {
        if ((file.filename).match(regxPdf)) {
            let fileName = "pnl_statement_" + crypto.randomBytes(16).toString("hex") + ".pdf";
            console.log(fileName)
            let buf = Buffer.from(file.fileData.replace(/^data:application\/[a-z]+;base64,/, ""), 'base64')
            console.log(buf)
            let params = {
                Bucket: config.BUCKET_NAME,
                Key: fileName,
                ContentEncoding: 'base64',
                ContentDisposition: 'inline',
                Body: buf
            };
            try {
                const data = await s3.putObject(params).promise();
                console.log(data);
                let obj = {
                    filename: fileName,
                    originalFilename: file.filename,
                };
                req.pnlStatement = obj;
                req.upload = fileName;
                next()
            } catch (err) {
                console.log(err);
                unlinkFile(req.upload);
                return res.status(500).send({
                    error: err
                });
            }
        } else {
            unlinkFile(req.uploads);
            return res.status(422).json({
                error: "Balance Sheets should be in pdf format!"
            });
        }
    } else {
        unlinkFile(req.uploads);
        return res.status(422).json({
            error: "File name and data can't be empty!"
        });
    }
}

// Upload Capital Account Statement in S3 Bucket
module.exports.capitalAccountStatement = async (req, res, next) => {
    var file = req.body.capitalAccountStatement;
    if (file.fileData && file.filename) {
        if ((file.filename).match(regxPdf)) {
            let fileName = "capital_account_statement_" + crypto.randomBytes(16).toString("hex") + ".pdf";
            console.log(fileName)
            let buf = Buffer.from(file.fileData.replace(/^data:application\/[a-z]+;base64,/, ""), 'base64')
            console.log(buf)
            let params = {
                Bucket: config.BUCKET_NAME,
                Key: fileName,
                ContentEncoding: 'base64',
                ContentDisposition: 'inline',
                Body: buf
            };
            try {
                const data = await s3.putObject(params).promise();
                console.log(data);
                let obj = {
                    filename: fileName,
                    originalFilename: file.filename,
                };
                req.capitalAccountStatement = obj;
                req.upload = fileName;
                next()
            } catch (err) {
                console.log(err);
                unlinkFile(req.upload);
                return res.status(500).send({
                    error: err
                });
            }
        } else {
            unlinkFile(req.uploads);
            return res.status(422).json({
                error: "Balance Sheets should be in pdf format!"
            });
        }
    } else {
        unlinkFile(req.uploads);
        return res.status(422).json({
            error: "File name and data can't be empty!"
        });
    }
}

// Upload Gst Returns in S3 Bucket
module.exports.gstReturn = async (req, res, next) => {
    var file = req.body.gstReturn;
    if (file.fileData && file.filename) {
        if ((file.filename).match(regxPdf)) {
            let fileName = "gst_returns_" + crypto.randomBytes(16).toString("hex") + ".pdf";
            console.log(fileName)
            let buf = Buffer.from(file.fileData.replace(/^data:application\/[a-z]+;base64,/, ""), 'base64')
            console.log(buf)
            let params = {
                Bucket: config.BUCKET_NAME,
                Key: fileName,
                ContentEncoding: 'base64',
                ContentDisposition: 'inline',
                Body: buf
            };
            try {
                const data = await s3.putObject(params).promise();
                console.log(data);
                let obj = {
                    filename: fileName,
                    originalFilename: file.filename,
                };
                req.gstReturn = obj;
                req.upload = fileName;
                next()
            } catch (err) {
                console.log(err);
                unlinkFile(req.upload);
                return res.status(500).send({
                    error: err
                });
            }
        } else {
            unlinkFile(req.uploads);
            return res.status(422).json({
                error: "Gst return should be in pdf format!"
            });
        }
    } else {
        unlinkFile(req.uploads);
        return res.status(422).json({
            error: "File name and data can't be empty!"
        });
    }
}

// Upload Itr in S3 Bucket
module.exports.itr = async (req, res, next) => {
    var file = req.body.itr;
    if (file.fileData && file.filename) {
        if ((file.filename).match(regxPdf)) {
            let fileName = "itr_" + crypto.randomBytes(16).toString("hex") + ".pdf";
            console.log(fileName)
            let buf = Buffer.from(file.fileData.replace(/^data:application\/[a-z]+;base64,/, ""), 'base64')
            console.log(buf)
            let params = {
                Bucket: config.BUCKET_NAME,
                Key: fileName,
                ContentEncoding: 'base64',
                ContentDisposition: 'inline',
                Body: buf
            };
            try {
                const data = await s3.putObject(params).promise();
                console.log(data);
                let obj = {
                    filename: fileName,
                    originalFilename: file.filename,
                };
                req.itr = obj;
                req.upload = fileName;
                next()
            } catch (err) {
                console.log(err);
                unlinkFile(req.upload);
                return res.status(500).send({
                    error: err
                });
            }
        } else {
            unlinkFile(req.uploads);
            return res.status(422).json({
                error: "Itr should be in pdf format!"
            });
        }
    } else {
        unlinkFile(req.uploads);
        return res.status(422).json({
            error: "File name and data can't be empty!"
        });
    }
}

// Upload Company Pan in S3 Bucket
module.exports.updateCompanyPan = async (req, res, next) => {
    const file = req.body.companyPan;
    const ext = file.fileData.split(';')[0].split('/')[1]
    if (file.fileData && file.filename) {
        if ((file.filename).match(regx)) {
            let fileName = "company_pan_" + crypto.randomBytes(16).toString("hex") + "." + ext;
            console.log(fileName)
            let buf = Buffer.from(file.fileData.replace(/^(data:application|data:image)\/[a-z]+;base64,/, ""), 'base64')
            console.log(buf)
            let params = {
                Bucket: 'sme-testing',
                Key: fileName,
                ContentEncoding: 'base64',
                ContentDisposition: 'inline',
                Body: buf
            };
            try {
                const data = await s3.putObject(params).promise();
                console.log(data);
                let obj = {
                    filename: fileName,
                    originalFilename: file.filename
                };
                req.companyPan = obj;
                req.upload = fileName;
                next()
            } catch (err) {
                console.log(err);
                unlinkFile(req.uploads);
                return res.status(500).send({
                    error: err
                });
            }
        } else {
            unlinkFile(req.uploads);
            return res.status(422).json({
                error: "Company pan should be in jpg, jpeg, pdf and png formate!"
            });
        }
    } else {
        unlinkFile(req.uploads);
        return res.status(422).json({
            error: "File name and data can't be empty!"
        });
    }
}

// Upload Company Address Proof in S3 Bucket
module.exports.updateCompanyAddressProof = async (req, res, next) => {
    const file = req.body.companyAddressProof;
    const ext = file.fileData.split(';')[0].split('/')[1]
    if (file.fileData && file.filename) {
        if ((file.filename).match(regx)) {
            let fileName = "company_address_proof_" + crypto.randomBytes(16).toString("hex") + "." + ext;
            console.log(fileName)
            let buf = Buffer.from(file.fileData.replace(/^(data:application|data:image)\/[a-z]+;base64,/, ""), 'base64')
            console.log(buf)
            let params = {
                Bucket: 'sme-testing',
                Key: fileName,
                ContentEncoding: 'base64',
                ContentDisposition: 'inline',
                // ContentType: 'application/pdf',
                Body: buf
            };
            try {
                const data = await s3.putObject(params).promise();
                console.log(data);
                let obj = {
                    filename: fileName,
                    originalFilename: file.filename
                };
                req.companyAddressProof = obj;
                req.upload = fileName;
                next()
            } catch (err) {
                console.log(err);
                unlinkFile(req.uploads);
                return res.status(500).send({
                    error: err
                });
            }
        } else {
            unlinkFile(req.uploads);
            return res.status(422).json({
                error: "Company address proof should be in jpg, jpeg, pdf and png formate!"
            });
        }
    } else {
        unlinkFile(req.uploads);
        return res.status(422).json({
            error: "File name and data can't be empty!"
        });
    }
}

// Upload Director Pan in S3 Bucket
module.exports.updateDirectorPan = async (req, res, next) => {
    var file = req.body.directorPan;
    const ext = file.fileData.split(';')[0].split('/')[1]
    if (file.fileData && file.filename) {
        if ((file.filename).match(regx)) {
            let fileName = "director_pan_" + crypto.randomBytes(16).toString("hex") + "." + ext;
            console.log(fileName)
            let buf = Buffer.from(file.fileData.replace(/^(data:application|data:image)\/[a-z]+;base64,/, ""), 'base64')
            console.log(buf)
            let params = {
                Bucket: 'sme-testing',
                Key: fileName,
                ContentEncoding: 'base64',
                ContentDisposition: 'inline',
                Body: buf
            };
            try {
                const data = await s3.putObject(params).promise();
                console.log(data);
                let obj = {
                    filename: fileName,
                    originalFilename: file.filename
                };
                req.directorPan = obj;
                req.upload = fileName;
                next()
            } catch (err) {
                console.log(err);
                unlinkFile(req.uploads);
                return res.status(500).send({
                    error: err
                });
            }
        } else {
            unlinkFile(req.uploads);
            return res.status(422).json({
                error: "Director pan should be in jpg, jpeg, pdf and png formate!"
            });
        }
    } else {
        unlinkFile(req.uploads);
        return res.status(422).json({
            error: "File name and data can't be empty!"
        });
    }
}