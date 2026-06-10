import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout({ title, subtitle, children, action }) {
  const { admin } = useAuth();

  return (
    <div className="admin-wrapper">
      <Sidebar />
      <div className="main-content">
        {/* Top bar */}
        <div className="admin-topbar">
          <div className="topbar-left">
            {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · Admin Panel
          </div>
          <div className="topbar-right">
            <div className="topbar-status">
              <div className="status-dot"></div>
              System Online
            </div>
            {admin && (
              <div className="topbar-avatar">
                {admin.username?.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Page content */}
        <div className="page-body">
          {(title || action) && (
            <div className="page-header">
              <div>
                {title && <h1 className="page-title">{title}</h1>}
                {subtitle && <div className="page-sub">{subtitle}</div>}
              </div>
              {action}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
