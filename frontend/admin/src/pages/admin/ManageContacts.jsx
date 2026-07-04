import React, { useState, useEffect } from 'react';
import * as contactService from '../../services/contactService';
import { Mail, Trash2, Calendar, User, FileText, Loader2, RefreshCw, AlertTriangle, Inbox } from 'lucide-react';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';

const ManageContacts = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactService.getMessages();
      setMessages(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch inquiries. Please reload.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDeleteClick = (id) => {
    setDeletingId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setDeleteLoading(true);
    try {
      await contactService.deleteMessage(deletingId);
      setMessages(prev => prev.filter(msg => msg._id !== deletingId));
      setDeletingId(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete inquiry.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight font-outfit text-slate-900">Contact Inquiries</h1>
          <p className="text-sm text-slate-500">View and manage messages sent by visitors from the Contact page.</p>
        </div>
        <button
          onClick={fetchMessages}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all font-semibold text-sm w-fit"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Main Panel View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4 bg-white border border-slate-200 rounded-3xl">
          <Loader2 className="h-8 w-8 text-[#008cff] animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading inbox entries...</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
          <div className="p-3 bg-red-50 text-red-500 rounded-full w-fit mx-auto border border-red-100">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-outfit">Failed to Load Inbox</h3>
          <p className="text-sm text-slate-550 max-w-sm mx-auto">{error}</p>
          <button
            onClick={fetchMessages}
            className="px-6 py-2.5 bg-[#008cff] hover:bg-[#0070cc] text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-blue-500/10"
          >
            Try Again
          </button>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-white border border-slate-200 rounded-3xl text-center space-y-4">
          <div className="p-4 bg-blue-50 text-[#008cff] rounded-full border border-blue-100">
            <Inbox className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 font-outfit">Inbox is Empty</h3>
            <p className="text-sm text-slate-400 max-w-xs">There are no messages or inquiries submitted by visitors yet.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {messages.map((msg) => (
            <div 
              key={msg._id} 
              className="bg-white border border-slate-200 rounded-3xl p-6 transition-all hover:shadow-xl hover:shadow-slate-100 hover:border-slate-300 flex flex-col justify-between relative group animate-scale-in"
            >
              {/* Header Info */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-slate-700 text-xs font-bold font-outfit uppercase">
                      <User className="h-3 w-3 text-slate-500" />
                      {msg.name}
                    </span>
                    <a 
                      href={`mailto:${msg.email}`} 
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50/50 hover:bg-blue-50 text-[#008cff] rounded-full text-xs font-bold font-outfit transition-colors"
                    >
                      <Mail className="h-3 w-3" />
                      {msg.email}
                    </a>
                  </div>
                  {msg.subject && (
                    <h3 className="text-base font-bold text-slate-900 font-outfit flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-slate-400" />
                      {msg.subject}
                    </h3>
                  )}
                </div>

                {/* Submission Date/Time Badge */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl w-fit flex-shrink-0">
                  <Calendar className="h-3.5 w-3.5 text-[#008cff]" />
                  <span>{formatDate(msg.createdAt)}</span>
                </div>
              </div>

              {/* Message Content */}
              <div className="pt-4 pb-2">
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
              </div>

              {/* Actions footer */}
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleDeleteClick(msg._id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-100 text-red-500 bg-red-50/20 hover:bg-red-50 hover:text-red-600 transition-colors text-xs font-bold"
                  title="Delete inquiry"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Inquiry
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Inquiry Message"
        message="Are you sure you want to delete this contact message? This action is permanent and cannot be undone."
        loading={deleteLoading}
      />
    </div>
  );
};

export default ManageContacts;
