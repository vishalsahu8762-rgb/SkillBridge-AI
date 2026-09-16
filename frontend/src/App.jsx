import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import MySkills from './pages/MySkills';
import SkillAssessment from './pages/SkillAssessment';
import SkillGap from './pages/SkillGap';
import LearningPath from './pages/LearningPath';
import JobMatch from './pages/JobMatch';
import IndustryTrends from './pages/IndustryTrends';
import Careers from './pages/Careers';
import StudentProgress from './pages/StudentProgress';
import IndustryDemand from './pages/IndustryDemand';
import CourseAnalysis from './pages/CourseAnalysis';
import CurriculumAnalyzer from './pages/CurriculumAnalyzer';
import DistrictPlanner from './pages/DistrictPlanner';
import EmployerValidation from './pages/EmployerValidation';

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      {/* Main Content */}
      <main className={`transition-all duration-300 ${
        isSidebarOpen ? 'md:ml-[18rem]' : 'md:ml-0'
      } pt-16`}>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/my-skills" element={<ProtectedRoute><MySkills /></ProtectedRoute>} />
          <Route path="/skill-assessment" element={<ProtectedRoute><SkillAssessment /></ProtectedRoute>} />
          <Route path="/industry-demand" element={<ProtectedRoute><IndustryDemand /></ProtectedRoute>} />
          <Route path="/skill-gap" element={<ProtectedRoute><SkillGap /></ProtectedRoute>} />
          <Route path="/learning-path" element={<ProtectedRoute><LearningPath /></ProtectedRoute>} />
          <Route path="/job-match" element={<ProtectedRoute><JobMatch /></ProtectedRoute>} />
          <Route path="/industry-trends" element={<ProtectedRoute><IndustryTrends /></ProtectedRoute>} />
          <Route path="/careers" element={<ProtectedRoute><Careers /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><StudentProgress /></ProtectedRoute>} />
          <Route path="/course-analysis" element={<ProtectedRoute><CourseAnalysis /></ProtectedRoute>} />
          <Route path="/curriculum-analyzer" element={<ProtectedRoute><CurriculumAnalyzer /></ProtectedRoute>} />
          <Route path="/district-planner" element={<ProtectedRoute><DistrictPlanner /></ProtectedRoute>} />
          <Route path="/employer-validation" element={<ProtectedRoute><EmployerValidation /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;
