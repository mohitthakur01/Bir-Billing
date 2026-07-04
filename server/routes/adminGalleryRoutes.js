import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { uploadSinglePhoto, uploadVideoFiles } from '../middleware/uploadMiddleware.js';
import { createPhoto, updatePhoto, deletePhoto, getAdminPhotos } from '../controllers/photoController.js';
import { createVideo, updateVideo, deleteVideo, getAdminVideos } from '../controllers/videoController.js';

const router = express.Router();

// Apply auth protection & admin check middleware to all routes
router.use(protect);
router.use(adminOnly);

// Photo routes
router.get('/photos', getAdminPhotos);
router.post('/photos', uploadSinglePhoto, createPhoto);
router.put('/photos/:id', uploadSinglePhoto, updatePhoto);
router.delete('/photos/:id', deletePhoto);

// Video routes
router.get('/videos', getAdminVideos);
router.post('/videos', uploadVideoFiles, createVideo);
router.put('/videos/:id', uploadVideoFiles, updateVideo);
router.delete('/videos/:id', deleteVideo);

export default router;
