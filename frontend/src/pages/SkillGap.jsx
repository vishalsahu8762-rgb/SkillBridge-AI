import React, { useState, useEffect } from 'react';
import { Brain, ArrowRight } from 'lucide-react';
import SkillSelector from '../components/SkillSelector';
import SkillGapCard from '../components/SkillGapCard';
import ReadinessProgress from '../components/ReadinessProgress';
import RecommendationCard from '../components/RecommendationCard';
import CareerAssistant from '../components/CareerAssistant';
import {
  getJobRoles,
  getAllSkills,
  analyzeSkills,
  getSkillRecommendations
} from '../services/api';

import { useAuth } from '../context/AuthContext';

const SkillGap = () => {
  const { user } = useAuth();
  const [jobRoles, setJobRoles] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [selectedRole, setSelectedRole] = useState(user?.targetRole || '');
  const [selectedSkills, setSelectedSkills] = useState(user?.currentSkills || []);
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (user) {
      if (user.targetRole && !selectedRole) setSelectedRole(user.targetRole);
      if (user.currentSkills && user.currentSkills.length > 0 && selectedSkills.length === 0) {
        setSelectedSkills(user.currentSkills);
      }
    }
  }, [user]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [rolesRes, skillsRes] = await Promise.all([
        getJobRoles(),
        getAllSkills()
      ]);
      setJobRoles(rolesRes.data);
      setAvailableSkills(skillsRes.data);
      if (user?.targetRole && rolesRes.data.includes(user.targetRole)) {
        setSelectedRole(user.targetRole);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setError('Failed to load data. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleAnalyze = async () => {
    if (!selectedRole) {
      setError('Please select a job role');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const analysisRes = await analyzeSkills(selectedRole, selectedSkills);
      setAnalysis(analysisRes.data);

      if (analysisRes.data.missingSkills.length > 0) {
        const missingSkillsWithPriority = analysisRes.data.missingSkills.map(skill => {
          let priority = 'low';
          if (analysisRes.data.gapLevels.high.includes(skill)) priority = 'high';
          else if (analysisRes.data.gapLevels.medium.includes(skill)) priority = 'medium';
          return { skill, priority };
        });

        const recRes = await getSkillRecommendations(
          selectedRole,
          missingSkillsWithPriority,
          analysisRes.data.readinessScore
        );
        setRecommendations(recRes.data);

        sessionStorage.setItem('skillGapAnalysis', JSON.stringify({
          role: selectedRole,
          currentSkills: selectedSkills,
          analysis: analysisRes.data,
          recommendations: recRes.data
        }));
      } else {
        setRecommendations(null);
        sessionStorage.setItem('skillGapAnalysis', JSON.stringify({
          role: selectedRole,
          currentSkills: selectedSkills,
          analysis: analysisRes.data,
          recommendations: null
        }));
      }
    } catch (error) {
      console.error('Error analyzing skills:', error);
      setError('Failed to analyze skills. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedRole('');
    setSelectedSkills([]);
    setAnalysis(null);
    setRecommendations(null);
    setError(null);
  };

  const assistantContext = {
    targetRole: selectedRole,
    currentSkills: selectedSkills,
    matchedSkills: analysis?.matchedSkills || [],
    missingSkills: analysis?.missingSkills || [],
    gapLevels: analysis?.gapLevels || {},
    recommendations: recommendations || null,
    learningPath: recommendations?.learningPath || [],
    readinessScore: analysis?.readinessScore || null
  };

  if (loading && !analysis) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Brain className="text-blue-600" />
          AI-Assisted Skill Gap Analyzer
        </h1>
        <p className="text-sm text-orange-600 font-medium mt-1">?? PROTOTYPE DATA - Rule-based matching for demonstration</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Step 1: Select Target Job Role</h3>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="">Choose a job role...</option>
          {jobRoles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      <SkillSelector
        availableSkills={availableSkills}
        selectedSkills={selectedSkills}
        onSkillToggle={handleSkillToggle}
        label="Step 2: Select Your Current Skills"
      />

      <div className="flex gap-4 mb-6">
        <button
          onClick={handleAnalyze}
          disabled={!selectedRole || loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Brain size={20} />
          <span>Analyze Skill Gap</span>
        </button>
        <button
          onClick={handleReset}
          disabled={loading}
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Reset
        </button>
      </div>

      {analysis && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReadinessProgress
              readinessScore={analysis.readinessScore}
              expectedReadiness={recommendations?.expectedReadiness}
            />
            <SkillGapCard
              matchedSkills={analysis.matchedSkills}
              missingSkills={analysis.missingSkills}
              gapLevels={analysis.gapLevels}
            />
          </div>

          {recommendations && (
            <div className="flex items-center gap-2 text-gray-600">
              <ArrowRight size={20} />
              <span>View your personalized learning path in the Learning Path section</span>
            </div>
          )}
        </div>
      )}

      {recommendations && (
        <div className="mt-6">
          <RecommendationCard
            learningPath={recommendations.learningPath}
            totalDuration={recommendations.totalDuration}
            message={recommendations.message}
          />
        </div>
      )}

      <CareerAssistant context={assistantContext} />
    </div>
  );
};

export default SkillGap;
