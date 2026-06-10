import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getServices } from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Home.css';

export default function Home() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    getServices({ featured: 'true' })
      .then(({ data }) => {
        if (data && Array.isArray(data)) setServices(data.slice(0, 3));
        else setServices([]);
      })
      .catch(() => setServices([]));
  }, []);

  const demoServices = [
    { name: 'Oil Change', icon: '💧', price: 3500, duration: '45 min', badge: 'Most popular', badgeStyle: 'purple', description: 'Engine oil & filter replacement with a complimentary multi-point vehicle check.' },
    { name: 'Brake Service', icon: '✅', price: 7200, duration: '1.5 hr', badge: 'Certified', badgeStyle: 'green', description: 'Brake pads, discs & hydraulic system inspection by certified mechanics.' },
    { name: 'AC Service', icon: '❄️', price: 5800, duration: '1 hr', badge: 'Seasonal deal', badgeStyle: 'amber', description: 'Refrigerant top-up, compressor check & filter replacement.' },
  ];

  const displayServices = services.length > 0 ? services : demoServices;

  return (
    <>
      <Navbar />
      <main className="home">

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-inner">

            {/* Left */}
            <div className="hero-left">
              <div className="hero-pill">
                <span className="hero-dot" />
                <span>Certified mechanics</span>
                <span className="hero-divider" />
                <span>2,400+ customers served</span>
              </div>
              <h1 className="hero-title">
                Expert vehicle care,<br />
                <span>booked in minutes</span>
              </h1>
              <p className="hero-sub">
                Schedule your next service online — no phone calls, no queues.
              </p>
              <div className="hero-btns">
                <Link to="/book" className="btn-primary">Book a service</Link>
                <Link to="/services" className="btn-ghost">Browse services</Link>
              </div>
            </div>

           
          </div>

          {/* Stats bar */}
          <div className="hero-stats-bar">
            <div className="stats-inner">
              {[
                { num: '2.4k', sup: '+', label: 'Happy customers' },
                { num: '98',   sup: '%', label: 'Satisfaction rate' },
                { num: '48',   sup: 'h', label: 'Avg. turnaround' },
                { num: '8',    sup: '+', label: 'Service types' },
              ].map((s, i) => (
                <div key={i} className="stat-item">
                  <span className="stat-num">{s.num}<sup>{s.sup}</sup></span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── POPULAR SERVICES ── */}
        <section className="section services-section">
          <div className="container">
            <div className="section-header">
              <div>
                <div className="section-tag"><span className="tag-line" />What we offer</div>
                <h2 className="section-title">Popular services</h2>
              </div>
              <Link to="/services" className="view-all">View all →</Link>
            </div>
            <div className="services-grid">
              {displayServices.map((s, i) => (
                <ServiceCard key={s._id || i} service={s} isDemo={services.length === 0} />
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="section how-section">
          <div className="container">
            <div className="section-tag"><span className="tag-line" />How it works</div>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Book in 4 simple steps</h2>
            <div className="steps-grid">
              {[
                { num: 1, title: 'Choose a service', desc: 'Browse and pick what your vehicle needs' },
                { num: 2, title: 'Pick a slot',      desc: 'Select a date and time that suits you' },
                { num: 3, title: 'Drop off',          desc: 'Bring your vehicle in at the booked time' },
                { num: 4, title: 'Drive away',        desc: 'We notify you when it\'s ready', muted: true },
              ].map(step => (
                <div key={step.num} className={`step-item${step.muted ? ' muted' : ''}`}>
                  <div className="step-circle">{step.num}</div>
                  <div className="step-title">{step.title}</div>
                  <div className="step-desc">{step.desc}</div>
                </div>
              ))}
            </div>
            <div className="cta-banner">
              <div>
                <div className="cta-title">Ready to book your next service?</div>
                <div className="cta-sub">Join 2,400+ customers who trust Fuchsius.</div>
              </div>
              <Link to="/book" className="btn-primary">Book now — it's free</Link>
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE US ── */}
        <section className="section trust-section">
          <div className="container">
            <div className="trust-grid">
              {[
                { icon: '👤', title: 'Certified mechanics', desc: 'Factory-trained & approved' },
                { icon: '🔒', title: 'Genuine parts',       desc: 'OEM quality, no compromises' },
                { icon: '🔔', title: 'Live status updates', desc: 'Track your booking in real time' },
                { icon: '🕐', title: 'On-time guarantee',   desc: 'Done within stated duration' },
              ].map((item, i) => (
                <div key={i} className="trust-item">
                  <div className="trust-icon">{item.icon}</div>
                  <div>
                    <div className="trust-title">{item.title}</div>
                    <div className="trust-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

function ServiceCard({ service, isDemo }) {
  const badgeColors = {
    purple: { bg: '#EEEDFE', color: '#3C3489' },
    green:  { bg: '#EAF3DE', color: '#27500A' },
    amber:  { bg: '#FAEEDA', color: '#633806' },
  };
  const style = isDemo ? badgeColors[service.badgeStyle] : { bg: '#EEEDFE', color: '#3C3489' };

  return (
    <div className="service-card">
      <div className="service-card-top">
        <div className="service-icon">{service.icon}</div>
        {service.badge && (
          <span className="service-badge" style={{ background: style?.bg, color: style?.color }}>
            {service.badge}
          </span>
        )}
      </div>
      <div className="service-name">{service.name}</div>
      <div className="service-desc">{service.description}</div>
      <div className="service-footer">
        <div>
          <div className="service-price">Rs. {(service.price || 0).toLocaleString()}</div>
          <div className="service-duration">{service.duration}</div>
        </div>
        <Link to="/book" className="btn-primary" style={{ padding: '6px 14px', fontSize: '12px' }}>Book</Link>
      </div>
    </div>
  );
}