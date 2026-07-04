import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';

// Common public components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => (
  <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
    <Navbar />
    <div className="flex-grow">
      <Outlet />
    </div>
    <Footer />
    <WhatsAppButton />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Website Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* General Catch-All Router Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
