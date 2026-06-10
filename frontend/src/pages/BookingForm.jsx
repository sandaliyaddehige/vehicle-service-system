import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getServices, createBooking } from '../api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import './BookingForm.css';

const TIME_SLOTS = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'];
const STEPS_CONFIG = [
  { n: 1, label: 'Vehicle Info' },
  { n: 2, label: 'Date & Time' },
  { n: 3, label: 'Confirmation' }
];

export default function BookingForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [confirmation, setConfirmation] = useState(null);

  const [form, setForm] = useState({
    customerName: user?.username || user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    vehicleNumber: '',
    vehicleMake: '',
    vehicleModel: '',
    serviceType: '',
    serviceId: '',
    date: '',
    time: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    getServices()
      .then(({ data }) => setServices(data))
      .catch((err) => console.error('Error fetching services:', err));
  }, []);

  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const validateStep1 = () => {
    const e = {};
    if (!form.customerName) e.customerName = 'Required';
    if (!form.phone) e.phone = 'Required';
    if (!form.vehicleNumber) e.vehicleNumber = 'Required';
    if (!form.serviceType) e.serviceType = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.date) e.date = 'Select a date';
    if (!form.time) e.time = 'Select a time slot';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = async () => {
    try {
      const { data } = await createBooking(form);
      setConfirmation(data);
      toast.success('Booking submitted successfully!');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Booking failed');
    }
  };

  const f = (field) => ({
    value: form[field],
    onChange: (e) => { 
      setForm({ ...form, [field]: e.target.value }); 
      setErrors({ ...errors, [field]: '' }); 
    },
  });

  if (confirmation) {
    return (
      <ConfirmationPage 
        booking={confirmation} 
        onNew={() => { 
          setConfirmation(null); 
          setStep(1); 
          setForm({ customerName:'',phone:'',email:'',vehicleNumber:'',vehicleMake:'',vehicleModel:'',serviceType:'',serviceId:'',date:'',time:'' }); 
        }} 
      />
    );
  }

  return (
    <>
      <Navbar />
      <div className="booking-page">
        
        {/* ── 1. Match Dark Hero Dashboard Banner ── */}
        <div className="mb-hero">
          <div className="mb-hero-inner">
            <div className="hero-content">
              <span className="mb-eyebrow">Online Appointment</span>
              <h1 className="mb-title">Book a Service</h1>
              <p className="mb-sub">Schedule your workshop visit in three simple steps</p>
            </div>

            {/* Matching Working Hours Block */}
            <div className="working-hours-card">
              <h3>WORKING HOURS</h3>
              <div className="hours-row"><span>Mon - Fri</span> <span>8AM - 6PM</span></div>
              <div className="hours-row"><span>Saturday</span> <span>8AM - 2PM</span></div>
              <div className="hours-row"><span>Sunday</span> <span className="closed">Closed</span></div>
            </div>
          </div>
        </div>

        {/* ── 2. Page Main Body Content Layout ── */}
        <div className="mb-body">
          <div className="booking-main-layout">
            
            <div className="booking-form-area">
              
              {/* ── Horizontal Inline Progress Stepper Tracker ── */}
              <div className="inline-stepper-card card">
                <div className="progress-steps">
                  {STEPS_CONFIG.map(({ n, label }) => {
                    const done = step > n;
                    const active = step === n;
                    return (
                      <div key={n} className={`prog-step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
                        <div className="prog-circle">{done ? '✓' : n}</div>
                        <div className="prog-label">{label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── STEP 1: Vehicle & Contact Info ── */}
              {step === 1 && (
                <div className="form-card card">
                  <div className="form-card-title">Vehicle & Contact Info</div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input className={`form-input ${errors.customerName?'error':''}`} placeholder="Your full name" {...f('customerName')} />
                      {errors.customerName && <span className="field-error">{errors.customerName}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone *</label>
                      <input className={`form-input ${errors.phone?'error':''}`} placeholder="07X XXX XXXX" {...f('phone')} />
                      {errors.phone && <span className="field-error">{errors.phone}</span>}
                    </div>
                    <div className="form-group" style={{gridColumn:'1/-1'}}>
                      <label className="form-label">Email Address</label>
                      <input type="email" className="form-input" placeholder="your@email.com" {...f('email')} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Vehicle Number *</label>
                      <input className={`form-input ${errors.vehicleNumber?'error':''}`} placeholder="e.g. CBC-3421" {...f('vehicleNumber')} style={{textTransform:'uppercase'}} />
                      {errors.vehicleNumber && <span className="field-error">{errors.vehicleNumber}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Vehicle Model / Make</label>
                      <input className="form-input" placeholder="e.g. Toyota Vitzy" {...f('vehicleMake')} />
                    </div>
                    <div className="form-group" style={{gridColumn:'1/-1'}}>
                      <label className="form-label">Service Type *</label>
                      <select className={`form-input ${errors.serviceType?'error':''}`} value={form.serviceType} onChange={(e) => {
                        const s = services.find(sv => sv.name === e.target.value);
                        setForm({ ...form, serviceType: e.target.value, serviceId: s?._id || '' });
                        setErrors({ ...errors, serviceType: '' });
                      }}>
                        <option value="">Select a workshop service</option>
                        {services.map(s => <option key={s._id} value={s.name}>{s.icon} {s.name} — Rs. {s.price?.toLocaleString()}</option>)}
                      </select>
                      {errors.serviceType && <span className="field-error">{errors.serviceType}</span>}
                    </div>
                  </div>
                  <div className="form-footer">
                    <span></span>
                    <button className="btn-primary" onClick={handleNext}>Continue to Schedule →</button>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Pick a Date & Time ── */}
              {step === 2 && (
                <div className="form-card card">
                  <div className="form-card-title">Pick an Appointment Date & Time</div>
                  <div className="cal-nav">
                    <div className="cal-month-badge">{monthNames[calMonth]} {calYear}</div>
                    <div className="cal-arrows-group">
                      <button className="cal-arrow" onClick={() => { if(calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1); }}>‹</button>
                      <button className="cal-arrow" onClick={() => { if(calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1); }}>›</button>
                    </div>
                  </div>
                  <div className="date-grid">
                    {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d=><div key={d} className="date-cell header">{d}</div>)}
                    {Array.from({length:firstDay}).map((_,i)=><div key={`e${i}`} className="date-cell"></div>)}
                    {Array.from({length:daysInMonth},(_,i)=>i+1).map(day=>{
                      const dateStr = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                      const isPast = new Date(dateStr) < new Date(today.toDateString());
                      const isToday = dateStr === today.toISOString().split('T')[0];
                      const isSelected = form.date === dateStr;
                      return (
                        <div key={day} className={`date-cell ${isPast?'disabled':''} ${isToday?'today':''} ${isSelected?'selected':''}`}
                          onClick={() => !isPast && setForm({...form, date: dateStr})}>
                          {day}
                        </div>
                      );
                    })}
                  </div>
                  {errors.date && <span className="field-error">{errors.date}</span>}

                  {form.date && <>
                    <div className="slots-label">Available Time Slots — {form.date}</div>
                    <div className="time-slots">
                      {TIME_SLOTS.map(t => (
                        <div key={t} className={`time-slot ${form.time===t?'selected':''}`} onClick={() => setForm({...form, time: t})}>{t}</div>
                      ))}
                    </div>
                    {errors.time && <span className="field-error">{errors.time}</span>}
                  </>}

                  <div className="form-footer">
                    <button className="back-link" onClick={() => setStep(1)}>← Back</button>
                    <button className="btn-primary" onClick={handleNext}>Review Booking →</button>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Confirm Booking ── */}
              {step === 3 && (
                <div className="form-card card">
                  <div className="form-card-title">Confirm Your Appointment Details</div>
                  <div className="confirm-details">
                    {[
                      ['Customer Name', form.customerName],
                      ['Contact Number', form.phone],
                      ['Vehicle Plate', form.vehicleNumber],
                      ['Chosen Service', form.serviceType],
                      ['Selected Date', form.date],
                      ['Arrival Time', form.time],
                    ].map(([label, val]) => (
                      <div key={label} className="confirm-row">
                        <span className="confirm-label">{label}</span>
                        <span className="confirm-val">{val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="confirm-note">
                    ℹ️ Your appointment request will be verified and approved by workshop administrators within 2 hours.
                  </div>
                  <div className="form-footer">
                    <button className="back-link" onClick={() => setStep(2)}>← Back</button>
                    <button className="btn-primary" onClick={handleSubmit}>Submit Booking ✓</button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

{/* ── CONFIRMATION COMPONENT PAGE ── */}
function ConfirmationPage({ booking, onNew }) {
  return (
    <>
      <Navbar />
      <div className="confirm-page">
        <div className="confirm-card card">
          <div className="success-icon">✓</div>
          <h2 className="confirm-title">Booking Submitted!</h2>
          <p className="confirm-sub">Your service appointment has been queued for approval.<br/>We will update your dashboard shortly.</p>
          <div className="ref-num">#{booking.referenceNumber}</div>
          <div className="ref-details">
            {[
              ['Customer', booking.customerName],
              ['Vehicle Plate', booking.vehicleNumber],
              ['Service', booking.serviceType],
              ['Schedule', `${booking.date} @ ${booking.time}`]
            ].map(([l,v])=>(
              <div key={l} className="ref-row"><span className="ref-label">{l}</span><span className="ref-val">{v}</span></div>
            ))}
            <div className="ref-row">
              <span className="ref-label">Status</span>
              <span className="badge badge-pending">Pending Review</span>
            </div>
          </div>
          
          <div className="confirmation-actions" style={{display:'flex', flexDirection:'column', gap: '10px', width: '100%', marginTop: '20px'}}>
            <Link to="/bookings" className="btn-primary" style={{justifyContent:'center', textDecoration:'none', textAlign:'center'}}>
              Track on Dashboard
            </Link>
            <button className="btn-outline" style={{width:'100%', justifyContent:'center'}} onClick={onNew}>
              Book Another Service
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}