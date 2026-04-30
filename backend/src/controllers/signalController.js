const { addToQueue } = require("../queue/signalQueue");
const Signal = require("../models/Signal");
const Incident = require("../models/Incident");
const RCA = require("../models/RCA");
const { canTransition } = require("../utils/stateMachine");

exports.ingestSignal = async (req, res) => {
    try {
        addToQueue(req.body);
        res.status(202).json({ message: "Signal queued" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getIncidents = async (req, res) => {
    try {
        const incidents = await Incident.find().sort({ startTime: -1 }).limit(100);
        res.json({ count: incidents.length, incidents });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getSignalsByIncident = async (req, res) => {
    try {
        const { incidentId } = req.params;
        const signals = await Signal.find({ incidentId }).sort({ timestamp: -1 });
        res.json(signals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getIncidentDetail = async (req, res) => {
    try {
        const { incidentId } = req.params;
        const incident = await Incident.findById(incidentId);
        if (!incident) {
            return res.status(404).json({ error: "Incident not found" });
        }
        const signals = await Signal.find({ incidentId }).sort({ timestamp: -1 });
        res.json({ incident, signals });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createRCA = async (req, res) => {
    try {
        const { incidentId } = req.params;
        const incident = await Incident.findById(incidentId);
        if (!incident) {
            return res.status(404).json({ error: "Incident not found" });
        }
        
        const rca = await RCA.create({
            incidentId: incidentId,
            rootCause: req.body.rootCause || "Under investigation",
            fix: req.body.fix || "Pending",
            prevention: req.body.prevention || "To be determined",
            startTime: req.body.startTime || new Date(),
            endTime: req.body.endTime || new Date()
        });

        res.json({ message: "RCA created", rca });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const incident = await Incident.findById(req.params.incidentId);

        if (!incident) {
            return res.status(404).json({ error: "Incident not found" });
        }

        // Check valid state transition
        if (!canTransition(incident.status, status)) {
            return res.status(400).json({
                error: `Cannot transition from ${incident.status} to ${status}`
            });
        }

        // CRITICAL: Cannot close without RCA
        if (status === "CLOSED") {
            const rca = await RCA.findOne({ incidentId: incident._id });

            if (!rca) {
                return res.status(400).json({
                    error: "Cannot close incident without RCA. Create RCA first."
                });
            }

            // Calculate MTTR (in milliseconds)
            const mttr = new Date(rca.endTime) - new Date(incident.startTime);
            incident.mttr = mttr;
            incident.endTime = rca.endTime;
        }

        incident.status = status;
        await incident.save();

        res.json({ message: "Status updated", incident });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};