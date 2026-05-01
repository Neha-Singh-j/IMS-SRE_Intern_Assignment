let signalCount = 0;

function incrementSignals() {
    signalCount++;
}

function getMetrics() {
    return {
        signalsPerSec: signalCount
    };
}

// reset every second
setInterval(() => {
    signalCount = 0;
}, 1000);

module.exports = { incrementSignals, getMetrics };