import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getServices } from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Services.css';

const CATS = ['All services','Fluids','Brakes','AC','Tires','Electrical','General'];

export default function Services() {
  const [services, setServices] = useState([]);
  const [cat, setCat] = useState('All services');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices({ category: cat !== 'All services' ? cat : undefined })
      .then(({ data }) => setServices(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [cat]);

  const filtered = services.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Navbar />
      <div className="services-page">
        {/* Hero */}
        <div className="srv-hero">
          <div className="srv-hero-inner">
            <div>
              <div className="srv-eyebrow">Professional vehicle care</div>
              <h1 className="srv-title">Our <span>services</span></h1>
              <p className="srv-sub">All work done by certified mechanics with genuine parts.</p>
            </div>
            <div className="srv-hero-stats">
              <div className="srv-stat"><div className="srv-stat-num">8</div><div className="srv-stat-label">Services</div></div>
              <div className="srv-stat"><div className="srv-stat-num">48h</div><div className="srv-stat-label">Avg turnaround</div></div>
              <div className="srv-stat"><div className="srv-stat-num">98%</div><div className="srv-stat-label">Satisfaction</div></div>
            </div>
          </div>
        </div>

        <div className="srv-body">
          {/* Filters */}
          <div className="srv-toolbar">
            <div className="srv-search">
              <span>🔍</span>
              <input placeholder="Search services…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="srv-cats">
              {CATS.map(c => (
                <button key={c} className={`filter-tab ${cat===c?'active':''}`} onClick={() => setCat(c)}>{c}</button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="loading-spinner"><div className="spinner"></div></div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:'40px', color:'var(--text-3)' }}>No services found</div>
          ) : (
            <div className="srv-grid">
              {filtered.map(s => (
                <div key={s._id} className="srv-card card">
                  <div className="srv-card-top">
                    <div className="srv-card-icon">{s.icon}</div>
                    {s.badge && <span className="service-badge" style={{ background: '#EEEDFE', color: '#3C3489' }}>{s.badge}</span>}
                  </div>
                  <div className="srv-name">{s.name}</div>
                  <div className="srv-desc">{s.description}</div>
                  <div className="srv-card-footer">
                    <div>
                      <div className="srv-price">Rs. {Number(s.price).toLocaleString()}</div>
                      <div className="srv-duration">{s.duration}</div>
                    </div>
                    <Link to={`/book?service=${s._id}`} className="btn-primary" style={{padding:'7px 16px',fontSize:12}}>Book</Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Trust strip */}
          <div className="trust-strip card">
            {[['👤','Certified mechanics','Factory-trained & approved'],['🔒','Genuine parts','OEM quality'],['🔔','Live status updates','Track in real time'],['🕐','On-time guarantee','Done within stated duration']].map(([ic,t,d])=>(
              <div key={t} className="trust-strip-item">
                <div className="trust-strip-icon">{ic}</div>
                <div><div className="trust-strip-title">{t}</div><div className="trust-strip-desc">{d}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
