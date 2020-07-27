const Histories = require("../../../models/histories");
const Students = require("../../../models/students");
const { check, validationResult } = require("express-validator");


/* Fetch all home page's details */
module.exports.fetchHomeDetails = async (req, res, next) => {
    const aggregateLoans = [
        {
            "$facet": {
                "Pending": [
                    { "$match": { status: "Pending" } },
                    { "$count": "Pending" },
                ],
                "Assigned": [
                    { "$match": { status: "Assigned" } },
                    { "$count": "Assigned" },
                ],
                "ApprovedByAdmin": [
                    { "$match": { status: "ApprovedByAdmin" } },
                    { "$count": "ApprovedByAdmin" },
                ],
                "DisbursedAmount": [
                    { "$match": { $or: [{ status: "Disbursed" }, { status: "Completed" }] } },
                    {
                        "$group": {
                            "_id": null,
                            "totalAmount": {
                                "$sum": "$disbursedAmount"
                            }
                        }
                    }
                ],
                "RunningAmount": [
                    { "$match": { status: "Disbursed" } },
                    { "$unwind": "$emi" },
                    { "$match": { 'emi.status': "Pending" } },
                    {
                        "$group": {
                            "_id": null,
                            "totalAmount": {
                                "$sum": "$emi.totalRepaymentAmount"
                            }
                        }
                    }
                ],
                "RecoveredAmount": [
                    { "$match": { status: "Completed" } },
                    { "$unwind": "$emi" },
                    { "$match": { 'emi.status': "Paid" } },
                    {
                        "$group": {
                            "_id": null,
                            "totalAmount": {
                                "$sum": "$emi.paidAmount"
                            }
                        }
                    }
                ],
            }
        },
        // {
        //     "$project": {
        //         "Pending": { "$arrayElemAt": ["$Pending.Pending", 0] },
        //         "TodayPending": { "$arrayElemAt": ["$TodayPending.TodayPending", 0] },
        //         "Overdue": { "$arrayElemAt": ["$Overdue.Overdue", 0] },
        //         "Escalated": { "$arrayElemAt": ["$Escalated.Escalated", 0] },
        //         "Completed": { "$arrayElemAt": ["$Completed.Completed", 0] },
        //         "Created": { "$arrayElemAt": ["$Created.Created", 0] }
        //     }
        // }
    ]
    try {
        // const loansCount = await Students.aggregate(aggregateLoans)
        const studentsCount = await Students.count()
        res.status(200).send({
            success: true,
            studentsCount: studentsCount,
        });
    } catch (error) {
        console.log(error);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
}