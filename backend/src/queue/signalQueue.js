const queue = [];

function addToQueue(signal) {
    queue.push(signal);
}

function getQueue() {
    return queue;
}

function removeFromQueue() {
    return queue.shift();
}

module.exports = {
    addToQueue,
    getQueue,
    removeFromQueue
};