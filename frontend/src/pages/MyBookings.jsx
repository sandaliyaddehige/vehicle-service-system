import { useEffect, useState, useCallback, useRef } from 'react';
import { getBookings } from '../api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './MyBookings.css';

const statusBadge = (status) => {
  const map = {
    Pending: 'badge-pending',
    Approved: 'badge-approved',
    'In Progress': 'badge-inprogress',
    Completed: 'badge-completed',
    Rejected: 'badge-rejected',
  };
  return <span className={`badge ${map[status] || ''}`}>{status}</span>;
};

const STEPS = ['Booked', 'Approved', 'Servicing', 'QC Check', 'Ready'];
const STEP_MAP = { Booked: 0, Approved: 1, Servicing: 2, 'QC Check': 3, Ready: 4 };

const STATUS_MSG = {
  Pending:      { icon: '⏳', color: '#D97706', bg: '#FEF3C7', text: 'Your appointment is waiting for admin review. You will be notified once it is approved.' },
  Approved:     { icon: '✅', color: '#059669', bg: '#D1FAE5', text: 'Great news! Your appointment has been approved. Please arrive on time.' },
  'In Progress':{ icon: '⚙️', color: '#7C3AED', bg: '#EDE9FE', text: 'Your vehicle is currently being serviced. We will update you as work progresses.' },
  Completed:    { icon: '🎉', color: '#059669', bg: '#D1FAE5', text: 'Your service is complete! Thank you for choosing us.' },
  Rejected:     { icon: '❌', color: '#DC2626', bg: '#FEE2E2', text: 'Unfortunately your appointment could not be approved. Please contact us or book again.' },
};

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings]       = useState([]);
  const [filter, setFilter]           = useState('All');
  const [loading, setLoading]         = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [liveFlash, setLiveFlash]     = useState(false);
  const prevBookingsRef               = useRef([]);

  const fetchBookingsData = useCallback(() => {
    if (!user) return;
    return getBookings()
      .then(({ data }) => {
        const newBookings = data.bookings;
        const prev = prevBookingsRef.current;
        const changed = newBookings.some(nb => {
          const old = prev.find(ob => ob._id === nb._id);
          return old && (old.status !== nb.status || old.currentStep !== nb.currentStep || old.adminNote !== nb.adminNote);
        });

        if (changed) {
          setLiveFlash(true);
          setTimeout(() => setLiveFlash(false), 2000);
        }

        prevBookingsRef.current = newBookings;
        setBookings(newBookings);
        setLastUpdated(new Date());
      })
      .catch((err) => console.error('Error fetching bookings:', err))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    fetchBookingsData();
    const interval = setInterval(fetchBookingsData, 5000);
    return () => clearInterval(interval);
  }, [fetchBookingsData]);

  const filteredBookings = bookings.filter(b => {
    if (filter === 'All') return true;
    return b.status === filter;
  });

  const stats = {
    total:      bookings.length,
    inProgress: bookings.filter(b => b.status === 'In Progress').length,
    completed:  bookings.filter(b => b.status === 'Completed').length,
    upcoming:   bookings.filter(b => b.status === 'Approved').length,
  };

  if (!user) return null;

  return (
    <div className="my-bookings-page">
      
      {/* ── Top Navigation Bar ── */}
      <nav className="top-nav">
        <div className="nav-inner">
          <div className="nav-brand">
            <div className="brand-logo">✦</div>
            <div>
              <div className="brand-name">FUCHSIUS</div>
              <div className="brand-sub">VEHICLE SERVICES</div>
            </div>
          </div>
          
          <div className="nav-links">
            <Link to="/home" className="nav-link">Home</Link>
            <Link to="/services" className="nav-link">Services</Link>
            <Link to="/book" className="nav-link">Book Now</Link>
            <Link to="/bookings" className="nav-link active">My Bookings</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div>

          <div className="nav-user">
            <div className="user-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : 'KA'}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Main Content Container ── */}
      <div className="bookings-content-area">
        
        {/* Dark Hero Dashboard Header */}
        <div className="mb-hero">
          <div className="mb-hero-inner">
            <div className="hero-content">
              <span className="mb-eyebrow">Customer Portal</span>
              <h1 className="mb-title">My Bookings</h1>
              <p className="mb-sub">Track and manage all your vehicle service appointments</p>
              
              <div className={`mb-live-dot ${liveFlash ? 'flash' : ''}`}>
                <span className="live-pulse"></span>
                <span className="live-text">
                  Live updates active {lastUpdated && `· ${lastUpdated.toLocaleTimeString()}`}
                </span>
              </div>
            </div>

            {/* Working Hours Block */}
            <div className="working-hours-card">
              <h3>WORKING HOURS</h3>
              <div className="hours-row"><span>Mon - Fri</span> <span>8AM - 6PM</span></div>
              <div className="hours-row"><span>Saturday</span> <span>8AM - 2PM</span></div>
              <div className="hours-row"><span>Sunday</span> <span className="closed">Closed</span></div>
            </div>
          </div>
        </div>

        {/* Outer Body Container */}
        <div className="mb-body">
          
          {/* Controls & Filter Panel */}
          <div className="mb-filters-panel">
            <div className="filter-tabs">
              {['All','Pending','Approved','In Progress','Completed','Rejected'].map(f=>(
                <button key={f} className={`filter-tab ${filter===f?'active':''}`} onClick={() => setFilter(f)}>{f}</button>
              ))}
            </div>
            <div className="filter-actions">
              <button className="btn-refresh" onClick={fetchBookingsData}>↻ Refresh</button>
              <Link to="/book" className="btn-action-primary">+ Book a Service</Link>
            </div>
          </div>

          {/* Master Columns Split Grid */}
          <div className="main-grid">
            
            {/* LEFT: Cards & Counters */}
            <div className="left-column">
              
              {/* Counters Grid */}
              <div className="mb-stats">
                {[
                  { label: 'Total Bookings', val: stats.total, icon: '📅' },
                  { label: 'In Progress', val: stats.inProgress, icon: '⚙️' },
                  { label: 'Completed', val: stats.completed, icon: '✅' },
                  { label: 'Upcoming', val: stats.upcoming, icon: '⏰' }
                ].map((m, i) => (
                  <div key={i} className="mb-stat">
                    <div className="mb-stat-icon"><span>{m.icon}</span></div>
                    <div className="mb-stat-info">
                      <div className="mb-stat-val">{m.val}</div>
                      <div className="mb-stat-label">{m.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic Content List */}
              {loading ? (
                <div className="loading-spinner"><div className="spinner"></div></div>
              ) : filteredBookings.length === 0 ? (
                <div className="empty-bookings">
                  <div className="empty-icon">📅</div>
                  <h3>No bookings found</h3>
                  <p>There are no appointments listed under the "{filter}" category.</p>
                </div>
              ) : (
                <div className="bookings-list">
                  {filteredBookings.map(b => {
                    const stepIdx = STEP_MAP[b.currentStep] ?? 0;
                    const showProgress = ['Approved','In Progress','Completed'].includes(b.status);
                    const msg = STATUS_MSG[b.status];
                    return (
                      <div key={b._id} className="booking-card">
                        <div className="bc-header">
                          <div>
                            <div className="bc-ref">#{b.referenceNumber}</div>
                            <div className="bc-service">{b.serviceType}</div>
                            <div className="bc-vehicle">{b.vehicleMake && `${b.vehicleMake} · `}{b.vehicleNumber}</div>
                          </div>
                          {statusBadge(b.status)}
                        </div>

                        {msg && (
                          <div className="bc-status-msg" style={{background: msg.bg, borderLeftColor: msg.color}}>
                            <span className="msg-icon">{msg.icon}</span>
                            <span className="msg-text" style={{color: msg.color}}>{msg.text}</span>
                          </div>
                        )}

                        {b.adminNote && (
                          <div className="bc-admin-note">
                            <span className="bc-admin-note-label">📋 Workshop Note:</span>
                            <span className="bc-admin-note-text">"{b.adminNote}"</span>
                          </div>
                        )}

                        <div className="bc-details">
                          <div className="bc-detail"><span>Scheduled Date</span><strong>{b.date}</strong></div>
                          <div className="bc-detail"><span>Arrival Time</span><strong>{b.time}</strong></div>
                          {b.totalAmount > 0 && <div className="bc-detail"><span>Estimated Fee</span><strong>Rs. {b.totalAmount.toLocaleString()}</strong></div>}
                        </div>

                        {/* ✅ FIXED: My Bookings Tracker classes isolated from BookingForm CSS */}
                        {showProgress && (
                          <div className="bc-progress">
                            <div className="bc-progress-label">Live Workshop Tracker</div>
                            <div className="mb-tracker-steps">
                              {STEPS.map((s, i) => {
                                const done   = i < stepIdx;
                                const active = i === stepIdx;
                                return (
                                  <div key={s} className={`mb-tracker-step ${done?'done':''} ${active?'active':''}`}>
                                    <div className="mb-tracker-circle">{done ? '✓' : s[0]}</div>
                                    <div className="mb-tracker-label">{s}</div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <div className="bc-footer">
                          {b.status === 'Completed' ? (
                            <>
                              <span className="footer-status-text completed">✅ Service Completed</span>
                              <Link to="/book" className="btn-action-primary">Book Again</Link>
                            </>
                          ) : b.status === 'In Progress' ? (
                            <span className="footer-status-text progress">⚙️ Your vehicle is on the bay...</span>
                          ) : b.status === 'Pending' ? (
                            <span className="footer-status-text pending">⏳ Awaiting workshop clearance…</span>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RIGHT: Map & Support Panels */}
            <div className="right-column">
              <div className="map-card">
                <div className="map-icon-wrapper"><span className="map-icon">🗺️</span></div>
                <p className="map-address">123, Galle Rd, Colombo 03</p>
                <div className="map-meta">
                  <span>Fuchsius Auto Care</span>
                  <button className="directions-btn" onClick={() => window.open('https://maps.google.com')}>🧭 Directions</button>
                </div>
              </div>

              <div className="faq-card">
                <h3>Common questions</h3>
                <div className="faq-item">
                  <h4>How do I reschedule?</h4>
                  <p>If your booking is still pending or approved, you can cancel or contact customer support directly to shift timings.</p>
                </div>
                <div className="faq-item">
                  <h4>How long does a service take?</h4>
                  <p>20 min (battery check) to 2 hrs (full general inspection and lubricants change).</p>
                </div>
                <div className="faq-item">
                  <h4>Can I cancel my booking?</h4>
                  <p>Yes — cancellation is absolutely free up to 4 hours before the appointment window.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}