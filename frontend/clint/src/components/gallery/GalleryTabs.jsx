import React from 'react';
import { Image, Video } from 'lucide-react';

const GalleryTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="relative flex p-1.5 bg-slate-200/60 border border-slate-300/50 rounded-full w-fit">
      {/* Photo Tab */}
      <button
        onClick={() => setActiveTab('photos')}
        className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold tracking-wide uppercase transition-all duration-300 ${
          activeTab === 'photos'
            ? 'bg-[#008cff] text-white shadow-lg shadow-blue-500/25 scale-[1.02]'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <Image className="h-4.5 w-4.5" />
        Photos
      </button>

      {/* Video Tab */}
      <button
        onClick={() => setActiveTab('videos')}
        className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold tracking-wide uppercase transition-all duration-300 ${
          activeTab === 'videos'
            ? 'bg-[#008cff] text-white shadow-lg shadow-blue-500/25 scale-[1.02]'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <Video className="h-4.5 w-4.5" />
        Videos
      </button>
    </div>
  );
};

export default GalleryTabs;
