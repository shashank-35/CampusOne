import api from './api';

const admissionService = {
  getAll: (params = {}) => api.get('/admissions', { params }),
  getById: (id) => api.get(`/admissions/${id}`),
  create: (data) => api.post('/admissions', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => api.put(`/admissions/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/admissions/${id}`),

  // Convert inquiry to admission
  convertFromInquiry: (inquiryId, data) =>
    api.post(`/inquiries/${inquiryId}/convert-admission`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default admissionService;
