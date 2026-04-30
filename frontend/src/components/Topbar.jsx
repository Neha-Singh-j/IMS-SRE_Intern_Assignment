function Topbar() {
  return (
    <header className="topbar">
      <div className="search-field">
        <input placeholder="Search signals..." />
      </div>
      <div className="topbar-actions">
        <button className="icon-button">🔔</button>
        <button className="icon-button">🔍</button>
        <button className="icon-button">⚙️</button>
      </div>
    </header>
  );
}

export default Topbar;
