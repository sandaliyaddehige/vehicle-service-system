import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats, getBookings } from '../api';
import AdminLayout from '../components/AdminLayout';
import toast from 'react-hot-toast';

const statusBadge = (s) => {
  const m = { Pending:'badge-pending', Approved:'badge-approved', 'In Progress':'badge-inprog', Completed:'badge-completed', Rejected:'badge-rejected' };
  return <span className={`badge ${m[s]||''}`}>{s}</span>;
};

export default function Dashboard() {
  const [stats, setStats]     = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getBookings({ limit: 6 })])
      .then(([s, b]) => { setStats(s.data); setBookings(b.data.bookings); })
      .catch(() => toast.error('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  const maxBar = stats?.weeklyData ? Math.max(...stats.weeklyData.map(d => d.count), 1) : 1;

  return (
    <AdminLayout
      title="Dashboard"
      subtitle={`Welcome back, Admin · ${new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}`}
      //action={<Link to="/bookings/new" className="btn-primary">+ New Booking</Link>}
    >
      {loading ? (
        <div className="loader"><div className="spinner"></div></div>
      ) : (
        <>
          {/* ── Metric Cards ── */}
          <div className="metrics-grid">
            {[
              { label:"Today's Bookings", val: stats?.todayTotal ?? 0, icon:'📅', bg:'#EDE9FE', color:'#7C3AED', delta:'↑ 12% vs yesterday', dc:'d-up' },
              { label:'Pending',          val: stats?.pending     ?? 0, icon:'⏰', bg:'#FEF3C7', color:'#D97706', delta:'⚠ Needs review',     dc:'d-warn' },
              { label:'Completed',        val: stats?.completed   ?? 0, icon:'✅', bg:'#D1FAE5', color:'#059669', delta:'↑ 3 from last week', dc:'d-up' },
              { label:'Rejected',         val: stats?.rejected    ?? 0, icon:'✗',  bg:'#FEE2E2', color:'#DC2626', delta:'↓ 2 from last week', dc:'d-down' },
            ].map((m,i) => (
              <div key={i} className="card metric-card">
                <div className="metric-icon" style={{background:m.bg}}>
                  <span style={{color:m.color}}>{m.icon}</span>
                </div>
                <div className="metric-val">{m.val}</div>
                <div className="metric-label">{m.label}</div>
                <div className={`metric-delta ${m.dc}`}>{m.delta}</div>
              </div>
            ))}
          </div>

          {/* ── Charts ── */}
          <div style={{display:'flex',gap:14,marginBottom:18}}>
            {/* Bar chart */}
            <div className="card" style={{flex:1,padding:'16px 18px'}}>
              <div style={{fontSize:11,fontWeight:700,color:'var(--text-2)',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:14}}>
                Weekly Bookings
              </div>
              <div style={{display:'flex',alignItems:'flex-end',gap:8,height:80}}>
                {(stats?.weeklyData || []).map((d,i) => (
                  <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                    <div style={{
                      width:'100%', maxWidth:20,
                      height: `${Math.max((d.count/maxBar)*70,3)}px`,
                      borderRadius:'4px 4px 0 0',
                      background:'#7C3AED',
                      opacity: d.count === maxBar ? 1 : .55,
                      transition:'height .3s'
                    }}></div>
                    <div style={{fontSize:10,color:'var(--text-3)'}}>{d.day}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Donut */}
            <div className="card" style={{width:220,padding:'16px 18px'}}>
              <div style={{fontSize:11,fontWeight:700,color:'var(--text-2)',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:14}}>
                Status Split
              </div>
              <div style={{display:'flex',alignItems:'center',gap:16}}>
                <svg width="68" height="68" viewBox="0 0 68 68">
                  <circle cx="34" cy="34" r="26" fill="none" stroke="#EDE9FE" strokeWidth="11"/>
                  <circle cx="34" cy="34" r="26" fill="none" stroke="#7C3AED" strokeWidth="11" strokeDasharray="74 89" strokeDashoffset="-5" strokeLinecap="round"/>
                  <circle cx="34" cy="34" r="26" fill="none" stroke="#059669" strokeWidth="11" strokeDasharray="48 115" strokeDashoffset="-82" strokeLinecap="round"/>
                  <circle cx="34" cy="34" r="26" fill="none" stroke="#D97706" strokeWidth="11" strokeDasharray="22 141" strokeDashoffset="-134" strokeLinecap="round"/>
                </svg>
                <div style={{display:'flex',flexDirection:'column',gap:7}}>
                  {[['#059669','Completed'],['#7C3AED','Approved'],['#D97706','Pending'],['#DC2626','Rejected']].map(([c,l])=>(
                    <div key={l} style={{display:'flex',alignItems:'center',gap:7,fontSize:11,color:'var(--text-2)'}}>
                      <div style={{width:9,height:9,borderRadius:3,background:c,flexShrink:0}}></div>
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Recent Bookings ── */}
          <div className="card" style={{overflow:'hidden'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 18px',borderBottom:'1px solid var(--border)'}}>
              <div style={{fontSize:15,fontWeight:700,color:'var(--text-1)'}}>Recent Bookings</div>
              <Link to="/bookings" className="btn-outline" style={{padding:'6px 14px',fontSize:12}}>View all</Link>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th><th>Customer / Vehicle</th><th>Service</th>
                  <th>Date</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan="6" className="empty-row">No bookings yet</td></tr>
                ) : bookings.map((b, i) => (
                  <tr key={b._id}>
                    <td style={{fontSize:11,color:'var(--text-3)',fontWeight:600}}>{String(i+1).padStart(3,'0')}</td>
                    <td>
                      <div style={{fontWeight:600,fontSize:13}}>{b.customerName}</div>
                      <div style={{fontSize:11,color:'var(--text-3)'}}>{b.vehicleNumber}</div>
                    </td>
                    <td style={{fontSize:12,color:'var(--text-2)'}}>{b.serviceType}</td>
                    <td style={{fontSize:12,color:'var(--text-2)'}}>{b.date}</td>
                    <td>{statusBadge(b.status)}</td>
                    <td><Link to={`/bookings/${b._id}`} style={{fontSize:12,color:'var(--brand)',fontWeight:600}}>View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
