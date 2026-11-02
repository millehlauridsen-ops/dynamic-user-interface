import { NavLink, Outlet } from 'react-router';

const links = [
  { to: '/', label: 'Overblik', end: true },
  { to: '/projekter', label: 'Projekter' },
  { to: '/indstillinger', label: 'Indstillinger' },
];

export default function AppLayout() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">F</span><span>Fællesrum<small>React workspace</small></span></div>
        <div className="nav-title">ARBEJDSRUM</div>
        <nav aria-label="Hovednavigation" className="nav">
          {links.map(({ to, label, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>{label}<span aria-hidden="true">↗</span></NavLink>)}
        </nav>
        <div className="sidebar-note"><strong>Ét fælles udgangspunkt</strong><p>Arbejd i samme repo, dokumentér beslutninger, og lad Codex følge AGENTS.md.</p></div>
      </aside>
      <div className="workspace">
        <header className="topbar"><span className="breadcrumbs">Arbejdsrum <span>/</span> Teamprojekt</span><span className="team-pill"><span className="team-dot"/> Fælles udvikling</span></header>
        <main id="main" className="main-content"><Outlet /></main>
        <footer className="footer">Bygget med React, Vite og React Router · Data gemmes lokalt i browseren</footer>
      </div>
    </div>
  );
}
