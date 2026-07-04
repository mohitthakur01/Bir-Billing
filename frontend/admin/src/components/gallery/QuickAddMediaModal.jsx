import React, { useState } from 'react';
import { X, Upload, Loader2, Film, Image as ImageIcon } from 'lucide-react';
import { addPhoto, addVideo } from '../../services/adminGalleryService';
import UploadProgress from '../admin/UploadProgress';

const QuickAddMediaModal = ({ isOpen, onClose, onSuccess }) => {
  const [mediaType, setMediaType] = useState('photo'); // 'photo' or 'video'
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Paragliding');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  
  // Video-specific fields
  const [sourceType, setSourceType] = useState('upload'); // 'upload' or 'url'
  const [videoFile, setVideoFile] = useState(null);
  const [externalUrl, setExternalUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);

  // Photo-specific fields
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Status metrics
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [error, setError] = useState('');

  const photoCategories = [
    'Paragliding',
    'Trekking',
    'Camping',
    'Hotels',
    'Cafes',
  ];

  const videoCategories = [
    'Paragliding',
    'Trekking',
    'Camping',
    'Hotels',
    'Cafes',
    'Travel Experiences',
  ];

  const categories = mediaType === 'photo' ? photoCategories : videoCategories;

  const handleMediaTypeChange = (type) => {
    setMediaType(type);
    setCategory('Paragliding');
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setError('');
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file size exceeds 10MB limit.');
        return;
      }
      const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowed.includes(file.type)) {
        setError('Invalid image format. Choose JPEG, PNG, GIF, or WEBP.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setError('');
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setError('Video file size exceeds 100MB limit.');
        return;
      }
      const allowed = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska'];
      if (!allowed.includes(file.type) && !file.name.match(/\.(mp4|mkv|mov|avi|webm)$/i)) {
        setError('Invalid format. Upload MP4, MKV, MOV, or WEBM.');
        return;
      }
      setVideoFile(file);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setError('');
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Thumbnail size exceeds 5MB limit.');
        return;
      }
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !category) {
      setError('Title and Category are required.');
      return;
    }

    if (mediaType === 'photo' && !imageFile) {
      setError('Please select an image file.');
      return;
    }

    if (mediaType === 'video' && sourceType === 'upload' && !videoFile) {
      setError('Please select a local video file.');
      return;
    }

    if (mediaType === 'video' && sourceType === 'url' && !externalUrl.trim()) {
      setError('Please provide a valid external URL.');
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('category', category);
    formData.append('location', location.trim());
    formData.append('isActive', true);

    if (mediaType === 'photo') {
      formData.append('imageFile', imageFile);
      formData.append('altText', title.trim());
    } else {
      if (sourceType === 'upload') {
        formData.append('videoFile', videoFile);
      } else {
        formData.append('externalUrl', externalUrl.trim());
      }
      if (thumbnailFile) {
        formData.append('thumbnailFile', thumbnailFile);
      }
    }

    try {
      const onProgress = (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percent);
      };

      if (mediaType === 'photo') {
        await addPhoto(formData, onProgress);
      } else {
        await addVideo(formData, onProgress);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Upload failed. Verify server environment.');
    } finally {
      setSubmitting(false);
      setUploadProgress(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in text-slate-800"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto no-scrollbar border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold font-outfit text-slate-900">
            Quick Add to Gallery
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-950 transition-colors"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-500 rounded-xl text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Media Type Selection Selector */}
          <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-2xl w-full">
            <button
              type="button"
              onClick={() => handleMediaTypeChange('photo')}
              className={`py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                mediaType === 'photo'
                  ? 'bg-white text-[#008cff] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              Photo
            </button>
            <button
              type="button"
              onClick={() => handleMediaTypeChange('video')}
              className={`py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                mediaType === 'video'
                  ? 'bg-white text-[#008cff] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Film className="h-4 w-4" />
              Video
            </button>
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., Flying high"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#008cff] focus:ring-1 focus:ring-[#008cff] text-slate-800 transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#008cff] focus:ring-1 focus:ring-[#008cff] text-slate-650 transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="E.g., Billing Takeoff"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#008cff] focus:ring-1 focus:ring-[#008cff] text-slate-800 transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Small caption details..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#008cff] focus:ring-1 focus:ring-[#008cff] text-slate-800 transition-colors"
              />
            </div>
          </div>

          {/* Media Type Specific Upload Blocks */}
          {mediaType === 'photo' ? (
            /* PHOTO file selector */
            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Choose Image File
              </label>
              <div className="flex gap-4 items-center">
                <label className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-200 bg-slate-50 p-4 rounded-xl cursor-pointer hover:border-[#008cff] hover:bg-slate-100/50 transition-all text-slate-500">
                  <Upload className="h-5 w-5 mb-1 text-slate-400" />
                  <span className="text-[11px] font-semibold truncate max-w-[200px]">
                    {imageFile ? imageFile.name : 'JPEG/PNG/WEBP (Max 10MB)'}
                  </span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                {imagePreview && (
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-50">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* VIDEO inputs */
            <div className="space-y-3">
              <div className="flex space-x-4">
                <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 cursor-pointer">
                  <input
                    type="radio"
                    checked={sourceType === 'upload'}
                    onChange={() => setSourceType('upload')}
                    className="h-4 w-4 text-[#008cff] focus:ring-0 focus:ring-offset-0"
                  />
                  <span>Upload Local File</span>
                </label>
                <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-655 cursor-pointer">
                  <input
                    type="radio"
                    checked={sourceType === 'url'}
                    onChange={() => setSourceType('url')}
                    className="h-4 w-4 text-[#008cff] focus:ring-0 focus:ring-offset-0"
                  />
                  <span>External URL</span>
                </label>
              </div>

              {sourceType === 'upload' ? (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    Choose Video File
                  </label>
                  <label className="flex flex-col items-center justify-center border border-dashed border-slate-200 bg-slate-50 p-4 rounded-xl cursor-pointer hover:border-[#008cff] hover:bg-slate-100/50 transition-all text-slate-500">
                    <Film className="h-5 w-5 mb-1 text-slate-400" />
                    <span className="text-[11px] font-semibold truncate max-w-[250px]">
                      {videoFile ? videoFile.name : 'MP4/WEBM/MOV (Max 100MB)'}
                    </span>
                    <input type="file" accept="video/*" onChange={handleVideoChange} className="hidden" />
                  </label>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    External Video URL
                  </label>
                  <input
                    type="url"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="YouTube or Instagram link"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#008cff] focus:ring-1 focus:ring-[#008cff] text-slate-800 transition-colors"
                  />
                </div>
              )}

              {/* Optional Thumbnail upload for Video */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Optional Thumbnail (Image)
                </label>
                <label className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 cursor-pointer text-slate-400 hover:text-slate-600 transition-all text-xs font-semibold">
                  <Upload className="h-4.5 w-4.5 text-slate-400" />
                  <span className="truncate">{thumbnailFile ? thumbnailFile.name : 'Choose JPG/PNG...'}</span>
                  <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
                </label>
              </div>
            </div>
          )}

          {/* Upload progress feedback */}
          <UploadProgress progress={uploadProgress} />

          {/* CTA controls */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-xs font-semibold uppercase hover:bg-slate-50 hover:text-slate-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2.5 bg-[#008cff] hover:bg-[#0070cc] disabled:bg-blue-300 text-white text-xs font-semibold uppercase rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/10 transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <span>Publish Item</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickAddMediaModal;
