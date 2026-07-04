import api from './api';

export const getMedia = async (category = '') => {
  const url = category && category !== 'All' ? `/gallery?category=${encodeURIComponent(category)}` : '/gallery';
  const response = await api.get(url);
  return response.data;
};

export const getPhotos = async (category = '') => {
  const url = category && category !== 'All' ? `/gallery/photos?category=${encodeURIComponent(category)}` : '/gallery/photos';
  const response = await api.get(url);
  return response.data;
};

export const getVideos = async (category = '') => {
  const url = category && category !== 'All' ? `/gallery/videos?category=${encodeURIComponent(category)}` : '/gallery/videos';
  const response = await api.get(url);
  return response.data;
};
