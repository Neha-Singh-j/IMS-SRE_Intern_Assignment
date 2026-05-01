import { useEffect, useState } from 'react';
import { fetchIncidents } from '../services/api';
import socket from '../services/socket';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function LiveFeed() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    const loadIncidents = async () => {
      setLoading(false);
      const data = await fetchIncidents();
      setIncidents(data.incidents || []);
    };
    loadIncidents();
    const interval = setInterval(loadIncidents, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    socket.on("incident_created", (data) => {
      setIncidents(prev => [data, ...prev]);
    });

    socket.on("signal_added", (data) => {
      console.log("New signal:", data);
      // Optionally update incidents if needed
    });

    socket.on("metrics", (data) => {
      setDataPoints(prev => [...prev.slice(-10), data.signalsPerSec]);
    });

    return () => {
      socket.off("incident_created");
      socket.off("signal_added");
      socket.off("metrics");
    };
  }, []);

  const criticalCount = incidents.filter(i => i.severity === 'CRITICAL').length;
  const throughput = incidents.length > 0 ? (incidents.length * 20) : 0;

  return (
    <div className="page-content">
      <div className="panel">
        <div className="panel-header">
          <h2>Live Feed</h2>
          <p>Realtime signal ingestion and event stream.</p>
        </div>
        <div className="feed-grid">
          <div className="metric-card">
            <strong>Active Alerts</strong>
            <span>{criticalCount}</span>
          </div>
          <div className="metric-card">
            <strong>Total Incidents</strong>
            <span>{incidents.length}</span>
          </div>
          <div className="metric-card">
            <strong>Throughput</strong>
            <span>{throughput} events/min</span>
          </div>
        </div>
        <div className="metrics-chart">
          <h3>Signals per Second</h3>
          <Line
            data={{
              labels: dataPoints.map((_, i) => i),
              datasets: [{
                label: 'Signals/sec',
                data: dataPoints,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Real-time Signal Rate' }
              }
            }}
          />
        </div>
        <div className="panel-content">
          {incidents.length > 0 ? (
            <div>
              <h3>Recent Incidents</h3>
              <ul className="impact-list">
                {incidents.slice(0, 10).map((incident) => (
                  <li key={incident._id}>
                    <strong>{incident.componentId}</strong>
                    <span>{incident.severity} | {incident.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No incidents yet. Send a signal via POST /signal to trigger incident creation.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LiveFeed;

