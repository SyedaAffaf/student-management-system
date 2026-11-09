import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
        <div className="brand">Student Manager</div>
        <nav>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/students" end>All students</NavLink>
          {isAdmin && <NavLink to="/students/new">Add student</NavLink>}
        </nav>
      </aside>
      <div className="main">
        <header className="topbar">
          <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle menu">☰</button>
          <div className="who">
            <span>{user.name}</span>
            <span className={`badge ${user.role}`}>{user.role}</span>
            <button className="btn ghost" onClick={handleLogout}>Log out</button>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
