import React, { useEffect, useState } from 'react';
import DashboardStats from '../../components/admin/DashboardStats';
import { getPhotos, getVideos } from '../../services/adminGalleryService';
import { Calendar, Compass, RefreshCw, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';

const AdminDashboard = () => {
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setError('');
    try {
      const [photoData, videoData] = await Promise.all([getPhotos(), getVideos()]);
      setPhotos(photoData);
      setVideos(videoData);
    } catch (err) {
      setError('Failed to fetch dashboard data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Merge and sort photos + videos by date for recently added
  const recentMedia = [...photos, ...videos]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-slate-500 text-sm">Loading dashboard state...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-outfit font-black text-slate-900">
            Workspace Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            System overview and aggregate upload configurations.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-white border border-slate-200 text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-50 active:scale-95 transition-all w-fit"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Logs'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-500 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Stats aggregates */}
      <DashboardStats photosCount={photos.length} videosCount={videos.length} />

      {/* Recently Added Section */}
      <div className="glass-panel rounded-3xl border border-slate-200 p-6 space-y-6 shadow-md bg-white">
        <div>
          <h2 className="text-lg font-bold font-outfit text-slate-900">
            Recently Added Media
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            The latest media uploads across the entire website catalog.
          </p>
        </div>

        {recentMedia.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 border border-slate-200 rounded-2xl">
            <p className="text-sm text-slate-500 font-medium">No media uploaded yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-200 bg-slate-50/50 rounded-2xl overflow-hidden">
            {recentMedia.map((media) => (
              <div
                key={media._id}
                className="p-4 flex items-center justify-between hover:bg-slate-100/50 transition-colors gap-4"
              >
                {/* Visual thumbnail & title info */}
                <div className="flex items-center space-x-4 min-w-0">
                  <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                    <img
                      src={media.thumbnailUrl || media.mediaUrl}
                      alt={media.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback icon inside thumbnail box
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-md">
                      {media.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="bg-slate-100 text-slate-500 border border-slate-200 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1.5">
                        {media.mediaType === 'photo' ? (
                          <ImageIcon className="h-2.5 w-2.5 text-[#008cff]" />
                        ) : (
                          <VideoIcon className="h-2.5 w-2.5 text-purple-550" />
                        )}
                        {media.mediaType}
                      </span>
                      <span className="text-slate-400 text-[10px]">
                        {media.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Date indicator */}
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <div className="flex items-center justify-end text-slate-550 text-xs space-x-1.5 font-medium">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{formatDate(media.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
