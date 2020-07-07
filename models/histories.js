const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const historySchema = new Schema({
    borrowerId: {
        trim: true,
        type: Schema.Types.ObjectId,
        ref: "Borrowers",
        required: [true, "Borrower's ID is required"]
    },
    loanId: {
        trim: true,
        type: Schema.Types.ObjectId,
        ref: "Loans"
    },
    userId: {
        trim: true,
        type: Schema.Types.ObjectId,
        ref: "Borrowers",
    },
    oldDescription: {
        trim: true,
        type: String,
        required: [true, "Old description is required"]
    },
    newDescription: {
        trim: true,
        type: String,
        required: [true, "New description is required"]
    },
    operation: {
        trim: true,
        type: String,
        // enum: ["Assign", "Escalate", "Complete", "AutoCreate", "AutoCreate Off", "Change Title", "Change Detail", "Change TargetDate", "Change Days"],
        require: [true, "Operation is required"]
    }
}, {
    timestamps: true
});

Histories = mongoose.model("Histories", historySchema);

module.exports = Histories