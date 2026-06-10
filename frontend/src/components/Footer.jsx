import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M2.5 7.5L7.5 2.5L12.5 7.5L7.5 12.5L2.5 7.5Z" fill="white" opacity=".9"/>
                  <circle cx="7.5" cy="7.5" r="2" fill="white"/>
                </svg>
              </div>
              <div>
                <div className="footer-brand-name">FUCHSIUS</div>
                <div className="footer-brand-sub">Auto Care</div>
              </div>
            </div>
            <p className="footer-desc">
              Expert vehicle care, booked online in minutes. Certified mechanics, genuine parts, real-time updates.
            </p>
            <div className="footer-socials">
              <div className="social-btn">📘</div>
              <div className="social-btn">📷</div>
              <div className="social-btn">💬</div>
            </div>
          </div>

          <div>
            <div className="footer-col-title">Quick links</div>
            <div className="footer-links">
              <Link to="/">🏠 Home</Link>
              <Link to="/services">🔧 Services</Link>
              <Link to="/book">📅 Book now</Link>
              <Link to="/my-bookings">🔍 My bookings</Link>
              <Link to="/contact">💬 Contact us</Link>
              <Link to="/register">👤 Register</Link>
            </div>
          </div>

          <div>
            <div className="footer-col-title">Our services</div>
            <div className="footer-links">
              <Link to="/services">💧 Oil change</Link>
              <Link to="/services">✅ Brake service</Link>
              <Link to="/services">❄️ AC service</Link>
              <Link to="/services">🔄 Tire rotation</Link>
              <Link to="/services">⚡ Battery check</Link>
              <Link to="/services">📋 Full inspection</Link>
            </div>
          </div>

          <div>
            <div className="footer-col-title">Contact</div>
            <div className="footer-contact">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>123, Galle Rd, Colombo 03<br/>Western Province, Sri Lanka</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+94 11 234 5678</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">💬</span>
                <span>+94 77 987 6543</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉</span>
                <span>hello@fuchsius.lk</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-hours">
          <div className="hours-item"><span>Monday – Friday</span><span className="hours-time">8:00 AM – 6:00 PM</span></div>
          <div className="hours-div"></div>
          <div className="hours-item"><span>Saturday</span><span className="hours-time">8:00 AM – 2:00 PM</span></div>
          <div className="hours-div"></div>
          <div className="hours-item"><span>Sunday</span><span className="hours-closed">Closed</span></div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">© 2026 Fuchsius Auto Care · All rights reserved</div>
          <div className="footer-secure">🔒 JWT secured · Sri Lanka</div>
          <div className="footer-policies">
            <span>Privacy policy</span>
            <span>Terms of service</span>
            <span>Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
