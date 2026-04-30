import { NavLink } from 'react-router-dom';

function Sidebar({ items }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-badge">INCIDENT</span>
        <span>OS</span>
      </div>
      <div className="status-card">
        <div className="status-dot status-ok" />
        <div>
          <p>OPS_COMMAND</p>
          <small>All Systems Nominal</small>
        </div>
      </div>
      <nav className="nav-list">
        {items.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p>Documentation</p>
      </div>
    </aside>
  );
}

export default Sidebar;
