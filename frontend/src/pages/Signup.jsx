import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, UserCheck, Building2, Shield, Lock, Mail, User, Sparkles, AlertCircle, Eye, EyeOff, ArrowRight, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getJobRoles, getAllSkills } from '../services/api';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [role, setRole] = useState('TRAINEE');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [jobRoles, setJobRoles] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [jobRoleLoading, setJobRoleLoading] = useState(false);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [jobRoleError, setJobRoleError] = useState('');
  const [skillsError, setSkillsError] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [showHiringRoleDropdown, setShowHiringRoleDropdown] = useState(false);
  const skillDropdownRef = useRef(null);
  const hiringRolesDropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    district: 'Bhopal',
    currentSkills: ['Python', 'SQL', 'HTML'],
    targetRole: 'Full Stack Developer',
    companyName: '',
    industry: 'IT Services',
    hiringRoles: ['Full Stack Developer', 'Cloud Engineer']
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadJobRoles = async () => {
      setJobRoleLoading(true);
      setJobRoleError('');
      try {
        const response = await getJobRoles();
        const roles = Array.isArray(response?.data) ? response.data : [];
        if (mounted) {
          setJobRoles(roles);
          if (!roles.includes(formData.targetRole) && roles.length > 0) {
            setFormData(prev => ({ ...prev, targetRole: roles[0] }));
          }
        }
      } catch (err) {
        if (mounted) {
          setJobRoleError('Unable to load job roles. Please try again.');
        }
      } finally {
        if (mounted) {
          setJobRoleLoading(false);
        }
      }
    };

    const loadSkills = async () => {
      setSkillsLoading(true);
      setSkillsError('');
      try {
        const response = await getAllSkills();
        const skills = Array.isArray(response?.data) ? response.data : [];
        if (mounted) {
          setAvailableSkills(skills);
        }
      } catch (err) {
        if (mounted) {
          setSkillsError('Unable to load skills. Please try again.');
        }
      } finally {
        if (mounted) {
          setSkillsLoading(false);
        }
      }
    };

    loadJobRoles();
    loadSkills();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (skillDropdownRef.current && !skillDropdownRef.current.contains(event.target)) {
        setShowSkillDropdown(false);
      }

      if (hiringRolesDropdownRef.current && !hiringRolesDropdownRef.current.contains(event.target)) {
        setShowHiringRoleDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillToggle = (skill) => {
    const safeSkill = skill.trim();
    if (!safeSkill) return;

    if (formData.currentSkills.includes(safeSkill)) {
      setFormData({
        ...formData,
        currentSkills: formData.currentSkills.filter(item => item !== safeSkill)
      });
      return;
    }

    setFormData({
      ...formData,
      currentSkills: [...formData.currentSkills, safeSkill]
    });
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      currentSkills: formData.currentSkills.filter(item => item !== skillToRemove)
    });
  };

  const handleHiringRoleToggle = (roleName) => {
    const safeRole = roleName.trim();
    if (!safeRole) return;

    if (formData.hiringRoles.includes(safeRole)) {
      setFormData({
        ...formData,
        hiringRoles: formData.hiringRoles.filter(item => item !== safeRole)
      });
      return;
    }

    setFormData({
      ...formData,
      hiringRoles: [...formData.hiringRoles, safeRole]
    });
  };

  const removeHiringRole = (roleName) => {
    setFormData({
      ...formData,
      hiringRoles: formData.hiringRoles.filter(item => item !== roleName)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (role === 'TRAINEE' && !formData.targetRole.trim()) {
      setError('Please select a target job role.');
      return;
    }

    if (role === 'EMPLOYER' && !formData.companyName.trim()) {
      setError('Company Name is required for Employer account.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role,
        district: formData.district,
        currentSkills: Array.isArray(formData.currentSkills) ? formData.currentSkills : formData.currentSkills.split(',').map(s => s.trim()).filter(Boolean),
        targetRole: formData.targetRole,
        companyName: formData.companyName.trim(),
        industry: formData.industry,
        hiringRoles: Array.isArray(formData.hiringRoles) ? formData.hiringRoles : formData.hiringRoles.split(',').map(s => s.trim()).filter(Boolean)
      };

      await signup(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Signup failed. Email may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="skillpulse-shell flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="fade-in-up w-full max-w-5xl overflow-visible rounded-[32px] border border-white/10 bg-white/10 shadow-[0_30px_60px_rgba(7,26,52,0.35)] backdrop-blur-xl">
        <div className="grid lg:grid-cols-[0.95fr_1.2fr]">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-sky-950 to-blue-900 p-8 text-white sm:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.28),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(45,212,191,0.18),transparent_30%)]" />
            <div className="relative z-10">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-300 text-slate-950 shadow-lg shadow-cyan-400/30">
                  <Sparkles size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-200">Career Intelligence</div>
                  <div className="text-2xl font-black tracking-tight">SkillBridge AI</div>
                </div>
              </div>

              <div className="max-w-md">
                <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-100">Turn Skills Into Opportunities</p>
                <h1 className="text-4xl font-black leading-tight">Start your next chapter.</h1>
                <p className="mt-5 text-base leading-7 text-sky-100/90">Build your profile, understand your strengths, and unlock the learning paths that match your career ambitions.</p>
              </div>
            </div>

            <div className="relative z-10 mt-10 space-y-4">
              {[
                'Personalized skill gap analysis',
                'Career-aligned learning recommendations',
                'Industry demand and job matching insights'
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-200">✓</div>
                  <span className="text-sm text-sky-100/90">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/85 p-6 sm:p-8 lg:p-10">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-lg shadow-blue-500/25">
                <UserPlus size={24} />
              </div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">Create account</h2>
              <p className="mt-2 text-sm text-slate-500">Choose your profile and get started with SkillBridge AI</p>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1.5">
              {[
                { value: 'TRAINEE', icon: UserCheck, className: 'text-blue-700' },
                { value: 'EMPLOYER', icon: Building2, className: 'text-rose-700' },
                { value: 'ADMIN', icon: Shield, className: 'text-violet-700' }
              ].map(({ value, icon: Icon, className }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-[11px] font-bold transition-all ${
                    role === value
                      ? value === 'TRAINEE'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md'
                        : value === 'EMPLOYER'
                          ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-md'
                          : 'bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-md'
                      : 'bg-white text-slate-600'
                  }`}
                >
                  <Icon size={14} className={role === value ? 'text-white' : className} />
                  {value}
                </button>
              ))}
            </div>

            {error && (
              <div className="mb-5 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="signup-form text-sm">
              <div className="signup-field">
                <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600">Full Name *</label>
                <div className="signup-input-shell">
                  <User className="signup-input-icon text-slate-400" size={16} />
                  <input type="text" name="name" required placeholder="Vishal Sahu" value={formData.name} onChange={handleChange} className="skillpulse-input skillpulse-input-with-icon" />
                </div>
              </div>

              <div className="signup-field">
                <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600">Email Address *</label>
                <div className="signup-input-shell">
                  <Mail className="signup-input-icon text-slate-400" size={16} />
                  <input type="email" name="email" required placeholder="vishal@example.com" value={formData.email} onChange={handleChange} className="skillpulse-input skillpulse-input-with-icon" />
                </div>
              </div>

              <div className="signup-row">
                <div className="signup-field">
                  <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600">Password *</label>
                  <div className="signup-input-shell">
                    <Lock className="signup-input-icon text-slate-400" size={16} />
                    <input type={showPassword ? 'text' : 'password'} name="password" required placeholder="••••••••" value={formData.password} onChange={handleChange} className="skillpulse-input skillpulse-input-with-icon-password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="signup-toggle-btn text-slate-500 hover:text-slate-700" aria-label="Toggle password visibility">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="signup-field">
                  <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600">Confirm Password *</label>
                  <div className="signup-input-shell">
                    <Lock className="signup-input-icon text-slate-400" size={16} />
                    <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" required placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} className="skillpulse-input skillpulse-input-with-icon-password" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="signup-toggle-btn text-slate-500 hover:text-slate-700" aria-label="Toggle confirm password visibility">
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {role === 'TRAINEE' && (
                <div className="signup-role-panel rounded-2xl border border-blue-100 bg-blue-50/50 p-3">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">Trainee profile details</span>
                  <div className="signup-field">
                    <label className="text-[11px] font-semibold text-slate-700">District Location</label>
                    <select name="district" value={formData.district} onChange={handleChange} className="skillpulse-input">
                      <option value="Bhopal">Bhopal</option>
                      <option value="Indore">Indore</option>
                      <option value="Jabalpur">Jabalpur</option>
                      <option value="Gwalior">Gwalior</option>
                      <option value="Ujjain">Ujjain</option>
                      <option value="Sagar">Sagar</option>
                    </select>
                  </div>
                  <div className="signup-field">
                    <label className="text-[11px] font-semibold text-slate-700">Target Job Role *</label>
                    <div className="skillpulse-select-wrap">
                      {jobRoleLoading ? (
                        <div className="skillpulse-select-status">Loading job roles...</div>
                      ) : jobRoleError ? (
                        <div className="skillpulse-select-status error">{jobRoleError}</div>
                      ) : (
                        <select name="targetRole" value={formData.targetRole} onChange={handleChange} className="skillpulse-input skillpulse-select-control" required>
                          <option value="">Select a job role</option>
                          {jobRoles.map(roleName => (
                            <option key={roleName} value={roleName}>{roleName}</option>
                          ))}
                        </select>
                      )}
                      <ChevronDown size={16} className="skillpulse-select-arrow" />
                    </div>
                  </div>
                  <div className="signup-field">
                    <label className="text-[11px] font-semibold text-slate-700">Current Skills</label>
                    <div className="skillpulse-skill-select-wrap" ref={skillDropdownRef}>
                      <button
                        type="button"
                        className="skillpulse-skill-select-trigger skillpulse-input"
                        onClick={() => setShowSkillDropdown(!showSkillDropdown)}
                        aria-haspopup="listbox"
                        aria-expanded={showSkillDropdown}
                      >
                        <span className="skillpulse-skill-trigger-text">
                          {formData.currentSkills.length > 0 ? 'Selected skills' : 'Select skills'}
                        </span>
                        <ChevronDown size={16} className="skillpulse-select-arrow" />
                      </button>

                      {showSkillDropdown && (
                        <div className="skillpulse-skill-dropdown">
                          {skillsLoading ? (
                            <div className="skillpulse-skill-dropdown-empty">Loading skills...</div>
                          ) : skillsError ? (
                            <div className="skillpulse-skill-dropdown-empty error">{skillsError}</div>
                          ) : availableSkills.length === 0 ? (
                            <div className="skillpulse-skill-dropdown-empty">No skills available.</div>
                          ) : (
                            <div className="skillpulse-skill-option-list">
                              {availableSkills.map(skill => (
                                <label key={skill} className="skillpulse-skill-option">
                                  <input
                                    type="checkbox"
                                    checked={formData.currentSkills.includes(skill)}
                                    onChange={() => handleSkillToggle(skill)}
                                  />
                                  <span>{skill}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {formData.currentSkills.length > 0 && (
                        <div className="skillpulse-skill-chip-row">
                          {formData.currentSkills.map(skill => (
                            <span key={skill} className="skillpulse-skill-chip">
                              <span>{skill}</span>
                              <button type="button" onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`}>×</button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {role === 'EMPLOYER' && (
                <div className="signup-role-panel rounded-2xl border border-rose-100 bg-rose-50/60 p-3">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-rose-700">Employer profile details</span>
                  <div className="signup-field">
                    <label className="text-[11px] font-semibold text-slate-700">Company Name *</label>
                    <input type="text" name="companyName" placeholder="Tech Solutions Pvt Ltd" value={formData.companyName} onChange={handleChange} className="skillpulse-input" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="signup-field">
                      <label className="text-[11px] font-semibold text-slate-700">Industry</label>
                      <input type="text" name="industry" placeholder="IT Services" value={formData.industry} onChange={handleChange} className="skillpulse-input" />
                    </div>
                    <div className="signup-field">
                      <label className="text-[11px] font-semibold text-slate-700">District</label>
                      <select name="district" value={formData.district} onChange={handleChange} className="skillpulse-input">
                        <option value="Bhopal">Bhopal</option>
                        <option value="Indore">Indore</option>
                        <option value="Jabalpur">Jabalpur</option>
                        <option value="Gwalior">Gwalior</option>
                        <option value="Ujjain">Ujjain</option>
                        <option value="Sagar">Sagar</option>
                      </select>
                    </div>
                  </div>
                  <div className="signup-field">
                    <label className="text-[11px] font-semibold text-slate-700">Hiring Job Roles</label>
                    <div className="skillpulse-skill-select-wrap" ref={hiringRolesDropdownRef}>
                      <button
                        type="button"
                        className="skillpulse-skill-select-trigger skillpulse-input"
                        onClick={() => setShowHiringRoleDropdown(!showHiringRoleDropdown)}
                        aria-haspopup="listbox"
                        aria-expanded={showHiringRoleDropdown}
                      >
                        <span className="skillpulse-skill-trigger-text">
                          {formData.hiringRoles.length > 0 ? 'Selected roles' : 'Select job roles'}
                        </span>
                        <ChevronDown size={16} className="skillpulse-select-arrow" />
                      </button>

                      {showHiringRoleDropdown && (
                        <div className="skillpulse-skill-dropdown">
                          {jobRoleLoading ? (
                            <div className="skillpulse-skill-dropdown-empty">Loading job roles...</div>
                          ) : jobRoleError ? (
                            <div className="skillpulse-skill-dropdown-empty error">{jobRoleError}</div>
                          ) : jobRoles.length === 0 ? (
                            <div className="skillpulse-skill-dropdown-empty">No job roles available.</div>
                          ) : (
                            <div className="skillpulse-skill-option-list">
                              {jobRoles.map(roleName => (
                                <label key={roleName} className="skillpulse-skill-option">
                                  <input
                                    type="checkbox"
                                    checked={formData.hiringRoles.includes(roleName)}
                                    onChange={() => handleHiringRoleToggle(roleName)}
                                  />
                                  <span>{roleName}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {formData.hiringRoles.length > 0 && (
                        <div className="skillpulse-skill-chip-row">
                          {formData.hiringRoles.map(roleName => (
                            <span key={roleName} className="skillpulse-skill-chip">
                              <span>{roleName}</span>
                              <button type="button" onClick={() => removeHiringRole(roleName)} aria-label={`Remove ${roleName}`}>×</button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {role === 'ADMIN' && (
                <div className="rounded-2xl border border-violet-100 bg-violet-50 p-3 text-xs text-violet-800">
                  ℹ️ Admin registration creates a prototype platform management account.
                </div>
              )}

              <button type="submit" disabled={loading} className="skillpulse-btn w-full py-3.5 text-sm disabled:opacity-60">
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 border-t border-slate-200 pt-4 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-blue-700 transition hover:text-blue-800">Log in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
