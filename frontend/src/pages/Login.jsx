import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  LogIn,
  Lock,
  Mail,
  ShieldAlert,
  Sparkles,
  UserCheck,
  Building2,
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  TrendingUp,
  Target,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Map,
  LineChart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const routeMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError(null);
  };

  const featureCards = [
    {
      icon: TrendingUp,
      title: 'Industry Demand',
      text: 'See what skills employers are hiring for right now.',
      primary: true
    },
    {
      icon: Target,
      title: 'Skill Gap',
      text: 'Compare your current skills with the skills needed for your target role.',
      primary: true
    },
    {
      icon: GraduationCap,
      title: 'Learning Path',
      text: 'Turn your skill gaps into a focused learning plan.',
      primary: true
    },
    {
      icon: Briefcase,
      title: 'Career Match',
      text: 'Find career opportunities that fit your skills and goals.',
      primary: true
    },
    {
      icon: LineChart,
      title: 'Industry Trends',
      text: 'Spot emerging skills before the market shifts.',
      primary: true
    }
  ];

  const secondaryCapabilities = [
    {
      icon: Map,
      title: 'District Planning'
    },
    {
      icon: Building2,
      title: 'Employer Validation'
    },
    {
      icon: BookOpenIcon,
      title: 'Curriculum Alignment'
    }
  ];

  return (
    <div className="skillpulse-auth-page">
      <header className="skillpulse-auth-topbar">
        <Link to="/login" className="skillpulse-brand">
          <span className="skillpulse-brand-icon">
            <Sparkles size={20} />
          </span>
          <span className="skillpulse-brand-text">SkillBridge AI</span>
        </Link>
        <div className="skillpulse-topbar-links">
          <Link to="/signup" className="skillpulse-topbar-link skillpulse-primary-link">
            Create account
          </Link>
        </div>
      </header>

      <main className="skillpulse-auth-layout">
        <section className="skillpulse-auth-story">
          <div className="skillpulse-story-inner">
            <div className="skillpulse-kicker">
              <Sparkles size={14} />
              <span>WHAT SKILLBRIDGE AI HELPS YOU DO</span>
            </div>

            <div className="skillpulse-story-heading">
              <h1>Know the market. Find your gap. Build your career.</h1>
              <p>
                From industry demand to career planning, SkillBridge AI connects the skills you have with the opportunities you want.
              </p>
            </div>

            <div className="skillpulse-story-actions">
              <Link to="/signup" className="skillpulse-cta-primary">
                Start your Skill Journey
                <ArrowRight size={18} />
              </Link>
              <span className="skillpulse-cta-note">Understand demand. Close gaps. Plan next.</span>
            </div>

            <div className="skillpulse-feature-grid">
              {featureCards.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article className={`skillpulse-feature-card ${feature.primary ? 'skillpulse-feature-card-primary' : ''}`} key={feature.title}>
                    <span className="skillpulse-feature-icon">
                      <Icon size={18} />
                    </span>
                    <div className="skillpulse-feature-copy">
                      <div className="skillpulse-feature-title">{feature.title}</div>
                      <p className="skillpulse-feature-text">{feature.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="skillpulse-proof-strip">
              {secondaryCapabilities.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div className="skillpulse-proof-item" key={feature.title}>
                    <Icon size={16} />
                    <span>{feature.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="skillpulse-auth-panel">
          <div className="skillpulse-auth-panel-card">
            <div className="skillpulse-auth-panel-head">
              <span className="skillpulse-auth-icon">
                <LogIn size={24} />
              </span>
              <div>
                <h2>Welcome back</h2>
                <p>Sign in to your SkillBridge AI workspace</p>
              </div>
            </div>

            {routeMessage && (
              <div className="skillpulse-route-message">
                <ShieldAlert size={16} />
                <span>{routeMessage}</span>
              </div>
            )}

            <div className="skillpulse-demo-access">
              <div className="skillpulse-demo-title">Quick demo access</div>
              <div className="skillpulse-demo-grid">
                <button type="button" onClick={() => handleDemoFill('trainee@skillbridge.ai')}>
                  <UserCheck size={12} />
                  <span>Trainee</span>
                </button>
                <button type="button" onClick={() => handleDemoFill('employer@skillbridge.ai')}>
                  <Building2 size={12} />
                  <span>Employer</span>
                </button>
                <button type="button" onClick={() => handleDemoFill('admin@skillbridge.ai')}>
                  <Shield size={12} />
                  <span>Admin</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="skillpulse-error-box">
                <ShieldAlert size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="skillpulse-auth-form">
              <div className="skillpulse-form-field">
                <label htmlFor="email">Email address</label>
                <div className="skillpulse-input-wrap">
                  <Mail className="skillpulse-input-icon" size={18} />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="skillpulse-input skillpulse-input-with-icon"
                  />
                </div>
              </div>

              <div className="skillpulse-form-field">
                <label htmlFor="password">Password</label>
                <div className="skillpulse-input-wrap">
                  <Lock className="skillpulse-input-icon" size={18} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="skillpulse-input skillpulse-input-with-icon-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="skillpulse-password-toggle"
                    aria-label="Show or hide password"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="skillpulse-auth-options">
                <label className="skillpulse-check-row">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <button type="button" className="skillpulse-quiet-link">
                  Forgot password?
                </button>
              </div>

              <button type="submit" disabled={loading} className="skillpulse-login-button">
                {loading ? (
                  <span className="skillpulse-spinner" aria-label="Loading" />
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="skillpulse-auth-switch">
              <span>Don’t have an account?</span>
              <Link to="/signup">Create one</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const BookOpenIcon = () => (
  <span className="skillpulse-book-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 4h7a4 4 0 0 1 4 4v12a4 4 0 0 0-4-4H4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 4h-7a4 4 0 0 0-4 4v12a4 4 0 0 1 4-4h7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

export default Login;
