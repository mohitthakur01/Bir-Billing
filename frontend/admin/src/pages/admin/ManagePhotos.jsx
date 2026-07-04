import React, { useEffect, useState } from 'react';
import MediaTable from '../../components/admin/MediaTable';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import UploadProgress from '../../components/admin/UploadProgress';
import { getPhotos, addPhoto, updatePhoto, deletePhoto } from '../../services/adminGalleryService';
import { Plus, X, Upload, Loader2, Image as ImageIcon, Filter, Eye, EyeOff } from 'lucide-react';

const ManagePhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Form toggles
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Add / Edit form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Paragliding');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [altText, setAltText] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Actions tracking
  const [uploadProgress, setUploadProgress] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete flow
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);

  const categories = [
    'Paragliding',
    'Trekking',
    'Camping',
    'Hotels',
    'Cafes',
  ];

  const fetchPhotos = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getPhotos();
      setPhotos(data);
    } catch (err) {
      setError('Failed to fetch photos. Please check database connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormError('');
    if (file) {
      // Validate file size limit (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setFormError('File size exceeds the 10MB limit.');
        return;
      }
      // Validate image format
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setFormError('Invalid format. Select JPEG, PNG, GIF, or WEBP.');
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedPhoto(null);
    setTitle('');
    setDescription('');
    setCategory('Paragliding');
    setImageFile(null);
    setImagePreview('');
    setAltText('');
    setIsActive(true);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (photo) => {
    setIsEditing(true);
    setSelectedPhoto(photo);
    setTitle(photo.title);
    setDescription(photo.description || '');
    setCategory(photo.category);
    setImageFile(null);
    setImagePreview(photo.mediaUrl);
    setAltText(photo.altText || '');
    setIsActive(photo.isActive);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim() || !category) {
      setFormError('Title and Category are required.');
      return;
    }

    if (!isEditing && !imageFile) {
      setFormError('Please select a photo image to upload.');
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('category', category);
    formData.append('altText', altText.trim() || title.trim());
    formData.append('isActive', isActive);
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }

    try {
      const onProgress = (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percent);
      };

      if (isEditing) {
        await updatePhoto(selectedPhoto._id, formData, onProgress);
      } else {
        await addPhoto(formData, onProgress);
      }

      setIsFormOpen(false);
      fetchPhotos();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Upload failed. Please check credentials/connection.');
    } finally {
      setSubmitting(false);
      setUploadProgress(null);
    }
  };

  const handleOpenDelete = (photo) => {
    setPhotoToDelete(photo);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!photoToDelete) return;
    try {
      await deletePhoto(photoToDelete._id);
      setDeleteModalOpen(false);
      fetchPhotos();
    } catch (err) {
      console.error(err);
      alert('Could not delete photo. Verify backend log.');
    }
  };

  const filteredPhotos = activeCategory === 'All'
    ? photos
    : photos.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-outfit font-black text-slate-900">
            Manage Photo Gallery
          </h1>
          <p className="text-slate-550 text-sm mt-1">
            Create, update, toggle visibility, and delete dynamic photos.
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider bg-[#008cff] hover:bg-[#0070cc] text-white rounded-xl shadow-md shadow-blue-500/10 active:scale-95 transition-all w-fit"
          >
            <Plus className="h-4 w-4" />
            Add Photo
          </button>
        )}
      </div>

      {/* Main layout contents */}
      {isFormOpen ? (
        /* Upload / Edit Form Drawer */
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 max-w-2xl mx-auto animate-scale-in bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold font-outfit text-slate-900">
              {isEditing ? 'Edit Photo Details' : 'Upload New Photo'}
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
            {/* Title & Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  Photo Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g., Sunrise over Billing takeoff"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-slate-750 transition-colors"
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
                placeholder="Write a short context about the moment captured (optional)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-slate-800 transition-colors resize-none"
              ></textarea>
            </div>

            {/* Alt Text & Visibility Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Alternative text for screen readers"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-slate-800 transition-colors"
                />
              </div>

              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <input
                  type="checkbox"
                  id="photo-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded bg-white border border-slate-200 text-primary-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="photo-active" className="text-xs font-semibold text-slate-600 select-none cursor-pointer">
                  Display publicly in Gallery
                </label>
              </div>
            </div>

            {/* Media Upload Area */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                Select Photo Image
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                {/* Upload Button Box */}
                <div className="sm:col-span-2 relative">
                  <label className="flex flex-col items-center justify-center border border-dashed border-slate-200 bg-slate-50 p-6 rounded-2xl cursor-pointer hover:border-primary-500 hover:bg-slate-100/50 transition-all text-slate-500 hover:text-slate-800">
                    <Upload className="h-6 w-6 mb-2" />
                    <span className="text-xs font-semibold">
                      {imageFile ? imageFile.name : 'Choose JPG, PNG, WEBP (Max 10MB)'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Local Preview box */}
                <div className="aspect-video sm:aspect-square bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-[10px] text-slate-400 font-semibold uppercase flex flex-col items-center gap-1">
                      <ImageIcon className="h-5 w-5 text-slate-300" />
                      No preview
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Upload Progress monitoring */}
            <UploadProgress progress={uploadProgress} />

            {/* Form actions */}
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
                    Uploading...
                  </>
                ) : (
                  <span>{isEditing ? 'Save Changes' : 'Upload Photo'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Dynamic table views */
        <div className="space-y-6">
          {/* Category Filter bar */}
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
                  : 'text-slate-500 hover:text-slate-800'
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
                    : 'text-slate-500 hover:text-slate-800'
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
              <p className="text-slate-500 text-xs font-medium">Fetching photo records...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-500/10 border border-red-500/25 text-red-400 rounded-xl text-sm max-w-md mx-auto text-center">
              {error}
            </div>
          ) : (
            <MediaTable
              items={filteredPhotos}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              type="photo"
            />
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title={photoToDelete ? photoToDelete.title : ''}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default ManagePhotos;
