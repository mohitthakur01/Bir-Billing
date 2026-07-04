import api from './api';

export const submitMessage = async (messageData) => {
  const response = await api.post('/contact', messageData);
  return response.data;
};
