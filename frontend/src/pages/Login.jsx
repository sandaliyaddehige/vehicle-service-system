import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Login.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) {
      toast.success('Welcome back!');
      navigate(result.role === 'admin' ? '/admin' : '/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-bg-glow"></div>

        <div className="login-logo">
          <div className="login-logo-icon">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <path d="M5 13L13 5L21 13L13 21L5 13Z" fill="white" opacity=".9"/>
              <circle cx="13" cy="13" r="3.5" fill="white"/>
            </svg>
          </div>
          <div className="login-brand">Fuchsius</div>
          <div className="login-brand-sub">Vehicle Service Management Portal</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label>Username / Email</label>
            <input
              type="email"
              className="login-input"
              placeholder="admin@fuchsius.lk"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="login-field">
            <label>Password</label>
            <div className="pwd-wrapper">
              <input
                type={showPwd ? 'text' : 'password'}
                className="login-input"
                placeholder="••••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button type="button" className="pwd-toggle" onClick={() => setShowPwd(!showPwd)}>
                {showPwd ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <div className="login-row">
            <label className="remember-label">
              <div
                className={`checkbox ${remember ? 'checked' : ''}`}
                onClick={() => setRemember(!remember)}
              >
                {remember && '✓'}
              </div>
              <span>Remember me</span>
            </label>
            <span className="forgot-link">Forgot password?</span>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="login-security">🔒 Secured with JWT Authentication</div>

        <div className="login-register">
          Customer? <Link to="/register">Create an account →</Link>
        </div>
      </div>
    </div>
  );
}
