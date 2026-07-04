import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, title, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Title */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-outfit font-bold text-slate-900 text-base flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500 animate-bounce" />
            Confirm Delete
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Details prompt */}
        <p className="text-slate-600 text-sm leading-relaxed">
          Are you sure you want to delete <strong className="text-slate-900">"{title}"</strong>? This will permanently delete the database record and purge the media file from Cloudinary storage. This operation is irreversible.
        </p>

        {/* CTA Actions */}
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-xs font-semibold uppercase hover:bg-slate-50 hover:text-slate-800 transition-all focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase shadow-lg shadow-red-500/10 active:scale-95 transition-all focus:outline-none"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
