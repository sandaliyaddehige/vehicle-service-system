import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getBookings, updateBookingStatus, deleteBooking } from '../api';
import AdminLayout from '../components/AdminLayout';
import toast from 'react-hot-toast';

const STATUSES = ['All','Pending','Approved','In Progress','Completed','Rejected'];

const badge = (s) => {
  const m = { Pending:'badge-pending', Approved:'badge-approved', 'In Progress':'badge-inprog', Completed:'badge-completed', Rejected:'badge-rejected' };
  return <span className={`badge ${m[s]||''}`}>{s}</span>;
};

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [total,    setTotal]    = useState(0);
  const [filter,   setFilter]   = useState('All');
  const [search,   setSearch]   = useState('');
  const [page,     setPage]     = useState(1);
  const [loading,  setLoading]  = useState(true);
  const LIMIT = 8;

  const fetch = useCallback(() => {
    setLoading(true);
    getBookings({ status: filter !== 'All' ? filter : undefined, search, page, limit: LIMIT })
      .then(({ data }) => { setBookings(data.bookings); setTotal(data.total); })
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, [filter, search, page]);

  useEffect(() => { fetch(); }, [fetch]);

  const changeStatus = async (id, status) => {
    try { await updateBookingStatus(id, { status }); toast.success(`Marked as ${status}`); fetch(); }
    catch { toast.error('Update failed'); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    try { await deleteBooking(id); toast.success('Deleted'); fetch(); }
    catch { toast.error('Delete failed'); }
  };

  const pages = Math.ceil(total / LIMIT);

  return (
    <AdminLayout
      title="Bookings"
      subtitle={`All vehicle service appointments · ${total} total`}
      //action={<button className="btn-primary">+ New Booking</button>}
    >
      <div className="card" style={{overflow:'hidden'}}>
        {/* Filter bar */}
        <div className="filter-bar">
          <div className="search-box">
            <span>🔍</span>
            <input
              placeholder="Search name, vehicle, ref…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="filter-tabs">
            {STATUSES.map(s => (
              <button key={s} className={`ftab ${filter===s?'active':''}`}
                onClick={() => { setFilter(s); setPage(1); }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Table */}
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
              <tr><td colSpan="6"><div className="loader"><div className="spinner"></div></div></td></tr>
            ) : bookings.length === 0 ? (
              <tr><td colSpan="6" className="empty-row">No bookings found</td></tr>
            ) : bookings.map((b, i) => (
              <tr key={b._id}>
                <td style={{fontSize:11,color:'var(--text-3)',fontWeight:600}}>
                  {String((page-1)*LIMIT + i+1).padStart(3,'0')}
                </td>
                <td>
                  <div style={{fontWeight:600}}>{b.customerName}</div>
                  <div style={{fontSize:11,color:'var(--text-3)'}}>{b.vehicleNumber}{b.vehicleModel?` · ${b.vehicleModel}`:''}</div>
                </td>
                <td style={{fontSize:12,color:'var(--text-2)'}}>{b.serviceType}</td>
                <td style={{fontSize:12,color:'var(--text-2)'}}>
                  {b.date}
                  <div style={{fontSize:11,color:'var(--text-3)'}}>{b.time}</div>
                </td>
                <td>{badge(b.status)}</td>
                <td>
                  <div className="act-btns">
                    {b.status === 'Pending' && <>
                      <button className="act-btn approve" title="Approve" onClick={() => changeStatus(b._id,'Approved')}>✓</button>
                      <button className="act-btn reject"  title="Reject"  onClick={() => changeStatus(b._id,'Rejected')}>✗</button>
                    </>}
                    {b.status === 'Approved' && (
                      <button className="act-btn inprog" title="Mark In Progress" onClick={() => changeStatus(b._id,'In Progress')}>▶</button>
                    )}
                    {b.status === 'In Progress' && (
                      <button className="act-btn complete" title="Mark Completed" onClick={() => changeStatus(b._id,'Completed')}>✔</button>
                    )}
                    <Link to={`/bookings/${b._id}`} className="act-btn" title="View Details">👁</Link>
                    <button className="act-btn del" title="Delete" onClick={() => remove(b._id)}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="table-footer">
          <span className="showing">Showing {bookings.length} of {total} bookings</span>
          <div className="pagination">
            <button className="pg-btn" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>‹</button>
            {Array.from({length:Math.min(pages,5)},(_,i)=>i+1).map(p=>(
              <button key={p} className={`pg-btn ${page===p?'active':''}`} onClick={()=>setPage(p)}>{p}</button>
            ))}
            <button className="pg-btn" onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={page===pages||pages===0}>›</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
