import mongoose from 'mongoose';

const galleryMediaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    mediaType: {
      type: String,
      required: [true, 'Please specify media type (photo or video)'],
      enum: ['photo', 'video'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      trim: true,
    },
    mediaUrl: {
      type: String,
      required: [true, 'Please add a media URL'],
    },
    thumbnailUrl: {
      type: String,
      trim: true,
    },
    publicId: {
      type: String,
      required: [true, 'Please add Cloudinary public ID'],
    },
    thumbnailPublicId: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    altText: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const GalleryMedia = mongoose.model('GalleryMedia', galleryMediaSchema);
export default GalleryMedia;
