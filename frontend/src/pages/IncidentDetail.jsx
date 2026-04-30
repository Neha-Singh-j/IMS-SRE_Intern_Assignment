import { useEffect, useState } from 'react';
import { fetchIncidents, fetchIncidentSignals, startRCA } from '../services/api';

function IncidentDetail() {
  const [incidents, setIncidents] = useState([]);
  const [signals, setSignals] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rcaStarting, setRcaStarting] = useState(false);

  useEffect(() => {
    const loadIncidents = async () => {
      setLoading(true);
      const data = await fetchIncidents();
      if (data.incidents && data.incidents.length > 0) {
        setIncidents(data.incidents);
        setSelectedIncident(data.incidents[0]);
        const incidentSignals = await fetchIncidentSignals(data.incidents[0]._id);
        setSignals(incidentSignals);
      }
      setLoading(false);
    };
    loadIncidents();
  }, []);

  const handleIncidentSelect = async (incident) => {
    setSelectedIncident(incident);
    const incidentSignals = await fetchIncidentSignals(incident._id);
    setSignals(incidentSignals);
  };

  const handleStartRCA = async () => {
    if (!selectedIncident) return;
    setRcaStarting(true);
    try {
      await startRCA(selectedIncident._id, {
        rootCause: "System analysis in progress",
        fix: "Pending investigation",
        prevention: "Under review"
      });
      alert('RCA started and incident closed!');
      // Reload incidents
      const data = await fetchIncidents();
      if (data.incidents) setIncidents(data.incidents);
    } catch (error) {
      alert('Error starting RCA: ' + error.message);
    }
    setRcaStarting(false);
  };

  if (loading) {
    return <div className="page-content"><p>Loading incidents...</p></div>;
  }

  if (!selectedIncident) {
    return <div className="page-content"><p>No incidents found. Send a signal via POST /signal to create one.</p></div>;
  }

  return (
    <div className="incident-page">
      <section className="hero-panel">
        <div>
          <div className="tag critical">{selectedIncident.severity || 'UNKNOWN'}</div>
          <h1>{selectedIncident._id}</h1>
          <p>Component: {selectedIncident.componentId} | Status: {selectedIncident.status}</p>
        </div>
        <div className="hero-actions">
          <button className="button-secondary">Export Logs</button>
          <button className="button-primary" onClick={handleStartRCA} disabled={rcaStarting}>
            {rcaStarting ? 'Starting RCA...' : 'Start RCA'}
          </button>
        </div>
      </section>

      <div className="grid two-col">
        <div className="panel">
          <div className="panel-header">
            <h2>Signal Timeline</h2>
            <span>{signals.length} signals captured</span>
          </div>
          <div className="timeline-list">
            {signals.length > 0 ? (
              signals.map((signal, idx) => (
                <article key={idx} className="timeline-event">
                  <div className="timeline-label">
                    {new Date(signal.timestamp).toLocaleTimeString()}
                  </div>
                  <div>
                    <h3>{signal.message}</h3>
                    <pre>{JSON.stringify({ componentId: signal.componentId, severity: signal.severity }, null, 2)}</pre>
                  </div>
                </article>
              ))
            ) : (
              <p style={{ color: '#7b88a2' }}>No signals for this incident yet</p>
            )}
          </div>
        </div>

        <aside className="side-column">
          <div className="panel status-panel">
            <h3>Processing Status</h3>
            <div className="status-bar">
              <div className="status-step completed">Triage</div>
              <div className="status-step active">{selectedIncident.status}</div>
            </div>
          </div>

          <div className="panel">
            <h3>Recent Incidents</h3>
            <ul className="impact-list">
              {incidents.map((inc) => (
                <li key={inc._id} onClick={() => handleIncidentSelect(inc)} style={{ cursor: 'pointer' }}>
                  <strong>{inc.componentId}</strong>
                  <span>{inc.severity}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default IncidentDetail;

