const { removeFromQueue } = require("../queue/signalQueue");
const Signal = require("../models/Signal");
const Incident = require("../models/Incident");
const { incrementSignals } = require("../utils/metrics");

// store recent signals for debouncing
const debounceMap = new Map();

function getSeverity(componentId) {
    if (componentId.includes("DB")) return "CRITICAL";
    if (componentId.includes("CACHE")) return "WARNING";
    if (componentId.includes("API")) return "HIGH";
    return "INFO";
}

function processQueue(io) {
    setInterval(async () => {
        const signal = removeFromQueue();
        if (!signal) return;

        incrementSignals(); // increment metrics

        const key = signal.componentId;
        const now = Date.now();
        const severity = getSeverity(key);

        try {
            // check debounce
            if (debounceMap.has(key)) {
                const entry = debounceMap.get(key);

                if (now - entry.timestamp < 10000) {
                    // within 10 sec → attach to same incident
                    const newSignal = await Signal.create({
                        componentId: signal.componentId,
                        message: signal.message,
                        severity: signal.severity || severity,
                        incidentId: entry.incidentId
                    });

                    io.emit("signal_added", {
                        incidentId: entry.incidentId,
                        signal: newSignal
                    });
                    return;
                }
            }

            // create new incident
            const incident = new Incident({
                componentId: key,
                status: "OPEN",
                severity: severity,
                startTime: new Date()
            });

            await incident.save();

            io.emit("incident_created", incident);

            // save signal separately with incidentId
            await Signal.create({
                componentId: signal.componentId,
                message: signal.message,
                severity: signal.severity || severity,
                incidentId: incident._id
            });

            // update debounce map
            debounceMap.set(key, {
                timestamp: now,
                incidentId: incident._id
            });
        } catch (err) {
            console.error("Error processing signal:", err.message);
        }

    }, 100); // process every 100ms
}

module.exports = processQueue;