import React, { useState } from 'react';
import GalleryTabs from '../components/gallery/GalleryTabs';
import PhotoGallery from '../components/gallery/PhotoGallery';
import VideoGallery from '../components/gallery/VideoGallery';

const Gallery = () => {
  const [activeTab, setActiveTab] = useState('photos'); // 'photos' or 'videos'

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 space-y-12 relative">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-4 animate-fade-in">
        <h1 className="text-4xl sm:text-6xl font-outfit font-extrabold text-slate-900 tracking-tight leading-tight">
          Explore Bir Billing <br />
          <span className="bg-gradient-to-r from-[#008cff] via-sky-500 to-indigo-500 bg-clip-text text-transparent">
            Through Our Lens
          </span>
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Discover unforgettable moments from paragliding adventures, mountain treks, peaceful camps, scenic tours, beautiful stays, cafes, and road trips.
        </p>
      </section>

      {/* Navigation Tabs (Photos vs Videos) */}
      <div className="flex justify-center select-none">
        <GalleryTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Dynamic Display Panel */}
      <div className="max-w-7xl mx-auto pt-4">
        {activeTab === 'photos' ? (
          <div className="animate-scale-in">
            <PhotoGallery />
          </div>
        ) : (
          <div className="animate-scale-in">
            <VideoGallery />
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
