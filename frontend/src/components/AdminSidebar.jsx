import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminSidebar.css';

const menuItems = [
  { label: 'Dashboard', icon: '📊', to: '/admin' },
  { label: 'Bookings',  icon: '📅', to: '/admin/bookings' },
  { label: 'Customers', icon: '👥', to: '/admin/customers' },
  { label: 'Services',  icon: '🔧', to: '/admin/services' },
];

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) =>
    path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8L8 2L14 8L8 14L2 8Z" fill="white" opacity=".9"/>
            <circle cx="8" cy="8" r="2.5" fill="white"/>
          </svg>
        </div>
        <div>
          <div className="sidebar-brand">FUCHSIUS</div>
          <div className="sidebar-brand-sub">Admin Portal</div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="sidebar-section-label">Main</div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`sidebar-item ${isActive(item.to) ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-divider" />

      {/* User Info */}
      <div className="sidebar-user">
        <div className="sidebar-avatar">
          {user?.username?.slice(0, 2).toUpperCase()}
        </div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{user?.username}</div>
          <div className="sidebar-user-role">Administrator</div>
        </div>
      </div>

      {/* Logout Button */}
      <button className="sidebar-item logout" onClick={handleLogout}>
        <span className="sidebar-icon">🔒</span>
        <span>Logout</span>
      </button>
    </aside>
  );
}