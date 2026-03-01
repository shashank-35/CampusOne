import api from "./api";

const todoService = {
  getAll: (params) => api.get("/todos", { params }),
  getById: (id) => api.get(`/todos/${id}`),
  create: (data) => api.post("/todos", data),
  update: (id, data) => api.put(`/todos/${id}`, data),
  delete: (id) => api.delete(`/todos/${id}`),
};

export default todoService;
