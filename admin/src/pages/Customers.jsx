import { useEffect, useState, useCallback } from 'react';
import { getCustomers } from '../api';
import AdminLayout from '../components/AdminLayout';
import toast from 'react-hot-toast';

const FILTERS = ['All','Active','Inactive','New'];

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [total,  setTotal]  = useState(0);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [page,   setPage]   = useState(1);
  const [loading,setLoading]= useState(true);
  const LIMIT = 8;

  const fetch = useCallback(() => {
    setLoading(true);
    getCustomers({ search, status: filter !== 'All' ? filter : undefined, page, limit: LIMIT })
      .then(({ data }) => { setCustomers(data.customers); setTotal(data.total); })
      .catch(() => toast.error('Failed to load customers'))
      .finally(() => setLoading(false));
  }, [filter, search, page]);

  useEffect(() => { fetch(); }, [fetch]);

  const initials = (n) => n?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() || '?';
  const avatarBgs = ['#EDE9FE','#EAF3DE','#FAEEDA','#E6F1FB','#FCEBEB'];
  const avatarFg  = ['#3C3489','#27500A','#633806','#0C447C','#791F1F'];
  const pages = Math.ceil(total / LIMIT);

  return (
    <AdminLayout
      title="Customers"
      subtitle={`${total} registered customer accounts`}
    >
      {/* Stats */}
      <div className="metrics-grid" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
        {[
          { label:'Total Customers', val:total,  icon:'👥', bg:'#EDE9FE' },
          { label:'Active',          val:'—',     icon:'✅', bg:'#D1FAE5' },
          { label:'Repeat (3+)',     val:'—',     icon:'⭐', bg:'#FEF3C7' },
          { label:'New this month',  val:'—',     icon:'🆕', bg:'#E6F1FB' },
        ].map((m,i) => (
          <div key={i} className="card metric-card">
            <div className="metric-icon" style={{background:m.bg}}>{m.icon}</div>
            <div className="metric-val">{m.val}</div>
            <div className="metric-label">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{overflow:'hidden'}}>
        <div className="filter-bar">
          <div className="search-box">
            <span>🔍</span>
            <input
              placeholder="Search name or phone…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="filter-tabs">
            {FILTERS.map(f => (
              <button key={f} className={`ftab ${filter===f?'active':''}`}
                onClick={() => { setFilter(f); setPage(1); }}>{f}</button>
            ))}
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th></th><th>Customer</th><th>Phone</th>
              <th style={{textAlign:'center'}}>Bookings</th>
              <th>Last Visit</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7"><div className="loader"><div className="spinner"></div></div></td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan="7" className="empty-row">No customers found</td></tr>
            ) : customers.map((c, i) => (
              <tr key={c._id}>
                <td>
                  <div style={{
                    width:32,height:32,borderRadius:'50%',
                    background:avatarBgs[i%5],
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:11,fontWeight:700,color:avatarFg[i%5]
                  }}>{initials(c.username)}</div>
                </td>
                <td>
                  <div style={{fontWeight:600}}>{c.username}</div>
                  <div style={{fontSize:11,color:'var(--text-3)'}}>{c.email}</div>
                </td>
                <td style={{fontSize:12,color:'var(--text-2)'}}>{c.phone||'—'}</td>
                <td style={{textAlign:'center',fontWeight:600}}>{c.bookingCount||0}</td>
                <td style={{fontSize:12,color:'var(--text-2)'}}>{c.lastVisit||'—'}</td>
                <td>
                  <span className={`badge ${c.isActive?'badge-active':'badge-inactive'}`}>
                    {c.isActive?'Active':'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="act-btns">
                    <button className="act-btn" title="View">👁</button>
                    <button className="act-btn" title="Edit">✏️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="table-footer">
          <span className="showing">Showing {customers.length} of {total}</span>
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
