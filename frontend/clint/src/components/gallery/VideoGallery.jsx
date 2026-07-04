import React, { useState, useEffect } from 'react';
import GalleryFilter from './GalleryFilter';
import VideoModal from './VideoModal';
import { Play } from 'lucide-react';
import * as galleryService from '../../services/galleryService';

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await galleryService.getVideos(activeCategory);
        setVideos(data);
      } catch (err) {
        setError('Failed to fetch videos. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [activeCategory]);

  return (
    <div className="space-y-8">
      {/* Category filter */}
      <GalleryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} type="videos" />

      {/* Skeletons Loader */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-slate-200/50 border border-slate-200 rounded-3xl aspect-[16/10]"></div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="text-center p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl max-w-md mx-auto">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && videos.length === 0 && (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl max-w-md mx-auto space-y-4 animate-scale-in">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-[#008cff] text-lg">
            🎬
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold font-outfit text-slate-900">No Videos Uploaded</h3>
            <p className="text-sm text-slate-500">There are no active videos in category "{activeCategory}" yet.</p>
          </div>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && videos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video._id}
              onClick={() => setSelectedVideo(video)}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden group cursor-pointer transition-all duration-300 hover:border-blue-300 hover:shadow-lg hover:scale-[1.01]"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-slate-600 gap-1.5">
                    <span className="text-2xl">🎬</span>
                    <span className="text-xs font-medium">Watch Video</span>
                  </div>
                )}
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/50 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 bg-[#008cff] group-hover:bg-[#0070cc] text-white rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Play className="h-6 w-6 fill-white ml-1" />
                  </div>
                </div>
                {/* Category Badge */}
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#008cff] text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-blue-500/10">
                  {video.category}
                </span>
              </div>

              {/* Text metadata */}
              <div className="p-5 space-y-2">
                <h4 className="font-outfit font-bold text-slate-900 text-base tracking-wide line-clamp-1 group-hover:text-[#008cff] transition-colors">
                  {video.title}
                </h4>
                {video.description && (
                  <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal popup */}
      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  );
};

export default VideoGallery;
