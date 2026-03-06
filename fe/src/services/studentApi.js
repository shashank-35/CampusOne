import axios from 'axios';

const studentApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

studentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('student_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

studentApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('student_token');
      localStorage.removeItem('student_user');
      window.location.href = '/student-login';
    }
    return Promise.reject(error);
  }
);

export default studentApi;
