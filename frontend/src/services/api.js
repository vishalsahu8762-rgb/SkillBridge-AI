import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach auth token header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('skillsync_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API endpoints
export const signupApi = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error.response?.data?.message || error.message || 'Signup failed';
  }
};

export const loginApi = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error.response?.data?.message || error.message || 'Invalid email or password';
  }
};

export const getProfileApi = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

export const updateProfileApi = async (updatedData) => {
  try {
    const response = await api.put('/auth/profile', updatedData);
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error.response?.data?.message || error.message || 'Failed to update profile';
  }
};

export const logoutApi = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    return { success: true };
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

// Demand API endpoints
export const getDemandStats = async (filters = {}) => {
  try {
    const response = await api.get('/demand/stats', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching demand stats:', error);
    throw error;
  }
};

export const getDemandSkills = async (filters = {}) => {
  try {
    const response = await api.get('/demand/skills', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching demand skills:', error);
    throw error;
  }
};

export const getDemandRoles = async (filters = {}) => {
  try {
    const response = await api.get('/demand/roles', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching demand roles:', error);
    throw error;
  }
};

export const getDemandLocations = async (filters = {}) => {
  try {
    const response = await api.get('/demand/locations', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching demand locations:', error);
    throw error;
  }
};

export const getDemandIndustries = async (filters = {}) => {
  try {
    const response = await api.get('/demand/industries', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching demand industries:', error);
    throw error;
  }
};

export const getTrendingSkills = async (filters = {}) => {
  try {
    const response = await api.get('/demand/trending', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching trending skills:', error);
    throw error;
  }
};

export const getFilterOptions = async () => {
  try {
    const response = await api.get('/demand/filters');
    return response.data;
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw error;
  }
};

// Skill API endpoints
export const analyzeSkills = async (role, currentSkills) => {
  try {
    const response = await api.post('/skills/analyze', { role, currentSkills });
    return response.data;
  } catch (error) {
    console.error('Error analyzing skills:', error);
    throw error;
  }
};

export const getSkillRecommendations = async (role, missingSkills, currentReadiness) => {
  try {
    const response = await api.post('/skills/recommendations', { role, missingSkills, currentReadiness });
    return response.data;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
};

export const getJobRoles = async () => {
  try {
    const response = await api.get('/skills/roles');
    return response.data;
  } catch (error) {
    console.error('Error fetching job roles:', error);
    throw error;
  }
};

export const getAllSkills = async () => {
  try {
    const response = await api.get('/skills/skills');
    return response.data;
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
};

export const getRoleSkills = async (role) => {
  try {
    const response = await api.get(`/skills/roles/${encodeURIComponent(role)}/skills`);
    return response.data;
  } catch (error) {
    console.error('Error fetching role skills:', error);
    throw error;
  }
};

export const sendSkillGapChatMessage = async (question, context = {}, history = []) => {
  try {
    const response = await api.post('/chat/skill-gap', {
      question,
      context,
      history: history.slice(-6)
    });
    return response.data;
  } catch (error) {
    console.error('Error sending skill-gap chat message:', error);
    throw error;
  }
};

// Course API endpoints
export const getCourses = async () => {
  try {
    const response = await api.get('/courses');
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const getCourseById = async (id) => {
  try {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course by id:', error);
    throw error;
  }
};

export const addCourse = async (courseData) => {
  try {
    const response = await api.post('/courses', courseData);
    return response.data;
  } catch (error) {
    console.error('Error adding course:', error);
    throw error;
  }
};

export const analyzeCoursePayload = async (courseData) => {
  try {
    const response = await api.post('/courses/analyze', courseData);
    return response.data;
  } catch (error) {
    console.error('Error analyzing course payload:', error);
    throw error;
  }
};

// Curriculum API endpoints
export const analyzeCurriculum = async (courseId) => {
  try {
    const response = await api.get(`/curriculum/analyze/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error analyzing curriculum:', error);
    throw error;
  }
};

export const acceptCurriculumRecommendation = async (courseId) => {
  try {
    const response = await api.post(`/curriculum/accept/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error accepting curriculum recommendation:', error);
    throw error;
  }
};

export const rejectCurriculumRecommendation = async (courseId) => {
  try {
    const response = await api.post(`/curriculum/reject/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error rejecting curriculum recommendation:', error);
    throw error;
  }
};

// District API endpoints
export const getDistricts = async () => {
  try {
    const response = await api.get('/districts');
    return response.data;
  } catch (error) {
    console.error('Error fetching districts:', error);
    throw error;
  }
};

export const getDistrictAnalysis = async (districtName, filters = {}) => {
  try {
    const response = await api.get(`/districts/${encodeURIComponent(districtName)}`, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching district analysis:', error);
    throw error;
  }
};

// Employer Validation API endpoints
export const getEmployers = async () => {
  try {
    const response = await api.get('/employers');
    return response.data;
  } catch (error) {
    console.error('Error fetching employers:', error);
    throw error;
  }
};

export const getEmployerById = async (id) => {
  try {
    const response = await api.get(`/employers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching employer by id:', error);
    throw error;
  }
};

export const getSkillValidation = async (role = '') => {
  try {
    const response = await api.get('/employer-validation/skills', { params: { role } });
    return response.data;
  } catch (error) {
    console.error('Error fetching skill validation:', error);
    throw error;
  }
};

export const getCourseValidation = async () => {
  try {
    const response = await api.get('/employer-validation/courses');
    return response.data;
  } catch (error) {
    console.error('Error fetching course validation:', error);
    throw error;
  }
};

export const submitEmployerValidation = async (feedbackData) => {
  try {
    const response = await api.post('/employer-validation', feedbackData);
    return response.data;
  } catch (error) {
    console.error('Error submitting employer validation:', error);
    throw error;
  }
};

// Student Workspace API endpoints
export const getStudentWorkspace = async () => {
  try {
    const response = await api.get('/student/workspace');
    return response.data;
  } catch (error) {
    console.error('Error fetching student workspace:', error);
    throw error;
  }
};

export const updateStudentSkill = async (skill, level = 'Intermediate') => {
  try {
    const response = await api.post('/student/skills', { skill, level });
    return response.data;
  } catch (error) {
    console.error('Error updating student skill:', error);
    throw error;
  }
};

export const removeStudentSkill = async (skillName) => {
  try {
    const response = await api.delete(`/student/skills/${encodeURIComponent(skillName)}`);
    return response.data;
  } catch (error) {
    console.error('Error removing student skill:', error);
    throw error;
  }
};

export const getAssessmentQuestions = async (skill) => {
  try {
    const response = await api.get(`/student/assessment/questions/${encodeURIComponent(skill)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching assessment questions:', error);
    throw error;
  }
};

export const submitAssessment = async (skill, answers) => {
  try {
    const response = await api.post('/student/assessment/submit', { skill, answers });
    return response.data;
  } catch (error) {
    console.error('Error submitting assessment:', error);
    throw error;
  }
};

export const getStudentJobMatches = async () => {
  try {
    const response = await api.get('/student/job-matches');
    return response.data;
  } catch (error) {
    console.error('Error fetching job matches:', error);
    throw error;
  }
};

export const getStudentCareers = async () => {
  try {
    const response = await api.get('/student/careers');
    return response.data;
  } catch (error) {
    console.error('Error fetching careers exploration:', error);
    throw error;
  }
};

export default api;
