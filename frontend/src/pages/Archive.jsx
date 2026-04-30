import { useEffect, useState } from 'react';
import { fetchIncidents } from '../services/api';

function Archive() {
  const [incidents, setIncidents] = useState([]);
  const [closedIncidents, setClosedIncidents] = useState([]);

  useEffect(() => {
    const loadIncidents = async () => {
      const data = await fetchIncidents();
      const allIncidents = data.incidents || [];
      const closed = allIncidents.filter(i => i.status === 'CLOSED');
      setIncidents(allIncidents);
      setClosedIncidents(closed);
    };
    loadIncidents();
  }, []);

  return (
    <div className="page-content">
      <div className="panel">
        <div className="panel-header">
          <h2>Archive</h2>
          <p>Past incidents and historical signal records.</p>
        </div>
        <div className="feed-grid">
          <div className="metric-card">
            <strong>Total Incidents</strong>
            <span>{incidents.length}</span>
          </div>
          <div className="metric-card">
            <strong>Closed</strong>
            <span>{closedIncidents.length}</span>
          </div>
          <div className="metric-card">
            <strong>Open</strong>
            <span>{incidents.length - closedIncidents.length}</span>
          </div>
        </div>
        <div className="panel-content">
          {closedIncidents.length > 0 ? (
            <div>
              <h3>Closed Incidents</h3>
              <ul className="impact-list">
                {closedIncidents.map((incident) => (
                  <li key={incident._id}>
                    <strong>{incident.componentId}</strong>
                    <span>{incident.severity}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No closed incidents in archive yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Archive;

