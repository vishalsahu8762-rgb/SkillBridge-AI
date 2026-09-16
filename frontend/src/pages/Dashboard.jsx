import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  BookOpen,
  Filter,
  X,
  Sparkles,
  Target,
  Award,
  ArrowRight,
  Briefcase,
  CheckCircle,
  Activity,
  PlusCircle
} from 'lucide-react';
import StatCard from '../components/StatCard';
import DemandChart from '../components/DemandChart';
import SkillBar from '../components/SkillBar';
import { useAuth } from '../context/AuthContext';
import {
  getDemandStats,
  getDemandSkills,
  getDemandRoles,
  getDemandLocations,
  getDemandIndustries,
  getTrendingSkills,
  getFilterOptions,
  getStudentWorkspace
} from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [studentData, setStudentData] = useState(null);

  // Industry Demand Dashboard State
  const [stats, setStats] = useState(null);
  const [skills, setSkills] = useState([]);
  const [roles, setRoles] = useState([]);
  const [locations, setLocations] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [trending, setTrending] = useState([]);
  const [filterOptions, setFilterOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    district: '',
    industry: '',
    jobRole: '',
    skill: ''
  });

  useEffect(() => {
    if (user?.role === 'TRAINEE') {
      fetchStudentDashboard();
    } else {
      fetchAllData();
    }
  }, [user]);

  useEffect(() => {
    if (filterOptions && user?.role !== 'TRAINEE') {
      fetchFilteredData();
    }
  }, [filters]);

  const fetchStudentDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getStudentWorkspace();
      setStudentData(res.data);
    } catch (err) {
      console.error('Error fetching student dashboard:', err);
      setError('Failed to load student dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, skillsRes, rolesRes, locationsRes, industriesRes, trendingRes, filterRes] = await Promise.all([
        getDemandStats(),
        getDemandSkills(),
        getDemandRoles(),
        getDemandLocations(),
        getDemandIndustries(),
        getTrendingSkills(),
        getFilterOptions()
      ]);

      setStats(statsRes.data);
      setSkills(skillsRes.data);
      setRoles(rolesRes.data);
      setLocations(locationsRes.data);
      setIndustries(industriesRes.data);
      setTrending(trendingRes.data);
      setFilterOptions(filterRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, skillsRes, rolesRes, locationsRes, industriesRes, trendingRes] = await Promise.all([
        getDemandStats(filters),
        getDemandSkills(filters),
        getDemandRoles(filters),
        getDemandLocations(filters),
        getDemandIndustries(filters),
        getTrendingSkills(filters)
      ]);

      setStats(statsRes.data);
      setSkills(skillsRes.data);
      setRoles(rolesRes.data);
      setLocations(locationsRes.data);
      setIndustries(industriesRes.data);
      setTrending(trendingRes.data);
    } catch (error) {
      console.error('Error fetching filtered data:', error);
      setError('Failed to load filtered data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ district: '', industry: '', jobRole: '', skill: '' });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => user?.role === 'TRAINEE' ? fetchStudentDashboard() : fetchAllData()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // TRAINEE / STUDENT WORKSPACE DASHBOARD VIEW
  // ----------------------------------------------------
  if (user?.role === 'TRAINEE' && studentData) {
    const readiness = studentData.readinessScore || 72;
    const targetRole = studentData.targetRole || 'Full Stack Developer';
    const hour = new Date().getHours();
    const greeting = hour >= 5 && hour < 12
      ? 'Good morning'
      : hour >= 12 && hour < 17
        ? 'Good afternoon'
        : 'Good evening';

    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="rounded-[28px] bg-gradient-to-br from-slate-950 via-sky-950 to-blue-900 p-6 text-white shadow-[0_20px_45px_rgba(15,23,42,0.18)] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-sky-100">
              Student Workspace
            </span>
            <h1 className="mt-3 text-3xl font-black tracking-tight">{greeting}, {user.name}</h1>
            <p className="mt-2 text-sm text-sky-100 flex items-center gap-2">
              <Target size={16} className="text-cyan-300" />
              <span>Here’s your SkillBridge AI career intelligence overview.</span>
            </p>
            <p className="mt-2 text-sm text-sky-100/80 flex flex-wrap items-center gap-2">
              <span>Target Career: <strong>{targetRole}</strong></span>
              <span className="text-sky-300">•</span>
              <span>District: <strong>{user.district || 'Bhopal'}</strong></span>
            </p>
          </div>

          <div className="min-w-[160px] rounded-2xl border border-white/10 bg-white/10 p-4 text-center backdrop-blur-md">
            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-sky-200">Overall Readiness</span>
            <span className="mt-2 block text-3xl font-black text-cyan-300">{readiness}%</span>
          </div>
        </div>

        {/* Quick Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <StatCard
            title="Current Skills"
            value={studentData.stats.currentSkillsCount.toString()}
            icon={BookOpen}
            color="blue"
          />
          <StatCard
            title="Missing Skills"
            value={studentData.stats.missingSkillsCount.toString()}
            icon={Target}
            color="red"
          />
          <StatCard
            title="Job Matches"
            value={`${studentData.stats.jobMatchesCount} Openings`}
            icon={Briefcase}
            color="green"
          />
          <StatCard
            title="Career Readiness"
            value={`${readiness}%`}
            icon={Award}
            color="purple"
          />
        </div>

        {/* Top Priority Skills & Recommended Next Step */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Priority Skills */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
              <Sparkles size={20} className="text-amber-500" />
              Top Priority Skills to Learn
            </h3>

            <div className="space-y-2.5">
              {studentData.prioritySkills.map((sk, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-red-50/60 rounded-xl border border-red-100">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                    <span className="bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-black">
                      {idx + 1}
                    </span>
                    <span>{sk}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/skill-assessment?skill=${encodeURIComponent(sk)}`)}
                    className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Take Quiz
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Next Step */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
                <ArrowRight size={20} className="text-blue-600" />
                Recommended Next Action
              </h3>

              <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-100 my-3">
                <span className="text-xs font-extrabold text-blue-800 uppercase block mb-1">Action Plan:</span>
                <p className="text-base font-bold text-gray-900">{studentData.recommendedNextStep}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Completing this action will increase your career readiness score for <strong>{targetRole}</strong>.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate('/skill-assessment')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl transition-colors shadow text-xs flex items-center justify-center gap-1.5"
              >
                <Sparkles size={16} />
                <span>Start Assessment</span>
              </button>
              <button
                onClick={() => navigate('/learning-path')}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-4 rounded-xl transition-colors text-xs flex items-center justify-center gap-1.5"
              >
                <BookOpen size={16} />
                <span>Learning Path</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <button
            onClick={() => navigate('/my-skills')}
            className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all text-left group"
          >
            <BookOpen className="text-blue-600 mb-2 group-hover:scale-110 transition-transform" size={24} />
            <h4 className="font-bold text-gray-800 text-sm">My Skills</h4>
            <p className="text-xs text-gray-500 mt-0.5">Manage skill portfolio</p>
          </button>

          <button
            onClick={() => navigate('/job-match')}
            className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all text-left group"
          >
            <Briefcase className="text-emerald-600 mb-2 group-hover:scale-110 transition-transform" size={24} />
            <h4 className="font-bold text-gray-800 text-sm">Job Match</h4>
            <p className="text-xs text-gray-500 mt-0.5">View {studentData.stats.jobMatchesCount} openings</p>
          </button>

          <button
            onClick={() => navigate('/industry-trends')}
            className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all text-left group"
          >
            <TrendingUp className="text-purple-600 mb-2 group-hover:scale-110 transition-transform" size={24} />
            <h4 className="font-bold text-gray-800 text-sm">Industry Trends</h4>
            <p className="text-xs text-gray-500 mt-0.5">Skills to watch</p>
          </button>

          <button
            onClick={() => navigate('/progress')}
            className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all text-left group"
          >
            <Activity className="text-amber-500 mb-2 group-hover:scale-110 transition-transform" size={24} />
            <h4 className="font-bold text-gray-800 text-sm">My Progress</h4>
            <p className="text-xs text-gray-500 mt-0.5">Readiness: {readiness}%</p>
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // STANDARD INDUSTRY DEMAND DASHBOARD VIEW (Employer / Admin / Default)
  // ----------------------------------------------------
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Industry Demand Dashboard</h1>
          <p className="text-sm text-orange-600 font-medium mt-1">⚠️ PROTOTYPE DATA - For demonstration purposes only</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Filter size={20} />
          <span>Filters</span>
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Filter Dashboard</h3>
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 text-red-600 hover:text-red-700"
            >
              <X size={16} />
              <span>Clear All</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
              <select
                value={filters.district}
                onChange={(e) => handleFilterChange('district', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Districts</option>
                {filterOptions?.districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <select
                value={filters.industry}
                onChange={(e) => handleFilterChange('industry', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Industries</option>
                {filterOptions?.industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Role</label>
              <select
                value={filters.jobRole}
                onChange={(e) => handleFilterChange('jobRole', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Roles</option>
                {filterOptions?.jobRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skill</label>
              <select
                value={filters.skill}
                onChange={(e) => handleFilterChange('skill', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Skills</option>
                {filterOptions?.skills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Jobs"
          value={stats?.totalJobs ? stats.totalJobs.toLocaleString() : '--'}
          icon={LayoutDashboard}
          color="blue"
        />
        <StatCard
          title="Most Demanded Skill"
          value={stats?.mostDemandedSkill || '--'}
          icon={BookOpen}
          color="green"
        />
        <StatCard
          title="Fastest Growing Skill"
          value={stats?.fastestGrowingSkill || '--'}
          icon={TrendingUp}
          color="purple"
        />
        <StatCard
          title="Most Demanded Role"
          value={stats?.mostDemandedRole || '--'}
          icon={Users}
          color="orange"
        />
        <StatCard
          title="High Priority Courses"
          value={stats?.highPriorityCourses?.length ? stats.highPriorityCourses.length.toString() : '--'}
          icon={BookOpen}
          color="red"
        />
        <StatCard
          title="Oversupplied Courses"
          value={stats?.oversuppliedCourses?.length ? stats.oversuppliedCourses.length.toString() : '--'}
          icon={BookOpen}
          color="indigo"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DemandChart
          type="bar"
          data={skills.map(s => ({ name: s.skill, value: s.demand }))}
          title="Top Demanded Skills"
          dataKey="value"
          nameKey="name"
        />
        <DemandChart
          type="bar"
          data={roles.map(r => ({ name: r.role, value: r.demand }))}
          title="Job Role Demand"
          dataKey="value"
          nameKey="name"
        />
        <DemandChart
          type="pie"
          data={locations.map(l => ({ name: l.location, value: l.demand }))}
          title="Location-wise Demand"
          dataKey="value"
          nameKey="name"
        />
        <DemandChart
          type="pie"
          data={industries.map(i => ({ name: i.industry, value: i.demand }))}
          title="Industry Demand Distribution"
          dataKey="value"
          nameKey="name"
        />
      </div>

      {/* Trending Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DemandChart
          type="line"
          data={trending.map(t => ({ name: t.skill, value: parseFloat(t.avgGrowthRate) }))}
          title="Trending Skills (Growth Rate %)"
          dataKey="value"
          nameKey="name"
        />
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Skill Demand Percentage</h3>
          <div className="space-y-2">
            {skills.slice(0, 8).map((skill, index) => (
              <SkillBar
                key={skill.skill}
                skill={skill.skill}
                percentage={parseFloat(skill.percentage)}
                color={['blue', 'green', 'purple', 'orange', 'red', 'indigo'][index % 6]}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Course Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 High Priority Courses</h3>
          <ul className="space-y-2">
            {stats?.highPriorityCourses?.map((course, index) => (
              <li key={index} className="flex items-center text-gray-700">
                <span className="text-green-500 mr-2">✓</span>
                {course}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">⚠️ Oversupplied Courses</h3>
          <ul className="space-y-2">
            {stats?.oversuppliedCourses?.map((course, index) => (
              <li key={index} className="flex items-center text-gray-700">
                <span className="text-red-500 mr-2">!</span>
                {course}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
