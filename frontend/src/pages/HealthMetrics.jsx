import { useEffect, useState } from 'react';
import { fetchIncidents } from '../services/api';

function HealthMetrics() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIncidents = async () => {
      setLoading(false);
      const data = await fetchIncidents();
      setIncidents(data.incidents || []);
    };
    loadIncidents();
  }, []);

  const openIncidents = incidents.filter(i => i.status === 'OPEN').length;
  const criticality = incidents.filter(i => i.severity === 'CRITICAL').length > 0 ? 'Degraded' : 'Healthy';
  const errorRate = incidents.length > 0 ? ((incidents.filter(i => i.severity === 'CRITICAL').length / incidents.length) * 100).toFixed(1) : '0';

  return (
    <div className="page-content">
      <div className="panel">
        <div className="panel-header">
          <h2>Health & Metrics</h2>
          <p>System health dashboards and key metrics.</p>
        </div>
        <div className="feed-grid">
          <div className="metric-card">
            <strong>System Health</strong>
            <span>{criticality}</span>
          </div>
          <div className="metric-card">
            <strong>Open Incidents</strong>
            <span>{openIncidents}</span>
          </div>
          <div className="metric-card">
            <strong>Critical Rate</strong>
            <span>{errorRate}%</span>
          </div>
        </div>
        <div className="panel-content">
          {incidents.length > 0 ? (
            <p>System is currently monitoring {incidents.length} incident(s). {openIncidents} are still open.</p>
          ) : (
            <p>All systems nominal. No active incidents detected.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default HealthMetrics;

