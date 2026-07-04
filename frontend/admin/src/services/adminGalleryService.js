import api from './api';

export const getPhotos = async () => {
  const response = await api.get('/admin/gallery/photos');
  return response.data;
};

export const getVideos = async () => {
  const response = await api.get('/admin/gallery/videos');
  return response.data;
};

export const addPhoto = async (formData, onUploadProgress) => {
  const response = await api.post('/admin/gallery/photos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
  return response.data;
};

export const updatePhoto = async (id, formData, onUploadProgress) => {
  const response = await api.put(`/admin/gallery/photos/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
  return response.data;
};

export const deletePhoto = async (id) => {
  const response = await api.delete(`/admin/gallery/photos/${id}`);
  return response.data;
};

export const addVideo = async (formData, onUploadProgress) => {
  const response = await api.post('/admin/gallery/videos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
  return response.data;
};

export const updateVideo = async (id, formData, onUploadProgress) => {
  const response = await api.put(`/admin/gallery/videos/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
  return response.data;
};

export const deleteVideo = async (id) => {
  const response = await api.delete(`/admin/gallery/videos/${id}`);
  return response.data;
};
