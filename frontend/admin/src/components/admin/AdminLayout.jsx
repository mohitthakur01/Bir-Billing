import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { Menu, X, Compass } from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden font-sans">
      {/* Sidebar for Desktop Views */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 flex lg:hidden bg-slate-900/40 backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        >
          <div 
            className="relative flex flex-col w-64 bg-white border-r border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-grow pt-8">
              <AdminSidebar isMobile={true} closeMobileDrawer={() => setSidebarOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Content wrapper */}
      <div className="flex flex-col flex-grow w-0 overflow-hidden">
        {/* Mobile Toolbar Header */}
        <header className="lg:hidden flex items-center justify-between bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Compass className="h-5 w-5 text-blue-500" />
            <span className="font-outfit text-sm font-bold tracking-wider uppercase text-slate-900">Bir Billing Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {/* View Content Body */}
        <main className="flex-grow overflow-y-auto bg-slate-50 p-4 sm:p-8 no-scrollbar">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
