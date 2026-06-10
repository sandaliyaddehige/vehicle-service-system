import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const FuchsiusLogo = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M4 9L9 4L14 9L9 14L4 9Z" fill="white" opacity=".9"/>
    <circle cx="9" cy="9" r="2.5" fill="white"/>
  </svg>
);

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/book', label: 'Book Now' },
    { to: '/my-bookings', label: 'My Bookings' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <div className="logo-icon"><FuchsiusLogo /></div>
          <div>
            <div className="logo-text">FUCHSIUS</div>
            <div className="logo-sub">Vehicle Services</div>
          </div>
        </Link>

        <div className="nav-links">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link ${isActive(to) ? 'active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-admin-btn">Admin Panel</Link>
              )}
              <div className="nav-user-menu">
                <div className="nav-avatar">
                  {user.username?.slice(0, 2).toUpperCase()}
                </div>
                <div className="nav-dropdown">
                  <div className="nav-dropdown-name">{user.username}</div>
                  <Link to="/my-bookings" className="nav-dropdown-item">My Bookings</Link>
                  <button onClick={handleLogout} className="nav-dropdown-item logout">Sign Out</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-signin">Sign In</Link>
              <Link to="/book" className="btn-primary">Book Now</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
