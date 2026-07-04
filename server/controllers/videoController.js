import { Readable } from 'stream';
import cloudinary from '../config/cloudinary.js';
import GalleryMedia from '../models/GalleryMedia.js';

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, folder, resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    const stream = new Readable();
    stream.push(fileBuffer);
    stream.push(null);
    stream.pipe(uploadStream);
  });
};

// URL validation helpers
const getYoutubeEmbedUrl = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return null;
};

const getInstagramEmbedUrl = (url) => {
  const regExp = /(?:instagram\.com\/(?:p|reel)\/)([^/?#&]+)/i;
  const match = url.match(regExp);
  if (match && match[1]) {
    return `https://www.instagram.com/reel/${match[1]}/embed`;
  }
  return null;
};

// @desc    Upload / add new video
// @route   POST /api/admin/gallery/videos
// @access  Private/Admin
export const createVideo = async (req, res, next) => {
  try {
    const { title, description, category, externalUrl, location } = req.body;

    if (!title || !category) {
      res.status(400);
      throw new Error('Title and category are required.');
    }

    let mediaUrl = '';
    let publicId = 'external';
    let thumbnailUrl = '';
    let thumbnailPublicId = '';

    // Multer files
    const videoFile = req.files && req.files.videoFile ? req.files.videoFile[0] : null;
    const thumbnailFile = req.files && req.files.thumbnailFile ? req.files.thumbnailFile[0] : null;

    // Process main video source
    if (videoFile) {
      const videoResult = await uploadToCloudinary(videoFile.buffer, 'gallery/videos', 'video');
      mediaUrl = videoResult.secure_url;
      publicId = videoResult.public_id;
    } else if (externalUrl) {
      let embedUrl = getYoutubeEmbedUrl(externalUrl) || getInstagramEmbedUrl(externalUrl);
      if (!embedUrl) {
        if (externalUrl.startsWith('http://') || externalUrl.startsWith('https://')) {
          embedUrl = externalUrl;
        } else {
          res.status(400);
          throw new Error('Invalid video URL format. Must be YouTube, Instagram Reel, or direct HTTP video link.');
        }
      }
      mediaUrl = embedUrl;
    } else {
      res.status(400);
      throw new Error('Please upload a video file or provide a valid external URL.');
    }

    // Process optional thumbnail
    if (thumbnailFile) {
      const thumbResult = await uploadToCloudinary(thumbnailFile.buffer, 'gallery/videos/thumbnails', 'image');
      thumbnailUrl = thumbResult.secure_url;
      thumbnailPublicId = thumbResult.public_id;
    } else if (externalUrl) {
      // Auto-extract thumbnail for YouTube
      const ytMatch = externalUrl.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
      if (ytMatch && ytMatch[2].length === 11) {
        thumbnailUrl = `https://img.youtube.com/vi/${ytMatch[2]}/mqdefault.jpg`;
      }
    }

    const video = new GalleryMedia({
      title,
      description,
      mediaType: 'video',
      category: category.trim(),
      mediaUrl,
      thumbnailUrl,
      publicId,
      thumbnailPublicId,
      altText: title,
      location: location ? location.trim() : '',
      isActive: true,
    });

    const savedVideo = await video.save();
    res.status(201).json(savedVideo);
  } catch (error) {
    next(error);
  }
};

// @desc    Update video details
// @route   PUT /api/admin/gallery/videos/:id
// @access  Private/Admin
export const updateVideo = async (req, res, next) => {
  try {
    const { title, description, category, externalUrl, isActive, location } = req.body;
    const videoId = req.params.id;

    const video = await GalleryMedia.findById(videoId);

    if (!video || video.mediaType !== 'video') {
      res.status(404);
      throw new Error('Video not found.');
    }

    // Update basic details
    video.title = title || video.title;
    video.description = description !== undefined ? description : video.description;
    video.category = category ? category.trim() : video.category;
    video.isActive = isActive !== undefined ? isActive : video.isActive;
    video.location = location !== undefined ? location.trim() : video.location;

    const videoFile = req.files && req.files.videoFile ? req.files.videoFile[0] : null;
    const thumbnailFile = req.files && req.files.thumbnailFile ? req.files.thumbnailFile[0] : null;

    // Handle new video file upload
    if (videoFile) {
      if (video.publicId && video.publicId !== 'external') {
        await cloudinary.uploader.destroy(video.publicId, { resource_type: 'video' });
      }
      const videoResult = await uploadToCloudinary(videoFile.buffer, 'gallery/videos', 'video');
      video.mediaUrl = videoResult.secure_url;
      video.publicId = videoResult.public_id;
    } else if (externalUrl !== undefined && externalUrl !== '') {
      // If switching to external URL, clean up old Cloudinary video file
      if (video.publicId && video.publicId !== 'external') {
        await cloudinary.uploader.destroy(video.publicId, { resource_type: 'video' });
      }
      let embedUrl = getYoutubeEmbedUrl(externalUrl) || getInstagramEmbedUrl(externalUrl);
      if (!embedUrl) {
        if (externalUrl.startsWith('http://') || externalUrl.startsWith('https://')) {
          embedUrl = externalUrl;
        } else {
          res.status(400);
          throw new Error('Invalid video URL format.');
        }
      }
      video.mediaUrl = embedUrl;
      video.publicId = 'external';
    }

    // Handle new thumbnail file upload
    if (thumbnailFile) {
      if (video.thumbnailPublicId) {
        await cloudinary.uploader.destroy(video.thumbnailPublicId);
      }
      const thumbResult = await uploadToCloudinary(thumbnailFile.buffer, 'gallery/videos/thumbnails', 'image');
      video.thumbnailUrl = thumbResult.secure_url;
      video.thumbnailPublicId = thumbResult.public_id;
    } else if (externalUrl && !thumbnailFile) {
      // If externalUrl was updated and no thumbnail file uploaded, try generating youtube thumb
      const ytMatch = externalUrl.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
      if (ytMatch && ytMatch[2].length === 11) {
        video.thumbnailUrl = `https://img.youtube.com/vi/${ytMatch[2]}/mqdefault.jpg`;
        if (video.thumbnailPublicId) {
          await cloudinary.uploader.destroy(video.thumbnailPublicId);
          video.thumbnailPublicId = '';
        }
      }
    }

    const updatedVideo = await video.save();
    res.json(updatedVideo);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete video
// @route   DELETE /api/admin/gallery/videos/:id
// @access  Private/Admin
export const deleteVideo = async (req, res, next) => {
  try {
    const videoId = req.params.id;
    const video = await GalleryMedia.findById(videoId);

    if (!video || video.mediaType !== 'video') {
      res.status(404);
      throw new Error('Video not found.');
    }

    // 1. Delete video from Cloudinary if not external
    if (video.publicId && video.publicId !== 'external') {
      await cloudinary.uploader.destroy(video.publicId, { resource_type: 'video' });
    }

    // 2. Delete thumbnail from Cloudinary if it was custom uploaded
    if (video.thumbnailPublicId) {
      await cloudinary.uploader.destroy(video.thumbnailPublicId);
    }

    // 3. Delete database record
    await video.deleteOne();

    res.json({ success: true, message: 'Video deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all videos (active and inactive) for admin
// @route   GET /api/admin/gallery/videos
// @access  Private/Admin
export const getAdminVideos = async (req, res, next) => {
  try {
    const videos = await GalleryMedia.find({ mediaType: 'video' }).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    next(error);
  }
};

