import GalleryMedia from '../models/GalleryMedia.js';

// @desc    Get all active gallery media
// @route   GET /api/gallery
// @access  Public
export const getAllMedia = async (req, res, next) => {
  try {
    const query = { isActive: true };
    if (req.query.category && req.query.category.toLowerCase() !== 'all') {
      // Case insensitive match
      query.category = { $regex: new RegExp(`^${req.query.category.trim()}$`, 'i') };
    }
    const media = await GalleryMedia.find(query).sort({ createdAt: -1 });
    res.json(media);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all active photos
// @route   GET /api/gallery/photos
// @access  Public
export const getPhotos = async (req, res, next) => {
  try {
    const query = { isActive: true, mediaType: 'photo' };
    if (req.query.category && req.query.category.toLowerCase() !== 'all') {
      query.category = { $regex: new RegExp(`^${req.query.category.trim()}$`, 'i') };
    }
    const photos = await GalleryMedia.find(query).sort({ createdAt: -1 });
    res.json(photos);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all active videos
// @route   GET /api/gallery/videos
// @access  Public
export const getVideos = async (req, res, next) => {
  try {
    const query = { isActive: true, mediaType: 'video' };
    if (req.query.category && req.query.category.toLowerCase() !== 'all') {
      query.category = { $regex: new RegExp(`^${req.query.category.trim()}$`, 'i') };
    }
    const videos = await GalleryMedia.find(query).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    next(error);
  }
};
