import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Register.css';

const pwdStrength = (p) => {
  if (p.length < 6) return { level: 0, label: '' };
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/\d/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  if (score <= 1) return { level: 1, label: 'Weak', color: '#DC2626' };
  if (score <= 2) return { level: 2, label: 'Fair', color: '#D97706' };
  if (score <= 3) return { level: 3, label: 'Strong', color: '#059669' };
  return { level: 4, label: 'Very strong', color: '#059669' };
};

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '', phone: '', nic: '', address: '' });
  const [errors, setErrors] = useState({});
  const [agree, setAgree] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const strength = pwdStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.username) e.username = 'Required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.password || form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!form.phone) e.phone = 'Required';
    if (!agree) e.agree = 'Please accept terms';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const result = await register(form);
    if (result.success) { toast.success('Account created!'); navigate('/'); }
    else toast.error(result.message);
  };

  const f = (field) => ({
    value: form[field],
    onChange: (e) => { setForm({ ...form, [field]: e.target.value }); setErrors({ ...errors, [field]: '' }); },
  });

  return (
    <>
      <Navbar />
      <div className="register-page">
        <div className="register-card">
          <div className="register-info">
            ℹ️ After registration you can add your vehicles and book service appointments from your dashboard.
          </div>

          <div className="register-section-title">👤 Personal information</div>
          <div className="reg-grid">
            <div className="form-group">
              <label className="form-label">Full name <span className="req">*</span></label>
              <input className={`form-input ${errors.username ? 'error' : ''}`} placeholder="Your full name" {...f('username')} />
              {errors.username && <span className="field-error">{errors.username}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">NIC / Passport</label>
              <input className="form-input" placeholder="e.g. 200012345678" {...f('nic')} />
            </div>
            <div className="form-group">
              <label className="form-label">Email address <span className="req">*</span></label>
              <input type="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="your@email.com" {...f('email')} />
              {errors.email && <span className="field-error">⚠ {errors.email}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Phone number <span className="req">*</span></label>
              <input className={`form-input ${errors.phone ? 'error' : ''}`} placeholder="07X XXX XXXX" {...f('phone')} />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Address <span className="optional">(optional)</span></label>
              <input className="form-input" placeholder="Your home or office address" {...f('address')} />
              <span className="field-hint">Optional — used for service reminders</span>
            </div>
          </div>

          <div className="register-section-title">🔒 Set a password</div>
          <div className="reg-grid">
            <div className="form-group">
              <label className="form-label">Password <span className="req">*</span></label>
              <input type="password" className={`form-input ${errors.password ? 'error' : ''}`} placeholder="Min 6 characters" {...f('password')} />
              {form.password && (
                <div className="pwd-strength">
                  <div className="pwd-bars">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="pwd-bar" style={{ background: i <= strength.level ? strength.color : '#E9E6FF' }} />
                    ))}
                  </div>
                  <span style={{ color: strength.color, fontSize: 11, fontWeight: 600 }}>{strength.label} password</span>
                </div>
              )}
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm password <span className="req">*</span></label>
              <input type="password" className={`form-input ${errors.confirmPassword ? 'error' : ''}`} placeholder="Repeat password" {...f('confirmPassword')} />
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            </div>
          </div>

          <div className="terms-box">
            <div className={`terms-checkbox ${agree ? 'checked' : ''}`} onClick={() => setAgree(!agree)}>
              {agree && '✓'}
            </div>
            <div className="terms-text">
              I agree to the <span className="terms-link">Terms of Service</span> and <span className="terms-link">Privacy Policy</span>.
              I consent to receiving service updates and appointment reminders via email and SMS.
            </div>
          </div>
          {errors.agree && <span className="field-error">{errors.agree}</span>}

          <button className="btn-primary register-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account →'}
          </button>

          <div className="register-divider">
            <span></span>
            <span>Already registered?</span>
            <span></span>
          </div>

          <div className="register-login">
            Have an account? <Link to="/login">Sign in to your dashboard →</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
