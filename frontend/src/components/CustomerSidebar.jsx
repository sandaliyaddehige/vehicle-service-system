import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CustomerSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8L8 2L14 8L8 14L2 8Z" fill="white" opacity=".9"/>
            <circle cx="8" cy="8" r="2.5" fill="white"/>
          </svg>
        </div>
        <div>
          <div className="sidebar-brand">FUCHSIUS</div>
          <div className="sidebar-brand-sub">Customer Portal</div>
        </div>
      </div>

      <div className="sidebar-section-label">Main Portal</div>
      <nav className="sidebar-nav">
        <Link
          to="/my-bookings"
          className={`sidebar-item ${isActive('/my-bookings') ? 'active' : ''}`}
        >
          <span className="sidebar-icon">📅</span>
          <span>My Bookings</span>
        </Link>
        <Link
          to="/book"
          className={`sidebar-item ${isActive('/book') ? 'active' : ''}`}
        >
          <span className="sidebar-icon">🔧</span>
          <span>Book a Service</span>
        </Link>
      </nav>

      <div className="sidebar-divider" />
      <div className="sidebar-section-label">General</div>
      <nav className="sidebar-nav">
        <Link to="/" className="sidebar-item">
          <span className="sidebar-icon">🏠</span>
          <span>Home Page</span>
        </Link>
        <Link to="/services" className="sidebar-item">
          <span className="sidebar-icon">🛠️</span>
          <span>Services</span>
        </Link>
        <Link to="/contact" className="sidebar-item">
          <span className="sidebar-icon">📞</span>
          <span>Contact Us</span>
        </Link>
      </nav>

      <div className="sidebar-divider" />

      <div className="sidebar-user">
        <div className="sidebar-avatar">
          {user?.username?.slice(0, 2).toUpperCase()}
        </div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{user?.username}</div>
          <div className="sidebar-user-role">Customer</div>
        </div>
      </div>

      <button className="sidebar-item logout" onClick={handleLogout}>
        <span className="sidebar-icon">🔒</span>
        <span>Logout</span>
      </button>
    </aside>
  );
}
