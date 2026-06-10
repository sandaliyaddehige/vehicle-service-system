import { useEffect, useState } from 'react';
import { getCustomers } from '../../api';
import AdminSidebar from '../../components/AdminSidebar';
import toast from 'react-hot-toast';
import '../admin/AdminDashboard.css';
import './AdminBookings.css';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = () => {
    setLoading(true);
    getCustomers({ search, status: filter !== 'All' ? filter : undefined, page, limit: 8 })
      .then(({ data }) => { setCustomers(data.customers); setTotal(data.total); })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCustomers(); }, [filter, page]);
  useEffect(() => {
    const t = setTimeout(fetchCustomers, 400);
    return () => clearTimeout(t);
  }, [search]);

  const pages = Math.ceil(total / 8);
  const initials = (name) => name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || '?';

  const avatarColors = ['#EEEDFE','#EAF3DE','#FAEEDA','#E6F1FB','#FCEBEB'];
  const textColors   = ['#3C3489','#27500A','#633806','#0C447C','#791F1F'];

  return (
    <div className="admin-wrapper">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-topbar">
          <div className="topbar-info">All Registered Customer Accounts</div>
        </div>
        <div className="admin-body">
          <div className="page-header">
            <div>
              <h1 className="page-title">Customers</h1>
              <div className="page-sub">Total: {total} registered customers</div>
            </div>
          </div>

          <div className="card table-card">
            <div className="bookings-toolbar">
              <div className="search-box">
                <span>🔍</span>
                <input
                  placeholder="Search name or phone…"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <div className="filter-tabs">
                {['All','Active','Inactive','New'].map((s) => (
                  <button key={s} className={`filter-tab ${filter === s ? 'active' : ''}`} onClick={() => { setFilter(s); setPage(1); }}>{s}</button>
                ))}
              </div>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Bookings</th>
                  <th>Last Visit</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7"><div className="loading-spinner"><div className="spinner"></div></div></td></tr>
                ) : customers.length === 0 ? (
                  <tr><td colSpan="7" className="empty-row">No customers found</td></tr>
                ) : customers.map((c, i) => (
                  <tr key={c._id}>
                    <td>
                      <div style={{
                        width:32, height:32, borderRadius:'50%',
                        background: avatarColors[i % 5],
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:11, fontWeight:600, color: textColors[i % 5]
                      }}>
                        {initials(c.username)}
                      </div>
                    </td>
                    <td>
                      <div className="t-name">{c.username}</div>
                      <div className="t-sub">{c.email}</div>
                    </td>
                    <td className="t-muted">{c.phone || '—'}</td>
                    <td style={{textAlign:'center', fontWeight:600}}>{c.bookingCount || 0}</td>
                    <td className="t-muted">{c.lastVisit || '—'}</td>
                    <td>
                      <span className={`badge ${c.isActive ? 'badge-approved' : 'badge-rejected'}`}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="act-btn view" title="View">👁</button>
                        <button className="act-btn" title="Edit">✏️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="table-footer">
              <span className="showing">Showing {customers.length} of {total} customers</span>
              <div className="pagination">
                <button className="page-btn" onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}>‹</button>
                {Array.from({length: Math.min(pages,5)},(_,i)=>i+1).map(p=>(
                  <button key={p} className={`page-btn ${page===p?'active':''}`} onClick={()=>setPage(p)}>{p}</button>
                ))}
                <button className="page-btn" onClick={() => setPage(p => Math.min(pages,p+1))} disabled={page===pages}>›</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
