import React, { useState, useEffect } from 'react';
import GalleryFilter from './GalleryFilter';
import PhotoLightbox from './PhotoLightbox';
import * as galleryService from '../../services/galleryService';

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await galleryService.getPhotos(activeCategory);
        setPhotos(data);
      } catch (err) {
        setError('Failed to fetch photos. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, [activeCategory]);

  return (
    <div className="space-y-8">
      {/* Category Filters */}
      <GalleryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} type="photos" />

      {/* Skeleton Loading State */}
      {loading && (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {[350, 420, 280, 500, 310, 460, 390, 320].map((height, i) => (
            <div
              key={i}
              className="break-inside-avoid bg-slate-200/50 border border-slate-200 rounded-3xl animate-pulse"
              style={{ height: `${height}px` }}
            ></div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {!loading && error && (
        <div className="text-center p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl max-w-md mx-auto">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && photos.length === 0 && (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl max-w-md mx-auto space-y-4 animate-scale-in">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-[#008cff] text-lg">
            📸
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold font-outfit text-slate-900">No Photos Uploaded</h3>
            <p className="text-sm text-slate-500">There are no active photos in category "{activeCategory}" yet.</p>
          </div>
        </div>
      )}

      {/* Masonry Image Column Grid */}
      {!loading && !error && photos.length > 0 && (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {photos.map((photo, index) => (
            <div
              key={photo._id}
              onClick={() => setSelectedPhotoIndex(index)}
              className="break-inside-avoid relative overflow-hidden rounded-3xl border border-slate-200 bg-white group cursor-pointer transition-all duration-300 hover:border-blue-300 shadow-xs hover:shadow-lg"
            >
              <img
                src={photo.mediaUrl}
                alt={photo.altText || photo.title}
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Category Badge overlay */}
              <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#008cff] text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-blue-500/10">
                {photo.category}
              </span>

              {/* Title and descriptions hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                <h4 className="font-outfit font-bold text-white text-base tracking-wide line-clamp-1">
                  {photo.title}
                </h4>
                {photo.description && (
                  <p className="text-slate-300 text-xs mt-1.5 leading-relaxed line-clamp-2">
                    {photo.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full-screen Lightbox Popup */}
      {selectedPhotoIndex !== null && (
        <PhotoLightbox
          photos={photos}
          currentIndex={selectedPhotoIndex}
          setCurrentIndex={setSelectedPhotoIndex}
          onClose={() => setSelectedPhotoIndex(null)}
        />
      )}
    </div>
  );
};

export default PhotoGallery;
