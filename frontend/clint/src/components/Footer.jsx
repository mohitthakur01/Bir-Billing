import React from 'react';
import { Compass, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-900/60 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1.5 space-y-4">
            <div className="flex items-center space-x-2.5">
              <Compass className="h-6 w-6 text-[#008cff]" />
              <span className="font-outfit text-lg font-bold text-white tracking-tight">
                Bir Billing Tourism
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Your comprehensive travel guide to the paragliding capital of India. Discover adventure sports, mountain treks, peaceful camping sites, and serene monasteries.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-[#008cff] transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#008cff] transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#008cff] transition-colors">Media Gallery</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#008cff] transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-4">
              Contact Details
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-[#008cff] flex-shrink-0" />
                <span>Bir, Himachal Pradesh, India</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-[#008cff] flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-[#008cff] flex-shrink-0" />
                <span>info@birbillingtourism.com</span>
              </li>
            </ul>
          </div>

          {/* Admin Login Button */}
          <div>
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-4">
              Management
            </h3>
            <Link
              to="/admin/login"
              className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold uppercase text-slate-400 hover:text-[#008cff] hover:border-[#008cff] hover:bg-[#008cff]/5 transition-all active:scale-95"
            >
              Admin Login
            </Link>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {currentYear} Bir Billing Tourism. All rights reserved.</p>
          <p className="flex items-center mt-4 sm:mt-0">
            Made with <Heart className="h-3 w-3 text-red-500 mx-1 fill-red-500" /> for travelers worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
