import { useEffect, useState } from 'react';
import { fetchIncidents } from '../services/api';

function RCAWorkspace() {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    const loadIncidents = async () => {
      const data = await fetchIncidents();
      if (data.incidents && data.incidents.length > 0) {
        setIncidents(data.incidents);
        setSelectedIncident(data.incidents[0]);
      }
    };
    loadIncidents();
  }, []);

  return (
    <div className="page-content">
      <div className="panel">
        <div className="panel-header">
          <h2>RCA Workspace</h2>
          <p>Investigation workspace for root cause analysis.</p>
        </div>
        {selectedIncident ? (
          <div className="panel-content">
            <h3>Analyzing: {selectedIncident.componentId}</h3>
            <p><strong>Severity:</strong> {selectedIncident.severity}</p>
            <p><strong>Status:</strong> {selectedIncident.status}</p>
            <p><strong>Started:</strong> {new Date(selectedIncident.startTime).toLocaleString()}</p>
            <p>Use this workspace to correlate logs, service dependencies, and timeline correlations for root cause analysis.</p>
          </div>
        ) : (
          <div className="panel-content">
            <p>No incidents available for analysis. Create one by sending a signal via POST /signal.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RCAWorkspace;

