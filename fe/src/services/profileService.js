import api from './api';

const profileService = {
  get:             () => api.get('/profile'),
  update:          (data) => api.put('/profile', data),
  changePassword:  (data) => api.put('/profile/password', data),
  uploadImage:     (formData) => api.put('/profile/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export default profileService;
