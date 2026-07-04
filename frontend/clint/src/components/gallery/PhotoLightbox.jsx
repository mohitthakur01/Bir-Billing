import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const PhotoLightbox = ({ photos, currentIndex, setCurrentIndex, onClose }) => {
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const currentPhoto = photos[currentIndex];

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock scroll on open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [currentIndex, photos.length]);

  // Touch handlers for mobile swipe actions
  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    const minSwipeDistance = 50;
    const swipeDiff = touchStartX - touchEndX;

    if (swipeDiff > minSwipeDistance) {
      // Swipe Left -> Show Next
      handleNext();
    } else if (swipeDiff < -minSwipeDistance) {
      // Swipe Right -> Show Prev
      handlePrev();
    }
  };

  if (!currentPhoto) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-slate-950/98 backdrop-blur-md py-4 sm:py-6 px-4 animate-fade-in"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Lightbox Toolbar Top */}
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto z-10">
        <div className="flex items-center space-x-3">
          <span className="bg-blue-600 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full">
            {currentPhoto.category}
          </span>
          <span className="text-slate-400 text-xs font-semibold">
            {currentIndex + 1} of {photos.length}
          </span>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 transition-all focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Image Viewport Area */}
      <div className="relative flex-grow flex items-center justify-center max-w-7xl mx-auto w-full my-4">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-0 sm:left-4 z-15 p-3 rounded-full bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-850 hover:scale-105 active:scale-95 transition-all focus:outline-none hidden sm:block"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* The Photo Image */}
        <img
          src={currentPhoto.mediaUrl}
          alt={currentPhoto.altText || currentPhoto.title}
          className="max-h-[70vh] sm:max-h-[75vh] max-w-full object-contain rounded-xl select-none shadow-2xl animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-0 sm:right-4 z-15 p-3 rounded-full bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-850 hover:scale-105 active:scale-95 transition-all focus:outline-none hidden sm:block"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Metadata Bottom Details Card */}
      <div
        className="w-full max-w-3xl mx-auto text-center bg-slate-900/70 border border-slate-800/40 p-4 sm:p-5 rounded-2xl backdrop-blur z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-outfit font-bold text-white text-base sm:text-lg tracking-wide">
          {currentPhoto.title}
        </h3>
        {currentPhoto.location && (
          <p className="text-orange-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
            <span>📍</span> {currentPhoto.location}
          </p>
        )}
        {currentPhoto.description && (
          <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
            {currentPhoto.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default PhotoLightbox;
