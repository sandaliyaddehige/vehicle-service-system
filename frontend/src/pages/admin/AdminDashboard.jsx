import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats, getBookings } from '../../api';
import AdminSidebar from '../../components/AdminSidebar';
import './AdminDashboard.css';

const statusBadge = (status) => {
  const map = {
    Pending: 'badge-pending', Approved: 'badge-approved',
    'In Progress': 'badge-inprogress', Completed: 'badge-completed', Rejected: 'badge-rejected',
  };
  return <span className={`badge ${map[status] || ''}`}>{status}</span>;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getBookings({ limit: 5 })])
      .then(([s, b]) => { setStats(s.data); setBookings(b.data.bookings); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const metrics = stats ? [
    { label: 'Today\'s Bookings', val: stats.todayTotal, icon: '📅', iconBg: '#EDE9FE', color: '#7C3AED', delta: '↑ 12% vs yesterday', deltaClass: 'delta-up' },
    { label: 'Pending', val: stats.pending, icon: '⏰', iconBg: '#FEF3C7', color: '#D97706', delta: '⚠ Needs review', deltaClass: 'delta-warn' },
    { label: 'Completed', val: stats.completed, icon: '✅', iconBg: '#D1FAE5', color: '#059669', delta: '↑ 3 from last week', deltaClass: 'delta-up' },
    { label: 'Rejected', val: stats.rejected, icon: '✗', iconBg: '#FEE2E2', color: '#DC2626', delta: '↓ 2 from last week', deltaClass: 'delta-down' },
  ] : [];

  const maxBar = stats?.weeklyData ? Math.max(...stats.weeklyData.map(d => d.count), 1) : 1;

  return (
    <div className="admin-wrapper">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-topbar">
          <div className="topbar-info">
            {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} · Admin Panel
          </div>
          <div className="topbar-right">
            <div className="system-online"><span className="dot-green"></span>System Online</div>
          </div>
        </div>

        <div className="admin-body">
          <div className="page-header">
            <div>
              <h1 className="page-title">Dashboard</h1>
              <div className="page-sub">Welcome back, Admin · {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
            <Link to="/admin/bookings/new" className="btn-primary">+ New Booking</Link>
          </div>

          {loading ? (
            <div className="loading-spinner"><div className="spinner"></div></div>
          ) : (
            <>
              {/* Metrics */}
              <div className="metrics-grid">
                {metrics.map((m, i) => (
                  <div key={i} className="metric-card card">
                    <div className="metric-icon" style={{ background: m.iconBg }}>
                      <span style={{ color: m.color, fontSize: 16 }}>{m.icon}</span>
                    </div>
                    <div className="metric-val">{m.val}</div>
                    <div className="metric-label">{m.label}</div>
                    <div className={`metric-delta ${m.deltaClass}`}>{m.delta}</div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="charts-row">
                <div className="chart-card card" style={{ flex: 1 }}>
                  <div className="chart-title">Weekly Bookings</div>
                  <div className="bar-chart">
                    {(stats?.weeklyData || []).map((d, i) => (
                      <div key={i} className="bar-wrap">
                        <div
                          className="bar"
                          style={{ height: `${(d.count / maxBar) * 70}px`, background: '#7C3AED', opacity: d.count === maxBar ? 1 : .6 }}
                        ></div>
                        <div className="bar-label">{d.day}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="chart-card card" style={{ width: 220 }}>
                  <div className="chart-title">Status Split</div>
                  <div className="donut-wrap">
                    <svg width="68" height="68" viewBox="0 0 68 68">
                      <circle cx="34" cy="34" r="26" fill="none" stroke="#EDE9FE" strokeWidth="11"/>
                      <circle cx="34" cy="34" r="26" fill="none" stroke="#7C3AED" strokeWidth="11" strokeDasharray="74 89" strokeDashoffset="-5" strokeLinecap="round"/>
                      <circle cx="34" cy="34" r="26" fill="none" stroke="#059669" strokeWidth="11" strokeDasharray="48 115" strokeDashoffset="-82" strokeLinecap="round"/>
                      <circle cx="34" cy="34" r="26" fill="none" stroke="#D97706" strokeWidth="11" strokeDasharray="22 141" strokeDashoffset="-134" strokeLinecap="round"/>
                    </svg>
                    <div className="donut-legend">
                      {[['#059669','Completed'],['#7C3AED','Approved'],['#D97706','Pending'],['#DC2626','Rejected']].map(([c,l]) => (
                        <div key={l} className="legend-item">
                          <div className="legend-dot" style={{ background: c }}></div>
                          <span>{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent bookings table */}
              <div className="card table-card">
                <div className="table-header">
                  <div className="table-title">Recent Bookings</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link to="/admin/bookings" className="btn-outline" style={{ padding: '6px 14px', fontSize: 12 }}>
                      View all
                    </Link>
                  </div>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Customer / Vehicle</th>
                      <th>Service</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length === 0 ? (
                      <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-3)', padding: 24 }}>No bookings yet</td></tr>
                    ) : bookings.map((b, i) => (
                      <tr key={b._id}>
                        <td style={{ color: 'var(--text-3)', fontSize: 11 }}>{String(i + 1).padStart(3, '0')}</td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{b.customerName}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{b.vehicleNumber}</div>
                        </td>
                        <td style={{ color: 'var(--text-2)', fontSize: 12 }}>{b.serviceType}</td>
                        <td style={{ color: 'var(--text-2)', fontSize: 12 }}>{b.date}</td>
                        <td>{statusBadge(b.status)}</td>
                        <td>
                          <Link to={`/admin/bookings/${b._id}`} className="action-view">View</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
