import React from 'react';
import { Edit2, Trash2, Calendar, Eye, EyeOff } from 'lucide-react';

const MediaTable = ({ items, onEdit, onDelete, type }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-slate-200 rounded-3xl">
        <p className="text-slate-500 text-sm font-medium">
          No {type}s uploaded yet. Click the upload button to add your first item.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-slate-200 bg-white rounded-3xl shadow-sm">
      <table className="w-full text-left border-collapse text-sm text-slate-650">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold tracking-wider text-[10px] uppercase">
            <th className="p-4">Thumbnail</th>
            <th className="p-4">Title</th>
            <th className="p-4">Category</th>
            <th className="p-4">Upload Date</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => (
            <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
              {/* Media Preview / Thumbnail Column */}
              <td className="p-4 whitespace-nowrap">
                <div className="w-16 h-11 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                  <img
                    src={item.thumbnailUrl || item.mediaUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </td>

              {/* Title & Description Info */}
              <td className="p-4 max-w-xs truncate">
                <div className="font-semibold text-slate-800 truncate">{item.title}</div>
                {item.description && (
                  <div className="text-slate-400 text-xs truncate mt-0.5">{item.description}</div>
                )}
              </td>

              {/* Category tag */}
              <td className="p-4 whitespace-nowrap">
                <span className="text-slate-600 text-xs font-semibold">{item.category}</span>
              </td>

              {/* Date */}
              <td className="p-4 whitespace-nowrap">
                <div className="flex items-center text-slate-600 text-xs space-x-1.5 font-medium">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>{formatDate(item.createdAt)}</span>
                </div>
              </td>

              {/* Visibility Status */}
              <td className="p-4 whitespace-nowrap">
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-1.5 rounded-full border ${
                  item.isActive
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  {item.isActive ? (
                    <>
                      <Eye className="h-3 w-3" /> Active
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3" /> Hidden
                    </>
                  )}
                </span>
              </td>

              {/* CTA Action Control Buttons */}
              <td className="p-4 whitespace-nowrap text-right text-xs">
                <div className="flex items-center justify-end space-x-2.5">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-850 hover:bg-slate-50 active:scale-95 transition-all focus:outline-none"
                    title="Edit Item Details"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="p-2 rounded-lg bg-red-50 border border-red-100 text-red-500 hover:text-red-650 hover:border-red-200 hover:bg-red-100/50 active:scale-95 transition-all focus:outline-none"
                    title="Delete Item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MediaTable;
