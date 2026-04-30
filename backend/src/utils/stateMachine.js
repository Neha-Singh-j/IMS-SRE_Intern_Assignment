const allowedTransitions = {
    OPEN: ["INVESTIGATING"],
    INVESTIGATING: ["RESOLVED"],
    RESOLVED: ["CLOSED"],
    CLOSED: []
};

function canTransition(current, next) {
    return allowedTransitions[current]?.includes(next);
}

function getNextStates(current) {
    return allowedTransitions[current] || [];
}

module.exports = { canTransition, getNextStates };
