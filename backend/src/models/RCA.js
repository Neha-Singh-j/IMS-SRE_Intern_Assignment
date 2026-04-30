const mongoose = require("mongoose");

const rcaSchema = new mongoose.Schema({
    incidentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Incident"
    },
    rootCause: String,
    fix: String,
    prevention: String,
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model("RCA", rcaSchema);
