import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';
import AdminLayout from './components/admin/AdminLayout';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagePhotos from './pages/admin/ManagePhotos';
import ManageVideos from './pages/admin/ManageVideos';
import ManageContacts from './pages/admin/ManageContacts';

function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <Routes>
          {/* Root redirect to login */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />

          {/* Admin Authentication Route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Secure Admin Workspace Routes */}
          <Route path="/admin" element={<ProtectedAdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              
              {/* Handle /admin/gallery route explicitly */}
              <Route path="gallery" element={<Navigate to="/admin/gallery/photos" replace />} />
              
              <Route path="gallery/photos" element={<ManagePhotos />} />
              <Route path="gallery/videos" element={<ManageVideos />} />
              <Route path="contact" element={<ManageContacts />} />
              
              {/* Catch-all fallback inside the Admin workspace */}
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
          </Route>

          {/* General Catch-All Router Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AdminAuthProvider>
  );
}

export default App;
