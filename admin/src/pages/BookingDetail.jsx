import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingById, updateBookingStatus, deleteBooking } from '../api';
import AdminLayout from '../components/AdminLayout';
import toast from 'react-hot-toast';

const STEPS  = ['Booked','Approved','Servicing','QC Check','Ready'];
const STEP_M = { Booked:0, Approved:1, Servicing:2, 'QC Check':3, Ready:4 };

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [note,    setNote]    = useState('');

  useEffect(() => {
    getBookingById(id)
      .then(({ data }) => { setBooking(data); setNote(data.adminNote || ''); })
      .catch(() => toast.error('Booking not found'))
      .finally(() => setLoading(false));
  }, [id]);

  // ✨ මෙතනට step කියන parameter එකත් එකතු කරා
  const changeStatus = async (status, step) => {
    setSaving(true);
    try {
      // 🚀 Backend එකට status එක වගේම currentStep එකත් යවනවා
      const { data } = await updateBookingStatus(id, { 
        status, 
        currentStep: step || booking.currentStep, // step එකක් එව්වේ නැත්නම් පරණ එකම තියාගන්නවා
        adminNote: note 
      });
      setBooking(data);
      toast.success(`Status → ${status}`);
    } catch { toast.error('Failed to update status'); }
    finally { setSaving(false); }
  };

  const saveNote = async () => {
    try {
      await updateBookingStatus(id, { status: booking.status, adminNote: note });
      toast.success('Note saved');
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this booking permanently?')) return;
    try { await deleteBooking(id); toast.success('Deleted'); navigate('/bookings'); }
    catch { toast.error('Failed'); }
  };

  if (loading) return <AdminLayout title="Booking Detail"><div className="loader"><div className="spinner"></div></div></AdminLayout>;
  if (!booking) return <AdminLayout title="Not Found"><p>Booking not found.</p></AdminLayout>;

  const stepIdx = STEP_M[booking.currentStep] ?? 0;

  const badgeClass = {
    Pending:'badge-pending', Approved:'badge-approved',
    'In Progress':'badge-inprog', Completed:'badge-completed', Rejected:'badge-rejected'
  }[booking.status] || '';

  return (
    <AdminLayout
      title={`Booking #${booking.referenceNumber}`}
      subtitle={`Created ${new Date(booking.createdAt).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}`}
      action={
        <div style={{display:'flex',gap:8}}>
          <button className="btn-outline" onClick={() => navigate('/bookings')}>← Back</button>
          <button className="btn-primary" style={{background:'#DC2626'}} onClick={handleDelete}>Delete</button>
        </div>
      }
    >
      <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:16}}>
        {/* Left */}
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {/* Details card */}
          <div className="card" style={{padding:20}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18,paddingBottom:14,borderBottom:'1px solid var(--border)'}}>
              <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:17,fontWeight:700,color:'var(--text-1)'}}>
                {booking.serviceType}
              </h2>
              <span className={`badge ${badgeClass}`}>{booking.status}</span>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:18}}>
              {[
                ['Customer',  booking.customerName],
                ['Phone',     booking.phone],
                ['Email',     booking.email || '—'],
                ['Vehicle',   booking.vehicleNumber],
                ['Make/Model',`${booking.vehicleMake||''} ${booking.vehicleModel||''}`.trim() || '—'],
                ['Date',      booking.date],
                ['Time',      booking.time],
                ['Amount',    booking.totalAmount ? `Rs. ${booking.totalAmount.toLocaleString()}` : '—'],
              ].map(([l,v]) => (
                <div key={l} style={{background:'var(--surface2)',borderRadius:8,padding:'10px 14px'}}>
                  <div style={{fontSize:10,color:'var(--text-3)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:3}}>{l}</div>
                  <div style={{fontSize:13,fontWeight:600,color:'var(--text-1)'}}>{v}</div>
                </div>
              ))}
            </div>

            {/* Progress steps */}
            <div style={{marginTop:4}}>
              <div style={{fontSize:11,fontWeight:700,color:'var(--text-3)',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:14}}>
                Service Progress (Current: {booking.currentStep})
              </div>
              <div style={{display:'flex',alignItems:'flex-start',position:'relative'}}>
                <div style={{position:'absolute',top:11,left:11,right:11,height:1,background:'var(--border)'}}></div>
                {STEPS.map((s, i) => {
                  const done   = i < stepIdx;
                  const active = i === stepIdx;
                  return (
                    <div key={s} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6,position:'relative',zIndex:1}}>
                      <div style={{
                        width:24, height:24, borderRadius:'50%',
                        background: done ? '#EDE9FE' : active ? 'var(--brand)' : '#fff',
                        border: `1.5px solid ${done||active ? 'var(--brand)' : 'var(--border)'}`,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:10, fontWeight:700,
                        color: done||active ? (active?'#fff':'var(--brand)') : 'var(--text-3)',
                      }}>{done ? '✓' : s[0]}</div>
                      <div style={{fontSize:10,color:active?'var(--brand)':'var(--text-3)',textAlign:'center',fontWeight:active?700:400}}>{s}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Admin note */}
          <div className="card" style={{padding:20}}>
            <div style={{fontSize:13,fontWeight:700,color:'var(--text-1)',marginBottom:12}}>Admin Note</div>
            <textarea
              className="form-input"
              rows={3}
              style={{resize:'vertical',marginBottom:10}}
              placeholder="Add internal note about this booking…"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
            <button className="btn-primary" onClick={saveNote} style={{fontSize:12,padding:'7px 16px'}}>Save Note</button>
          </div>
        </div>

        {/* Right: status actions */}
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <div className="card" style={{padding:18}}>
            <div style={{fontSize:13,fontWeight:700,color:'var(--text-1)',marginBottom:14}}>Update Status</div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {[
                // ✨ changeStatus එක ඇතුළට අදාළ 'currentStep' එකත් pass කරා
                { status:'Approved',    step:'Approved',  color:'#059669', bg:'#D1FAE5', label:'✓ Approve',          show: booking.status === 'Pending' },
                { status:'Rejected',    step:'Booked',    color:'#DC2626', bg:'#FEE2E2', label:'✗ Reject',           show: booking.status === 'Pending' },
                { status:'In Progress', step:'Servicing', color:'#7C3AED', bg:'#EDE9FE', label:'▶ Mark In Progress',  show: booking.status === 'Approved' },
                { status:'Completed',   step:'Ready',     color:'#059669', bg:'#D1FAE5', label:'✔ Mark Completed',    show: booking.status === 'In Progress' },
              ].filter(a => a.show).map(a => (
                <button key={a.status}
                  onClick={() => changeStatus(a.status, a.step)} // ✨ status සහ step දෙකම යනවා
                  disabled={saving}
                  style={{
                    width:'100%', padding:'11px', borderRadius:8, border:'none',
                    background:a.bg, color:a.color, fontWeight:700, fontSize:13,
                    cursor:'pointer', transition:'opacity .15s',
                    opacity: saving ? .6 : 1
                  }}>
                  {a.label}
                </button>
              ))}
              {['Completed','Rejected'].includes(booking.status) && (
                <div style={{textAlign:'center',fontSize:12,color:'var(--text-3)',padding:'8px 0'}}>
                  This booking is finalized
                </div>
              )}
            </div>
          </div>

          <div className="card" style={{padding:18}}>
            <div style={{fontSize:13,fontWeight:700,color:'var(--text-1)',marginBottom:10}}>Quick Info</div>
            {[
              ['Ref #', booking.referenceNumber],
              ['Status', booking.status],
              ['Step', booking.currentStep],
            ].map(([l,v]) => (
              <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 0',borderBottom:'1px solid #F5F3FF'}}>
                <span style={{fontSize:11,color:'var(--text-3)',textTransform:'uppercase',letterSpacing:'.06em'}}>{l}</span>
                <span style={{fontSize:12,fontWeight:600,color:'var(--text-1)'}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}