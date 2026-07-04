import api from './api';

export const register = async (name, email, password, code) => {
  const response = await api.post('/admin/register', { name, email, password, code });
  if (response.data && response.data.token) {
    localStorage.setItem('adminToken', response.data.token);
    localStorage.setItem('adminUser', JSON.stringify(response.data));
  }
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/admin/login', { email, password });
  if (response.data && response.data.token) {
    localStorage.setItem('adminToken', response.data.token);
    localStorage.setItem('adminUser', JSON.stringify(response.data));
  }
  return response.data;
};

export const logout = async () => {
  try {
    await api.post('/admin/logout');
  } catch (err) {
    console.error('Backend logout call failed, cleaning client cache anyway', err);
  }
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
};

export const getMe = async () => {
  const response = await api.get('/admin/me');
  return response.data;
};
