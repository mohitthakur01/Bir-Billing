import api from './api';

export const getMessages = async () => {
  const response = await api.get('/contact/admin');
  return response.data;
};

export const deleteMessage = async (id) => {
  const response = await api.delete(`/contact/admin/${id}`);
  return response.data;
};
