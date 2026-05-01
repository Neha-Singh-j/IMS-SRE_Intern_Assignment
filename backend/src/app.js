const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*" }
});

app.set("io", io);

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

const { ingestSignal, getIncidents, getSignalsByIncident, getIncidentDetail, createRCA, updateStatus } = require("./controllers/signalController");
app.post("/signal", ingestSignal);
app.get("/incidents", getIncidents);
app.get("/incidents/:incidentId", getIncidentDetail);
app.get("/incidents/:incidentId/signals", getSignalsByIncident);
app.post("/incidents/:incidentId/rca", createRCA);
app.patch("/incidents/:incidentId/status", updateStatus);
const { getMetrics } = require("./utils/metrics");
const processQueue = require("./services/processor");

processQueue(io);

// Emit metrics every 2 seconds
setInterval(() => {
    io.emit("metrics", getMetrics());
}, 2000);

app.get("/health", (req, res) => {
    res.json({ status: "OK" });
});

const port = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.warn('Warning: MONGO_URI is not set in .env. MongoDB connection will fail until you configure it.');
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});