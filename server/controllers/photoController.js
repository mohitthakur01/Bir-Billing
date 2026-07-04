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

// @desc    Upload new photo
// @route   POST /api/admin/gallery/photos
// @access  Private/Admin
export const createPhoto = async (req, res, next) => {
  try {
    const { title, description, category, altText, location } = req.body;

    if (!title || !category) {
      res.status(400);
      throw new Error('Title and category are required.');
    }

    if (!req.file) {
      res.status(400);
      throw new Error('Please select an image file to upload.');
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, 'gallery/photos', 'image');

    const photo = new GalleryMedia({
      title,
      description,
      mediaType: 'photo',
      category: category.trim(),
      mediaUrl: result.secure_url,
      publicId: result.public_id,
      altText: altText || title,
      location: location ? location.trim() : '',
      isActive: true,
    });

    const savedPhoto = await photo.save();
    res.status(201).json(savedPhoto);
  } catch (error) {
    next(error);
  }
};

// @desc    Update photo details
// @route   PUT /api/admin/gallery/photos/:id
// @access  Private/Admin
export const updatePhoto = async (req, res, next) => {
  try {
    const { title, description, category, altText, isActive, location } = req.body;
    const photoId = req.params.id;

    const photo = await GalleryMedia.findById(photoId);

    if (!photo || photo.mediaType !== 'photo') {
      res.status(404);
      throw new Error('Photo not found.');
    }

    // Update details
    photo.title = title || photo.title;
    photo.description = description !== undefined ? description : photo.description;
    photo.category = category ? category.trim() : photo.category;
    photo.altText = altText !== undefined ? altText : photo.altText;
    photo.isActive = isActive !== undefined ? isActive : photo.isActive;
    photo.location = location !== undefined ? location.trim() : photo.location;

    // Optional: Support updating the image file itself during detail edits
    if (req.file) {
      // Delete old photo from Cloudinary first
      await cloudinary.uploader.destroy(photo.publicId);
      // Upload new image
      const result = await uploadToCloudinary(req.file.buffer, 'gallery/photos', 'image');
      photo.mediaUrl = result.secure_url;
      photo.publicId = result.public_id;
    }

    const updatedPhoto = await photo.save();
    res.json(updatedPhoto);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete photo
// @route   DELETE /api/admin/gallery/photos/:id
// @access  Private/Admin
export const deletePhoto = async (req, res, next) => {
  try {
    const photoId = req.params.id;
    const photo = await GalleryMedia.findById(photoId);

    if (!photo || photo.mediaType !== 'photo') {
      res.status(404);
      throw new Error('Photo not found.');
    }

    // 1. Delete from Cloudinary
    await cloudinary.uploader.destroy(photo.publicId);

    // 2. Delete from database
    await photo.deleteOne();

    res.json({ success: true, message: 'Photo deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all photos (active and inactive) for admin
// @route   GET /api/admin/gallery/photos
// @access  Private/Admin
export const getAdminPhotos = async (req, res, next) => {
  try {
    const photos = await GalleryMedia.find({ mediaType: 'photo' }).sort({ createdAt: -1 });
    res.json(photos);
  } catch (error) {
    next(error);
  }
};

