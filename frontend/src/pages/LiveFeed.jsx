import { useEffect, useState } from 'react';
import { fetchIncidents } from '../services/api';

function LiveFeed() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

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

