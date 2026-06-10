import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBookings, updateBookingStatus, deleteBooking } from '../../api';
import AdminSidebar from '../../components/AdminSidebar';
import toast from 'react-hot-toast';
import '../admin/AdminDashboard.css';
import './AdminBookings.css';

const STATUSES = ['All', 'Pending', 'Approved', 'In Progress', 'Completed', 'Rejected'];

const statusBadge = (status) => {
  const map = {
    Pending: 'badge-pending', Approved: 'badge-approved',
    'In Progress': 'badge-inprogress', Completed: 'badge-completed', Rejected: 'badge-rejected',
  };
  return <span className={`badge ${map[status] || ''}`}>{status}</span>;
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    setLoading(true);
    getBookings({ status: filter !== 'All' ? filter : undefined, search, page, limit: 8 })
      .then(({ data }) => { setBookings(data.bookings); setTotal(data.total); })
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, [filter, page]);
  useEffect(() => {
    const t = setTimeout(fetchBookings, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, { status });
      toast.success(`Status updated to ${status}`);
      fetchBookings();
    } catch { toast.error('Failed to update'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    try {
      await deleteBooking(id);
      toast.success('Booking deleted');
      fetchBookings();
    } catch { toast.error('Failed to delete'); }
  };

  const pages = Math.ceil(total / 8);

  return (
    <div className="admin-wrapper">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-topbar">
          <div className="topbar-info">All Vehicle Service Appointments</div>
          <div className="topbar-right">
            <div className="system-online"><span className="dot-green"></span>System Online</div>
          </div>
        </div>
        <div className="admin-body">
          <div className="page-header">
            <div>
              <h1 className="page-title">Bookings</h1>
              <div className="page-sub">All bookings · {new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}</div>
            </div>
            <Link to="/admin/bookings/new" className="btn-primary">+ New Booking</Link>
          </div>

          <div className="card table-card">
            <div className="bookings-toolbar">
              <div className="search-box">
                <span>🔍</span>
                <input
                  placeholder="Search name, vehicle, ref…"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <div className="filter-tabs">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    className={`filter-tab ${filter === s ? 'active' : ''}`}
                    onClick={() => { setFilter(s); setPage(1); }}
                  >{s}</button>
                ))}
              </div>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer / Vehicle</th>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6"><div className="loading-spinner"><div className="spinner"></div></div></td></tr>
                ) : bookings.length === 0 ? (
                  <tr><td colSpan="6" className="empty-row">No bookings found</td></tr>
                ) : bookings.map((b, i) => (
                  <tr key={b._id}>
                    <td className="t-num">{String((page - 1) * 8 + i + 1).padStart(3, '0')}</td>
                    <td>
                      <div className="t-name">{b.customerName}</div>
                      <div className="t-sub">{b.vehicleNumber}{b.vehicleModel ? ` · ${b.vehicleModel}` : ''}</div>
                    </td>
                    <td className="t-muted">{b.serviceType}</td>
                    <td className="t-muted">{b.date}<br/><span style={{fontSize:11,color:'var(--text-3)'}}>{b.time}</span></td>
                    <td>{statusBadge(b.status)}</td>
                    <td>
                      <div className="action-btns">
                        {b.status === 'Pending' && <>
                          <button className="act-btn approve" onClick={() => handleStatus(b._id, 'Approved')} title="Approve">✓</button>
                          <button className="act-btn reject" onClick={() => handleStatus(b._id, 'Rejected')} title="Reject">✗</button>
                        </>}
                        {b.status === 'Approved' && (
                          <button className="act-btn progress" onClick={() => handleStatus(b._id, 'In Progress')} title="Mark In Progress">▶</button>
                        )}
                        {b.status === 'In Progress' && (
                          <button className="act-btn complete" onClick={() => handleStatus(b._id, 'Completed')} title="Mark Completed">✔</button>
                        )}
                        <Link to={`/admin/bookings/${b._id}`} className="act-btn view" title="View">👁</Link>
                        <button className="act-btn delete" onClick={() => handleDelete(b._id)} title="Delete">🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="table-footer">
              <span className="showing">Showing {bookings.length} of {total} bookings</span>
              <div className="pagination">
                <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
                {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map((p) => (
                  <button key={p} className={`page-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                ))}
                <button className="page-btn" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}>›</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
