const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
    componentId: String,
    status: { type: String, default: "OPEN" },
    severity: String,
    startTime: { type: Date, default: Date.now },
    endTime: Date,
    mttr: Number
});

module.exports = mongoose.model("Incident", incidentSchema);