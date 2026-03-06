import api from './api';

const notificationService = {
  getAll:      () => api.get('/notifications'),
  markRead:    (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  delete:      (id) => api.delete(`/notifications/${id}`),
};

export default notificationService;
