import api from './api';

const inquiryService = {
  getAll:        (params = {}) => api.get('/inquiries', { params }),
  getById:       (id) => api.get(`/inquiries/${id}`),
  create:        (data) => api.post('/inquiries', data),
  publicCreate:  (data) => api.post('/inquiries/public', data),
  update:        (id, data) => api.put(`/inquiries/${id}`, data),
  delete:        (id) => api.delete(`/inquiries/${id}`),
  assign:        (id, counselorId) => api.put(`/inquiries/${id}/assign`, { counselorId }),
  addNote:       (id, text) => api.post(`/inquiries/${id}/notes`, { text }),
  convert:       (id) => api.post(`/inquiries/${id}/convert`),
};

export default inquiryService;
