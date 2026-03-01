import api from "./api";

const inquiryService = {
  getAll: (params) => api.get("/inquiries", { params }),
  getById: (id) => api.get(`/inquiries/${id}`),
  create: (data) => api.post("/inquiries", data),
  update: (id, data) => api.put(`/inquiries/${id}`, data),
  delete: (id) => api.delete(`/inquiries/${id}`),
};

export default inquiryService;
