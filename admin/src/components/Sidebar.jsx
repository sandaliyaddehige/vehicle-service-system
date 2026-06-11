import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const NAV = [
  { to: '/',          icon: '📊', label: 'Dashboard' },
  { to: '/bookings',  icon: '📅', label: 'Bookings' },
  { to: '/customers', icon: '👥', label: 'Customers' },
  { to: '/services',  icon: '🔧', label: 'Services' },
];
const CONFIG = [

];

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  const active = (to) => to === '/' ? pathname === '/' : pathname.startsWith(to);

  return (
    <aside className="sidebar-fixed">
      {/* Logo */}
      <div className="sb-logo">
        <div className="sb-logo-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8L8 2L14 8L8 14L2 8Z" fill="white" opacity=".9"/>
            <circle cx="8" cy="8" r="2.5" fill="white"/>
          </svg>
        </div>
        <div>
          <div className="sb-brand">FUCHSIUS</div>
          <div className="sb-sub">Admin Portal</div>
        </div>
      </div>

      {/* Main nav */}
      <div className="sb-section">Main</div>
      <nav className="sb-nav">
        {NAV.map(({ to, icon, label }) => (
          <Link key={to} to={to} className={`sb-item ${active(to) ? 'active' : ''}`}>
            <span className="sb-icon">{icon}</span>
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="sb-divider" />
      <div className="sb-section">Config</div>
      <nav className="sb-nav">
        {CONFIG.map(({ to, icon, label }) => (
          <Link key={to} to={to} className={`sb-item ${active(to) ? 'active' : ''}`}>
            <span className="sb-icon">{icon}</span>
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom: user + logout */}
      <div style={{ marginTop: 'auto' }}>
        <div className="sb-divider" />
        {admin && (
          <div className="sb-user">
            <div className="sb-avatar">{admin.username?.slice(0,2).toUpperCase()}</div>
            <div>
              <div className="sb-uname">{admin.username}</div>
              <div className="sb-urole">Administrator</div>
            </div>
          </div>
        )}
        <button className="sb-item sb-logout" onClick={() => { logout(); navigate('/login'); }}>
          <span className="sb-icon">🔒</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
