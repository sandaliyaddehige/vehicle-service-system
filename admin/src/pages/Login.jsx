import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Login.css';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const { login, loading }      = useAuth();
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      toast.success('Welcome back, Admin!');
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-glow"></div>

        {/* Logo */}
        <div className="login-logo">
          <div className="login-icon">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <path d="M5 13L13 5L21 13L13 21L5 13Z" fill="white" opacity=".9"/>
              <circle cx="13" cy="13" r="3.5" fill="white"/>
            </svg>
          </div>
          <h1 className="login-brand">Fuchsius Admin</h1>
          <p className="login-brand-sub">Vehicle Service Management Portal</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="lf-group">
            <label>Username / Email</label>
            <input
              type="email"
              className="lf-input"
              placeholder="admin@fuchsius.lk"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="lf-group">
            <label>Password</label>
            <div className="lf-pwd">
              <input
                type={showPwd ? 'text' : 'password'}
                className="lf-input focus"
                placeholder="••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button type="button" className="lf-eye" onClick={() => setShowPwd(v => !v)}>
                {showPwd ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <div className="lf-row">
            <label className="lf-remember">
              <div className="lf-cb"></div>
              <span>Remember me</span>
            </label>
            <span className="lf-forgot">Forgot password?</span>
          </div>

          <button type="submit" className="lf-btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In to Admin Portal'}
          </button>
        </form>

        <div className="lf-secure">🔒 Secured with JWT Authentication</div>
      </div>
    </div>
  );
}
