import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const VideoModal = ({ video, onClose }) => {
  // Determine if the URL represents an iframe embed (YouTube/Instagram)
  const isEmbed =
    video.mediaUrl.includes('youtube.com') ||
    video.mediaUrl.includes('youtu.be') ||
    video.mediaUrl.includes('instagram.com') ||
    video.mediaUrl.includes('embed');

  useEffect(() => {
    // Prevent background scrolling while modal is active
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800/80 bg-slate-900">
          <span className="bg-blue-600/10 text-blue-400 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full border border-blue-500/20">
            {video.category}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-950/50 hover:bg-slate-950/85 text-slate-400 hover:text-white transition-colors focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Video Screen Panel */}
        <div className="relative aspect-video w-full bg-black">
          {isEmbed ? (
            <iframe
              src={video.mediaUrl}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            ></iframe>
          ) : (
            <video
              src={video.mediaUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            ></video>
          )}
        </div>

        {/* Metadata Details Bottom */}
        <div className="p-6 space-y-2 bg-slate-900/60">
          <h3 className="font-outfit font-bold text-white text-lg tracking-wide">
            {video.title}
          </h3>
          {video.location && (
            <p className="text-orange-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <span>📍</span> {video.location}
            </p>
          )}
          {video.description && (
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-h-24 overflow-y-auto no-scrollbar">
              {video.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
