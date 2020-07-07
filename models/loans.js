const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const config = require("../config")
const { roundOf } = require("../routes/utility/Commons/functions");

/* Emi Details*/
const emiSchema = new Schema({
    totalRepaymentAmount: {
        trim: true,
        type: Number,
        required: [true, "Emi's Total Repayment is required"]
    },
    extensionCharge: {
        trim: true,
        type: Number,
        default: 0,
        required: [true, "Emi's Extension Charge Repayment is required"]
    },
    status: {
        trim: true,
        type: String,
        enum: ["Pending", "Paid"],    // Retuenn from Borrower
        required: [true, "Emi's status is required"]
    },
    dueDate: {
        trim: true,
        type: Date,
    },
    extensionDate1: {
        trim: true,
        type: Date,
    },
    extensionDate2: {
        trim: true,
        type: Date,
    },
    extensionDate3: {
        trim: true,
        type: Date,
    },
    paidDate: {
        trim: true,
        type: Date,
    },
    paidAmount: {
        trim: true,
        type: Number,
    }
})

/* Transaction details of PMX Account */
const TRANSACTION = {
    OrderID: {
        trim: true,
        type: String
    },
    ErrorCode: {
        trim: true,
        type: String
    },
    ErrorDescription: {
        trim: true,
        type: String
    },
    bookingResponce: {
        TransactionRefNo: {
            trim: true,
            type: String
        },
        OrderID: String
    },
    approvedResponse: {
        TransactionStatus: {
            trim: true,
            type: String
        },
        TransactionMessage: {
            trim: true,
            type: String
        },
        BankRefNo: {
            trim: true,
            type: String
        },
        IsBankResponse: {
            trim: true,
            type: String
        },
        TransactionRefNo: {
            trim: true,
            type: String
        },
        OrderID: {
            trim: true,
            type: String
        },
        Amount: {
            trim: true,
            type: String
        },
        CustomerName: {
            trim: true,
            type: String
        },
        CustomerAccountNumber: {
            trim: true,
            type: String
        }
    }
}

const loanSchema = new Schema({
    borrowerId: {
        trim: true,
        type: Schema.Types.ObjectId,
        ref: "Borrowers",
        required: [true, "Borrower ID is required"]
    },
    lenderId: {
        trim: true,
        type: Schema.Types.ObjectId,
        ref: "Lenders"
    },
    repaymentDay: {
        trim: true,
        type: Number,
        default: 15,
        enum: [05, 15, 25],
        required: [true, "Repayment day is required"]
    },
    principal: {
        trim: true,
        type: Number,
        required: [true, "Principle is required"]
    },
    totalInterestRate: {
        type: Number,
        required: true,
        default: roundOf(config.TOTAL_INTEREST),
        required: [true, "Total Interest is required"]
    },
    totalInterestAmount: {
        type: Number,
        required: true,
        default: roundOf(config.TOTAL_INTEREST),
        required: [true, "Total Interest amount is required"]
    },
    totalRepaymentAmount: {
        type: Number,
        required: true,
        required: [true, "Total repayment is required"]
    },
    disbursedAmount: {
        type: Number,
        required: true,
        required: [true, "Disbursed amount is required"]
    },
    lenderInterestRate: {
        type: Number,
        required: true,
        default: roundOf(config.LENDER_INTEREST),
        required: [true, "Lender Interest Rate is required"]
    },
    companyInterestRate: {
        type: Number,
        required: true,
        default: roundOf(config.TOTAL_INTEREST),
        required: [true, "Company Interest Rate is required"]
    },
    lenderInterestAmount: {
        type: Number,
        required: true,
        required: [true, "Lender Interest Amount is required"]
    },
    companyInterestAmount: {
        type: Number,
        required: true,
        required: [true, "Company Interest Amount is required"]
    },
    status: {
        trim: true,
        type: String,
        enum: ["Pending", "RejectedByAdmin", "ApprovedByAdmin", "Assigned", "ApprovedByFI", "RejectedByFI", "Disbursed", "Completed", "Defaulted"],
        required: [true, "Loan Status is required"]
    },
    globalComment: {
        trim: true,
        type: String,
        validate(value) {
            if (value.length < 0 || value.length > 300) {
                throw new Error("Global Comment should be less than 300 characters!");
            }
        }
    },
    internalComment: {
        trim: true,
        type: String,
        validate(value) {
            if (value.length < 0 || value.length > 300) {
                throw new Error("Internal Comment should be less than 300 characters!");
            }
        }
    },
    appliedTimestamp: {
        trim: true,
        type: Date,
        default: Date.now,
        required: [true, "Applied Timestamp is required"]
    },
    RejectedByAdminTimestamp: {
        trim: true,
        type: Date,
    },
    ApprovedByAdminTimestamp: {
        trim: true,
        type: Date,
    },
    AssignedTimestamp: {
        trim: true,
        type: Date,
    },
    ApprovedByFITimestamp: {
        trim: true,
        type: Date,
    },
    RejectedByFITimestamp: {
        trim: true,
        type: Date,
    },
    disbursedTimestamp: {
        trim: true,
        type: Date,
    },
    completedTimestamp: {
        trim: true,
        type: Date,
    },
    bookingTimestamp: {
        trim: true,
        type: Date,
    },
    deletedTimestamp: {
        trim: true,
        type: Date,
    },
    defaultedTimestamp: {
        trim: true,
        type: Date,
    },
    loanType: {
        trim: true,
        type: String,
        enum: ["CreditLine", "Term"],
        required: [true, "Loan type is required"],
    },
    emiCount: {
        type: Number,
        default: 1,
        required: [true, "Emi Count is required"],
    },
    emi: [emiSchema],
    transaction: TRANSACTION
},
    {
        timestamps: true
    }
);

const Loans = mongoose.model("Loans", loanSchema);

module.exports = Loans;