import api from './api';

const dashboardService = {
  getStats:               () => api.get('/dashboard/stats'),
  getMonthlyInquiries:    () => api.get('/dashboard/monthly-inquiries'),
  getInquiryStatus:       () => api.get('/dashboard/inquiry-status'),
  getRecentInquiries:     () => api.get('/dashboard/recent-inquiries'),
  getPaymentStats:        () => api.get('/dashboard/payment-stats'),
  getMonthlyRevenue:      () => api.get('/dashboard/monthly-revenue'),
};

export default dashboardService;
