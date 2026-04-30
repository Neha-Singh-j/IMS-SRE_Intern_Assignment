import { BrowserRouter, NavLink, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import IncidentDetail from './pages/IncidentDetail.jsx';
import LiveFeed from './pages/LiveFeed.jsx';
import RCAWorkspace from './pages/RCAWorkspace.jsx';
import HealthMetrics from './pages/HealthMetrics.jsx';
import Archive from './pages/Archive.jsx';
import Settings from './pages/Settings.jsx';

const navItems = [
  { path: '/incident-detail', label: 'Incident Detail' },
  { path: '/live-feed', label: 'Live Feed' },
  { path: '/rca-workspace', label: 'RCA Workspace' },
  { path: '/health-metrics', label: 'Health & Metrics' },
  { path: '/archive', label: 'Archive' },
  { path: '/settings', label: 'Settings' }
];

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar items={navItems} />
        <div className="main-panel">
          <Topbar />
          <div className="page-frame">
            <Routes>
              <Route path="/" element={<Navigate to="/incident-detail" replace />} />
              <Route path="/incident-detail" element={<IncidentDetail />} />
              <Route path="/live-feed" element={<LiveFeed />} />
              <Route path="/rca-workspace" element={<RCAWorkspace />} />
              <Route path="/health-metrics" element={<HealthMetrics />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
