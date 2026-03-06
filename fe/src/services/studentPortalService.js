import studentApi from './studentApi';
import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const studentPortalService = {
  // Auth — hits the same login endpoint, client verifies role === 'student'
  login: (data) => axios.post(`${BASE}/auth/login`, data),

  // Dashboard
  getDashboard: () => studentApi.get('/student-portal/dashboard'),

  // Profile
  getProfile:      () => studentApi.get('/student-portal/profile'),
  updateProfile:   (data) => studentApi.put('/student-portal/profile', data),
  changePassword:  (data) => studentApi.put('/student-portal/password', data),

  // Courses
  getCourses: () => studentApi.get('/student-portal/courses'),

  // Events
  getEvents: () => studentApi.get('/student-portal/events'),

  // Inquiry status
  getInquiry: () => studentApi.get('/student-portal/inquiry'),
};

export default studentPortalService;
