import React from 'react';
import { Image, Video, Layers, Calendar } from 'lucide-react';

const DashboardStats = ({ photosCount, videosCount }) => {
  const totalItems = photosCount + videosCount;

  const statItems = [
    {
      title: 'Total Photos',
      value: photosCount,
      icon: <Image className="h-6 w-6 text-[#008cff]" />,
      bg: 'bg-blue-50 border-blue-100',
    },
    {
      title: 'Total Videos',
      value: videosCount,
      icon: <Video className="h-6 w-6 text-purple-600" />,
      bg: 'bg-purple-50 border-purple-100',
    },
    {
      title: 'Total Gallery Items',
      value: totalItems,
      icon: <Layers className="h-6 w-6 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {statItems.map((stat, i) => (
        <div
          key={i}
          className={`glass-panel p-6 rounded-2xl flex items-center justify-between border ${stat.bg} shadow-md`}
        >
          <div className="space-y-1">
            <p className="text-slate-500 text-xs font-semibold tracking-wider uppercase">
              {stat.title}
            </p>
            <p className="text-slate-900 text-3xl font-black font-outfit">
              {stat.value}
            </p>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-slate-200">
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
