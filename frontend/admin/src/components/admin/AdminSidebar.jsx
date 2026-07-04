import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { LayoutDashboard, Image, Video, LogOut, Compass, ChevronRight, Mail } from 'lucide-react';

const AdminSidebar = ({ isMobile, closeMobileDrawer }) => {
  const { logout, admin } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await logout();
      if (closeMobileDrawer) closeMobileDrawer();
      navigate('/admin/login');
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Manage Photos', path: '/admin/gallery/photos', icon: <Image className="h-5 w-5" /> },
    { name: 'Manage Videos', path: '/admin/gallery/videos', icon: <Video className="h-5 w-5" /> },
    { name: 'Contact Inquiries', path: '/admin/contact', icon: <Mail className="h-5 w-5" /> },
  ];

  const handleClick = () => {
    if (isMobile && closeMobileDrawer) {
      closeMobileDrawer();
    }
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-full flex flex-col justify-between py-6">
      <div className="space-y-6">
        {/* Brand Brand Header (Desktop only) */}
        {!isMobile && (
          <div className="px-6 flex items-center space-x-2.5">
            <Compass className="h-6 w-6 text-[#008cff] animate-pulse" />
            <span className="font-outfit text-base font-extrabold text-slate-900 tracking-wider uppercase">
              Bir Billing Admin
            </span>
          </div>
        )}

        {/* User Card */}
        {admin && (
          <div className="px-5 py-3.5 mx-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col">
            <span className="text-slate-800 text-sm font-semibold truncate leading-tight">{admin.name}</span>
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-1">
              {admin.role}
            </span>
          </div>
        )}

        {/* Navigation List Links */}
        <nav className="px-4 space-y-1">
          <span className="block px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
            Navigation Menu
          </span>
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={handleClick}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-[#008cff] text-white shadow-lg shadow-blue-500/10'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                {link.icon}
                <span>{link.name}</span>
              </div>
              <ChevronRight className="h-4 w-4 opacity-50" />
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout button at bottom */}
      <div className="px-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-3.5 rounded-xl text-sm font-semibold tracking-wide text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors focus:outline-none"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span>Logout Session</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
