import React, { useEffect, useState } from 'react';
import MediaTable from '../../components/admin/MediaTable';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import UploadProgress from '../../components/admin/UploadProgress';
import { getVideos, addVideo, updateVideo, deleteVideo } from '../../services/adminGalleryService';
import { Plus, X, Upload, Loader2, Video as VideoIcon, Filter, Film } from 'lucide-react';

const ManageVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Paragliding');
  const [sourceType, setSourceType] = useState('upload'); // 'upload' or 'url'
  const [videoFile, setVideoFile] = useState(null);
  const [externalUrl, setExternalUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [isActive, setIsActive] = useState(true);

  // Action status indicators
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [formError, setFormError] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

  const categories = [
    'Paragliding',
    'Trekking',
    'Camping',
    'Hotels',
    'Cafes',
    'Travel Experiences',
  ];

  const fetchVideos = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getVideos();
      setVideos(data);
    } catch (err) {
      setError('Failed to fetch videos. Check database link.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    setFormError('');
    if (file) {
      // Validate video file size limit (100MB)
      if (file.size > 100 * 1024 * 1024) {
        setFormError('Video size exceeds the 100MB limit.');
        return;
      }
      // Validate formats
      const allowedTypes = ['video/mp4', 'video/webm', 'video/x-matroska', 'video/quicktime', 'video/avi'];
      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp4|mkv|mov|avi|webm)$/i)) {
        setFormError('Invalid format. Upload MP4, MKV, MOV, AVI, or WEBM.');
        return;
      }
      setVideoFile(file);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setFormError('');
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Thumbnail exceeds the 5MB limit.');
        return;
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setFormError('Invalid thumbnail format. Must be JPEG, PNG, or WEBP.');
        return;
      }
      setThumbnailFile(file);
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedVideo(null);
    setTitle('');
    setDescription('');
    setCategory('Paragliding');
    setSourceType('upload');
    setVideoFile(null);
    setExternalUrl('');
    setThumbnailFile(null);
    setIsActive(true);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (video) => {
    setIsEditing(true);
    setSelectedVideo(video);
    setTitle(video.title);
    setDescription(video.description || '');
    setCategory(video.category);
    
    // Check if it was an external link or local upload
    if (video.publicId === 'external') {
      setSourceType('url');
      setExternalUrl(video.mediaUrl);
    } else {
      setSourceType('upload');
      setExternalUrl('');
    }

    setVideoFile(null);
    setThumbnailFile(null);
    setIsActive(video.isActive);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim() || !category) {
      setFormError('Title and Category are required fields.');
      return;
    }

    if (sourceType === 'upload' && !isEditing && !videoFile) {
      setFormError('Please select a local video file to upload.');
      return;
    }

    if (sourceType === 'url' && !externalUrl.trim()) {
      setFormError('Please input a valid YouTube or Instagram video link.');
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('category', category);
    formData.append('isActive', isActive);

    if (sourceType === 'upload') {
      if (videoFile) {
        formData.append('videoFile', videoFile);
      }
    } else {
      formData.append('externalUrl', externalUrl.trim());
    }

    if (thumbnailFile) {
      formData.append('thumbnailFile', thumbnailFile);
    }

    try {
      const onProgress = (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percent);
      };

      if (isEditing) {
        await updateVideo(selectedVideo._id, formData, onProgress);
      } else {
        await addVideo(formData, onProgress);
      }

      setIsFormOpen(false);
      fetchVideos();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Video save action failed.');
    } finally {
      setSubmitting(false);
      setUploadProgress(null);
    }
  };

  const handleOpenDelete = (video) => {
    setVideoToDelete(video);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!videoToDelete) return;
    try {
      await deleteVideo(videoToDelete._id);
      setDeleteModalOpen(false);
      fetchVideos();
    } catch (err) {
      console.error(err);
      alert('Delete failed. Inspect console outputs.');
    }
  };

  const filteredVideos = activeCategory === 'All'
    ? videos
    : videos.filter((v) => v.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Table Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-outfit font-black text-slate-900">
            Manage Video Gallery
          </h1>
          <p className="text-slate-550 text-sm mt-1">
            Publish, edit settings, delete, and filter video links or uploads.
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider bg-[#008cff] hover:bg-[#0070cc] text-white rounded-xl shadow-md shadow-blue-500/10 active:scale-95 transition-all w-fit"
          >
            <Plus className="h-4 w-4" />
            Add Video
          </button>
        )}
      </div>

      {isFormOpen ? (
        /* Video Editor/Upload Drawer */
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 max-w-2xl mx-auto animate-scale-in bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold font-outfit text-slate-900">
              {isEditing ? 'Edit Video details' : 'Upload / Add Video'}
            </h2>
            <button
              onClick={() => setIsFormOpen(false)}
              className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {formError && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-500 rounded-xl text-xs">
              {formError}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-5">
            {/* Title & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  Video Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g., Paragliding tandem flight experience"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-slate-800 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-slate-700 transition-colors"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                Description
              </label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Give a short caption summary (optional)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-slate-800 transition-colors resize-none"
              ></textarea>
            </div>

            {/* Source selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                Video Source
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 text-xs font-semibold text-slate-600 cursor-pointer">
                  <input
                    type="radio"
                    name="sourceType"
                    checked={sourceType === 'upload'}
                    onChange={() => setSourceType('upload')}
                    className="h-4 w-4 bg-white border border-slate-200 text-primary-500 focus:ring-0 focus:ring-offset-0"
                  />
                  <span>Upload Local File</span>
                </label>
                <label className="flex items-center space-x-2 text-xs font-semibold text-slate-600 cursor-pointer">
                  <input
                    type="radio"
                    name="sourceType"
                    checked={sourceType === 'url'}
                    onChange={() => setSourceType('url')}
                    className="h-4 w-4 bg-white border border-slate-200 text-primary-500 focus:ring-0 focus:ring-offset-0"
                  />
                  <span>External URL (YouTube / Instagram Reel)</span>
                </label>
              </div>
            </div>

            {/* Conditional input options */}
            {sourceType === 'upload' ? (
              /* Local File upload button */
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  Choose Video File
                </label>
                <label className="flex flex-col items-center justify-center border border-dashed border-slate-200 bg-slate-50 p-6 rounded-2xl cursor-pointer hover:border-primary-500 hover:bg-slate-100/50 transition-all text-slate-500 hover:text-slate-800">
                  <Film className="h-6 w-6 mb-2 text-slate-400" />
                  <span className="text-xs font-semibold">
                    {videoFile ? videoFile.name : 'Choose MP4, MKV, WEBM (Max 100MB)'}
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              /* External Link URL Input */
              <div className="space-y-1.5 animate-slide-up">
                <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  External Video URL
                </label>
                <input
                  type="url"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://www.instagram.com/reel/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-slate-800 transition-colors"
                />
              </div>
            )}

            {/* Optional Thumbnail upload & Checkbox status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-slate-505 uppercase">
                  Optional Thumbnail (JPG/PNG)
                </label>
                <label className="flex items-center space-x-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 cursor-pointer text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-colors text-xs font-medium">
                  <Upload className="h-4.5 w-4.5 text-slate-450" />
                  <span className="truncate">
                    {thumbnailFile ? thumbnailFile.name : 'Attach thumbnail image...'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <input
                  type="checkbox"
                  id="video-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded bg-white border border-slate-200 text-primary-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="video-active" className="text-xs font-semibold text-slate-650 select-none cursor-pointer">
                  Display publicly in Gallery
                </label>
              </div>
            </div>

            {/* Upload progress bars */}
            <UploadProgress progress={uploadProgress} />

            {/* CTA action buttons */}
            <div className="flex items-center justify-end space-x-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-3 rounded-xl border border-slate-200 text-slate-500 text-xs font-semibold uppercase hover:bg-slate-50 hover:text-slate-850 transition-all focus:outline-none disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-3 bg-[#008cff] hover:bg-[#0070cc] disabled:bg-blue-300 text-white text-xs font-semibold uppercase rounded-xl flex items-center gap-2 shadow-md shadow-blue-500/10 transition-all focus:outline-none"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Saving Video...
                  </>
                ) : (
                  <span>{isEditing ? 'Save Changes' : 'Upload Video'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Video List Table panel */
        <div className="space-y-6">
          {/* Categories select filter */}
          <div className="flex flex-wrap items-center gap-3 bg-white border border-slate-200 p-3 rounded-2xl w-fit shadow-xs">
            <div className="flex items-center gap-1.5 px-3 text-slate-400 text-xs font-semibold uppercase border-r border-slate-200">
              <Filter className="h-3.5 w-3.5" />
              <span>Filter:</span>
            </div>
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeCategory === 'All'
                  ? 'bg-blue-50 text-[#008cff] border border-primary-100'
                  : 'text-slate-550 hover:text-slate-800'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeCategory === cat
                    ? 'bg-blue-50 text-[#008cff] border border-primary-100'
                    : 'text-slate-550 hover:text-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Loader */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-slate-500 text-xs font-medium">Fetching video records...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-500/10 border border-red-500/25 text-red-400 rounded-xl text-sm max-w-md mx-auto text-center">
              {error}
            </div>
          ) : (
            <MediaTable
              items={filteredVideos}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              type="video"
            />
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title={videoToDelete ? videoToDelete.title : ''}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default ManageVideos;
