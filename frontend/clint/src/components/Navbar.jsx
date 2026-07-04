import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Compass } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center space-x-2.5">
            <Compass className="h-6 w-6 text-[#008cff] animate-pulse" />
            <span className="font-outfit text-xl font-extrabold tracking-tight bg-gradient-to-r from-[#008cff] to-sky-500 bg-clip-text text-transparent">
              Bir Billing
            </span>
          </Link>

          {/* Desktop Navigation Link Array */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-semibold text-sm transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-[#008cff]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/gallery"
              className="bg-[#008cff] hover:bg-[#0070cc] text-white text-xs tracking-wider uppercase font-semibold px-5 py-2.5 rounded-full transition-all duration-300 shadow-lg shadow-blue-500/20 hover:scale-[1.03] hover:shadow-blue-500/35"
            >
              Explore Gallery
            </Link>
          </div>

          {/* Burger Menu Button (Mobile) */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-500 hover:text-slate-800 p-2 rounded-lg transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Slide-out Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden bg-white/95 border-b border-slate-200/80 animate-fade-in">
          <div className="px-3 pt-2 pb-5 space-y-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                  isActive(link.path)
                    ? 'bg-[#008cff]/10 text-[#008cff] border border-[#008cff]/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 px-4">
              <Link
                to="/gallery"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-[#008cff] hover:bg-[#0070cc] text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-blue-500/10"
              >
                Explore Gallery
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
