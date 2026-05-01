# 🚀 Incident Management System (IMS)

A **production-inspired, real-time Incident Management System** designed to monitor distributed systems, process high-volume signals, and manage incident workflows with mandatory Root Cause Analysis (RCA).

---

# 🧠 📌 Overview

This system simulates a **mission-critical monitoring platform** capable of handling high-throughput signals (errors, latency spikes) from distributed services such as APIs, databases, caches, and queues.

The system:
• Ingests signals asynchronously
• Applies **debouncing logic** to prevent alert storms
• Creates structured incidents
• Enforces a strict **incident lifecycle workflow**
• Requires mandatory **Root Cause Analysis (RCA)** before closure
• Provides a **real-time dashboard** for monitoring

👉 Designed based on the given assignment requirements 

---

# 🏗️ 🧩 Architecture Diagram

<img width="1408" height="768" alt="WhatsApp Image 2026-05-01 at 8 27 31 PM" src="https://github.com/user-attachments/assets/0eeac3d8-5ddc-4607-9409-a0059ae6da89" />

---

# ⚙️ 🔄 System Workflow
<img width="848" height="576" alt="WhatsApp Image 2026-05-01 at 8 34 18 PM" src="https://github.com/user-attachments/assets/0b52b03e-b7b6-4403-80d7-92179a81eb74" />

---

# 🔥 🚀 Features

## ✅ Core Features

• High-throughput **Signal Ingestion API**
• **Async Queue-based Processing**
• **Debouncing Logic (10 sec window)**
• Incident creation with signal aggregation
• **Separate storage for Signals & Incidents**
• Real-time updates using **Socket.IO**

---

## 🧠 Workflow Engine

• State Machine implementation
• Allowed transitions:

* OPEN → INVESTIGATING → RESOLVED → CLOSED
  • Prevents invalid transitions

---

## 🚨 RCA Enforcement

• Incident **cannot be CLOSED without RCA**
• RCA includes:

* Root cause
* Fix applied
* Prevention steps

---

## ⏱️ MTTR Calculation

• Automatically calculated using:

* Start time (first signal)
* End time (RCA submission)

---

## 📊 Observability

• `/health` endpoint
• Real-time logs
• Signals/sec monitoring

---

## ⚡ Real-Time Features

• Live incident feed
• Signal timeline updates
• Dashboard auto-refresh via sockets

---

# 🗂️ 📁 Project Structure

```
IMS-SRE_Intern_Assignment/
 ├── backend/
 │   ├── src/
 │   │   ├── controllers/
 │   │   ├── models/
 │   │   ├── services/
 │   │   ├── queue/
 │   │   ├── utils/
 │   │   └── app.js
 │   ├── package.json
 │   └── package-lock.json
 │
 ├── frontend/
 │   ├── src/
 │   ├── package.json
 │   └── package-lock.json
 │
 ├── README.md
 ├── sample-data.json
```

---

# 🧪 🧩 API Endpoints

| Method | Endpoint                 | Description              |
| ------ | ------------------------ | ------------------------ |
| POST   | `/signal`                | Ingest signal            |
| GET    | `/incidents`             | Get all incidents        |
| GET    | `/incidents/:id/signals` | Get signals for incident |
| POST   | `/incidents/:id/rca`     | Create RCA               |
| PATCH  | `/incidents/:id/status`  | Update status            |
| GET    | `/health`                | Health check             |

---

# 🚀 ⚙️ Setup Instructions

## Backend

```bash
cd backend
npm install
npm run dev
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# 📊 🧪 Sample Data Simulation

Run:

```bash
npm run simulate
```

This generates high-frequency signals to test:
• debouncing
• queue processing
• real-time dashboard

---

# 🧠 ⚡ Backpressure Handling

The system uses an **in-memory queue** to decouple ingestion from processing.

✔ Prevents API blocking
✔ Handles burst traffic (10k signals/sec simulation)
✔ Ensures system stability even if DB is slow

---

# 🎨 💻 UI Features

• Live incident feed (sorted by severity)
• Incident detail view with signal timeline
• RCA workspace form
• Health & metrics dashboard
• Real-time logs and node health

---

# ⭐ Bonus Features

• Real-time updates using Socket.IO
• Severity classification engine
• System advisory (insight suggestions)
• Throughput monitoring

---

# 🏁 📌 Conclusion

This project demonstrates:
• Scalable system design
• Async processing
• Event-driven architecture
• Real-world incident management workflow

---

# 👩‍💻 Author

Neha Singh
BTech CSE Student

---
