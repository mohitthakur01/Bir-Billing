import express from 'express';
import { getAllMedia, getPhotos, getVideos } from '../controllers/galleryController.js';

const router = express.Router();

router.get('/', getAllMedia);
router.get('/photos', getPhotos);
router.get('/videos', getVideos);

export default router;
