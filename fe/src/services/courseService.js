import api from "./api";

const courseService = {
  getAll: (params) => api.get("/courses", { params }),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => {
    const formData = data instanceof FormData ? data : toFormData(data);
    return api.post("/courses", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  update: (id, data) => {
    const formData = data instanceof FormData ? data : toFormData(data);
    return api.put(`/courses/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  delete: (id) => api.delete(`/courses/${id}`),
};

function toFormData(obj) {
  const fd = new FormData();
  Object.entries(obj).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      fd.append(key, val);
    }
  });
  return fd;
}

export default courseService;
