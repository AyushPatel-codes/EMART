import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PortalLayout({ title, links, banner }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  return (
    <div className="portal">
      <aside className={`sidebar ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
        <h3>e<b>mart</b> <small style={{ fontSize: 12, fontWeight: 400 }}>{title}</small></h3>
        {links.map((l) => <NavLink key={l.to} to={l.to} end>{l.label}</NavLink>)}
      </aside>
      <div>
        <div className="ptop">
          <button className="menu" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
          <span>{user.name}</span>
          <button className="btn btn-outline btn-sm" onClick={async () => { await logout(); nav('/'); }}>Logout</button>
        </div>
        <main className="pmain">{banner}<Outlet /></main>
      </div>
    </div>
  );
}
