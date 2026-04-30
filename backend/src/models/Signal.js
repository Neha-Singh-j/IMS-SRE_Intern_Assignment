const mongoose = require("mongoose");

const signalSchema = new mongoose.Schema({
    componentId: String,
    message: String,
    severity: String,
    timestamp: { type: Date, default: Date.now },
    incidentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Incident"
    }
});

module.exports = mongoose.model("Signal", signalSchema);
