import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  BookOpen,
  GraduationCap,
  FileText,
  Map,
  Building2,
  User,
  ChevronRight,
  Award,
  Briefcase,
  Compass,
  Activity,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const isTrainee = user?.role === 'TRAINEE';

  const traineeMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/my-skills', label: 'My Skills', icon: BookOpen },
    { path: '/skill-assessment', label: 'Skill Assessment', icon: Award },
    { path: '/skill-gap', label: 'Skill Gap Analyzer', icon: BookOpen },
    { path: '/learning-path', label: 'Learning Path', icon: GraduationCap },
    { path: '/job-match', label: 'Job Match', icon: Briefcase },
    { path: '/industry-trends', label: 'Industry Trends', icon: TrendingUp },
    { path: '/careers', label: 'Careers', icon: Compass },
    { path: '/progress', label: 'My Progress', icon: Activity },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const standardMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/industry-demand', label: 'Industry Demand', icon: TrendingUp },
    { path: '/skill-gap', label: 'Skill Gap Analyzer', icon: BookOpen },
    { path: '/learning-path', label: 'Learning Path', icon: GraduationCap },
    { path: '/course-analysis', label: 'Course Analysis', icon: FileText },
    { path: '/curriculum-analyzer', label: 'Curriculum Analyzer', icon: BookOpen },
    { path: '/district-planner', label: 'District Planner', icon: Map },
    { path: '/employer-validation', label: 'Employer Validation', icon: Building2 },
    { path: '/profile', label: 'My Profile', icon: User },
  ];

  const menuItems = isTrainee ? traineeMenuItems : standardMenuItems;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/55 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-72 overflow-y-auto border-r border-slate-800 bg-slate-950/95 text-white shadow-2xl shadow-slate-900/30 backdrop-blur-xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="mb-5 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20">
                <Sparkles size={16} />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-200">Career Intelligence</div>
                <div className="text-lg font-black tracking-tight">SKILLBRIDGE AI</div>
              </div>
            </div>
          </div>

          <h2 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            {isTrainee ? 'Student Workspace' : 'Navigation'}
          </h2>
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 768) onClose();
                  }}
                  className={`flex items-center space-x-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  <ChevronRight size={14} className={`ml-auto ${isActive ? 'text-white' : 'text-slate-500'}`} />
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
