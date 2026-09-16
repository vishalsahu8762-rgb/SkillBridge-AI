import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    setShowDropdown(false);
    await logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/85 backdrop-blur-xl text-white shadow-lg shadow-slate-900/20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            {isAuthenticated && (
              <button
                onClick={toggleSidebar}
                className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-200 transition hover:bg-white/10 hover:text-white"
                aria-label="Toggle Navigation"
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
            <Link to="/dashboard" className="flex items-center gap-2 text-lg font-black tracking-tight text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/30">
                <Sparkles size={16} />
              </span>
              <span>SkillBridge AI</span>
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 transition hover:bg-white/10"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-xs font-black text-slate-950">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden text-left sm:block">
                    <div className="text-sm font-semibold text-white">{user.name}</div>
                    <div className="text-[10px] uppercase tracking-[0.14em] text-sky-200">{user.role}</div>
                  </div>
                  <ChevronDown size={14} className="text-slate-300" />
                </button>

                {showDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-50"
                    onMouseLeave={() => setShowDropdown(false)}
                  >
                    <div className="border-b border-slate-100 px-3 py-2">
                      <p className="truncate text-sm font-bold text-slate-900">{user.name}</p>
                      <p className="truncate text-[11px] text-slate-500">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
                    >
                      <User size={16} className="text-sky-600" />
                      <span>My Profile</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="mt-1 flex w-full items-center gap-2 rounded-xl border-t border-slate-100 px-3 py-2.5 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-3.5 py-2 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:brightness-110"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
