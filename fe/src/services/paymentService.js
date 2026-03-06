import api from './api';

const paymentService = {
  getAll:  (params = {}) => api.get('/payments', { params }),
  getById: (id) => api.get(`/payments/${id}`),
  create:  (data) => api.post('/payments', data),
  update:  (id, data) => api.put(`/payments/${id}`, data),
  delete:  (id) => api.delete(`/payments/${id}`),

  // Download receipt as PDF blob
  downloadReceipt: async (id) => {
    const res = await api.get(`/payments/${id}/receipt`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

export default paymentService;
