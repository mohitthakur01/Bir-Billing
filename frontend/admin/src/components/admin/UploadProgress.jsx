import React from 'react';

const UploadProgress = ({ progress }) => {
  if (progress === null || progress === undefined) return null;

  return (
    <div className="space-y-2 animate-fade-in">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
        <span>Syncing media to Cloudinary servers...</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-slate-100 border border-slate-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-[#008cff] h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default UploadProgress;
