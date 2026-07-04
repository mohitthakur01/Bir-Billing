import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { submitMessage } from '../services/contactService';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (form.name && form.email && form.message) {
      setSubmitting(true);
      try {
        await submitMessage(form);
        setSubmitted(true);
        setForm({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 8000);
      } catch (err) {
        console.error(err);
        setSubmitError(err.response?.data?.message || 'Failed to send inquiry. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 space-y-16 pb-28">
      {/* Header */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-outfit font-extrabold text-slate-900">Contact Us</h1>
        <p className="text-slate-500 text-sm sm:text-base">
          Planning your trip to Bir? Get in touch with us for paragliding bookings, trekking guides, taxi services, and stay availability.
        </p>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Info */}
        <div className="space-y-6 lg:col-span-1">
          <div className="glass-panel p-8 rounded-3xl border border-slate-200 space-y-6">
            <h2 className="text-xl font-bold font-outfit text-slate-900">Get in Touch</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              We look forward to hosting you in our beautiful town. Contact our operators for any assistance.
            </p>

            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-[#008cff] flex-shrink-0" />
                <span>Bir, Himachal Pradesh, India</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#008cff] flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#008cff] flex-shrink-0" />
                <span>info@birbillingtourism.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <div className="glass-panel p-8 rounded-3xl border border-slate-200">
            {submitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 p-6 rounded-2xl text-center space-y-2">
                <h3 className="text-lg font-bold">Inquiry Sent Successfully!</h3>
                <p className="text-sm">Thank you for writing. Our operators will reply via email shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-wider text-slate-400 uppercase">Your Name</label>
                    <input
                      type="text"
                      required
                      disabled={submitting}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#008cff] focus:ring-1 focus:ring-[#008cff] text-slate-800 transition-colors disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-wider text-slate-400 uppercase">Email Address</label>
                    <input
                      type="email"
                      required
                      disabled={submitting}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#008cff] focus:ring-1 focus:ring-[#008cff] text-slate-800 transition-colors disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-wider text-slate-400 uppercase">Subject</label>
                  <input
                    type="text"
                    disabled={submitting}
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Paragliding Booking Enquiry"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#008cff] focus:ring-1 focus:ring-[#008cff] text-slate-800 transition-colors disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-wider text-slate-400 uppercase">Message</label>
                  <textarea
                    required
                    rows="4"
                    disabled={submitting}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your travel dates and group size..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#008cff] focus:ring-1 focus:ring-[#008cff] text-slate-800 transition-colors resize-none disabled:opacity-50"
                  ></textarea>
                </div>

                {submitError && (
                  <div className="bg-red-50 border border-red-100 text-red-500 p-4 rounded-xl text-xs">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#008cff] hover:bg-[#0070cc] disabled:bg-blue-300 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 shadow-md shadow-blue-500/10 flex items-center justify-center space-x-2 active:scale-[0.98] disabled:scale-100"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
