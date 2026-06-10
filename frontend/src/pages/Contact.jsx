import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', type: 'General inquiry', message: '' });

  const handleSend = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) return toast.error('Please fill required fields');
    toast.success('Message sent! We\'ll reply within 2 hours.');
    setForm({ name: '', phone: '', type: 'General inquiry', message: '' });
  };

  return (
    <>
      <Navbar />
      <div className="contact-page">
        <div className="contact-hero">
          <div className="contact-hero-inner">
            <div>
              <h1 className="contact-title">Get in <span>touch</span></h1>
              <p className="contact-sub">Have a question about a service or your booking?</p>
            </div>
            <div className="working-hours">
              <div className="wh-title">Working hours</div>
              <div className="wh-row"><span>Mon – Fri</span><span className="wh-time">8AM – 6PM</span></div>
              <div className="wh-row"><span>Saturday</span><span className="wh-time">8AM – 2PM</span></div>
              <div className="wh-row"><span>Sunday</span><span style={{color:'#4A4470',fontWeight:500}}>Closed</span></div>
            </div>
          </div>
        </div>

        <div className="contact-body">
          <div className="contact-grid">
            {/* Left */}
            <div>
              <div className="contact-info-grid">
                {[
                  { icon:'📞', title:'Phone', lines:['+94 11 234 5678','WhatsApp: +94 77 987 6543'] },
                  { icon:'✉️', title:'Email', lines:['hello@fuchsius.lk','Reply within 2 hours'] },
                  { icon:'📍', title:'Location', lines:['123, Galle Rd, Colombo 03','Western Province, Sri Lanka'] },
                  { icon:'💬', title:'Quick response', lines:['WhatsApp support','Mon – Sat, 8AM – 5PM'] },
                ].map(({icon,title,lines})=>(
                  <div key={title} className="card contact-info-card">
                    <div className="ci-icon">{icon}</div>
                    <div>
                      <div className="ci-title">{title}</div>
                      {lines.map((l,i)=><div key={i} className={i===0?'ci-main':'ci-sub'}>{l}</div>)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="card msg-card">
                <div className="msg-card-header">Send us a message <span className="msg-reply">We reply within 2 hrs</span></div>
                <form onSubmit={handleSend} className="msg-form">
                  <div className="msg-row">
                    <div className="form-group">
                      <label className="form-label">Full name *</label>
                      <input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone *</label>
                      <input className="form-input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="07X XXX XXXX" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Inquiry type *</label>
                    <div className="inquiry-types">
                      {['General inquiry','Booking issue','Complaint'].map(t=>(
                        <div key={t} className={`inq-type ${form.type===t?'active':''}`} onClick={()=>setForm({...form,type:t})}>{t}</div>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Your message *</label>
                    <textarea className="form-input" rows={4} style={{resize:'vertical'}} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Describe your question or issue…" />
                  </div>
                  <button type="submit" className="btn-primary" style={{width:'100%',justifyContent:'center'}}>Send message</button>
                </form>
              </div>
            </div>

            {/* Right */}
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div className="card location-card">
                <div className="map-placeholder">🗺️<br/><span>123, Galle Rd, Colombo 03</span></div>
                <div className="location-footer">
                  <div>
                    <div className="lf-title">Fuchsius Auto Care</div>
                    <div className="lf-sub">Colombo 03, Sri Lanka</div>
                  </div>
                  <button className="direction-btn">🧭 Directions</button>
                </div>
              </div>

              <div className="card faq-card">
                <div className="faq-title">Common questions</div>
                {[
                  ['How do I reschedule?', 'Go to "My bookings" and tap Reschedule.'],
                  ['How long does a service take?', '20 min (battery check) to 2 hrs (full inspection).'],
                  ['Can I cancel my booking?', 'Yes — free up to 4 hours before the appointment.'],
                ].map(([q,a])=>(
                  <div key={q} className="faq-item">
                    <div className="faq-q">{q}</div>
                    <div className="faq-a">{a}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
