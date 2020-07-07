const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const feesSchema = new Schema({
    borrowerId: {
        trim: true,
        type: Schema.Types.ObjectId,
        ref: "Borrowers",
        required: [true, "Borrower's ID is required"]
    },
    amount: {
        trim: true,
        type: Number,
        required: [true, "Fees's Amount is required"]
    },
    description: {
        trim: true,
        type: String,
        required: [true, "Description is required"]
    },
    _paidMark: {
        trim: true,
        type: Boolean,
        default: false,
        required: [true, "_paidMark is required"]
    },
    paidTimestamp: {
        trim: true,
        type: Date,
    },
}, {
    timestamps: true
});

Fees = mongoose.model("Fees", feesSchema);

module.exports = Fees