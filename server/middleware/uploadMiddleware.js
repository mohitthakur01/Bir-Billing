import multer from 'multer';
import path from 'path';

// Store files in memory as buffers before uploading to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp|gif|mp4|mkv|mov|avi|webm/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (JPEG/JPG/PNG/WEBP/GIF) and videos (MP4/MKV/MOV/AVI/WEBM) are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // Max 100MB total size
  },
});

// Helper configurations
export const uploadSinglePhoto = upload.single('imageFile');

// For videos, can accept a video file and an optional thumbnail image file
export const uploadVideoFiles = upload.fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'thumbnailFile', maxCount: 1 },
]);
