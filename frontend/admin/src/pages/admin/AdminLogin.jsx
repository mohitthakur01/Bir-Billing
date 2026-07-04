import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Compass, Lock, Mail, AlertTriangle, Loader2, User, KeyRound } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formError, setFormError] = useState('');
  
  const { login, register, isAuthenticated, loading, error } = useAdminAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Basic Validation
    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    // Email regex validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setFormError('Please enter a valid email address (e.g. admin@birbilling.com).');
      return;
    }

    if (isRegisterMode) {
      if (!code) {
        setFormError('Registration security code is required.');
        return;
      }
      if (code !== 'bir.billing') {
        setFormError('Invalid registration security code.');
        return;
      }
      try {
        await register(name || 'Administrator', email, password, code);
        navigate('/admin/dashboard');
      } catch (err) {
        // Error handled by AuthContext
      }
    } else {
      try {
        await login(email, password);
        navigate('/admin/dashboard');
      } catch (err) {
        // Error handled by AuthContext
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background radial highlights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6 text-center z-10 animate-fade-in">
        <a href="http://localhost:5173" className="inline-flex items-center space-x-2.5 hover:opacity-90 active:scale-[0.98] transition-all">
          <Compass className="h-8 w-8 text-[#008cff]" />
          <span className="font-outfit text-2xl font-black bg-gradient-to-r from-[#008cff] to-sky-500 bg-clip-text text-transparent">
            Bir Billing
          </span>
        </a>
        <h2 className="text-xl sm:text-2xl font-outfit font-extrabold text-slate-900 tracking-wide">
          {isRegisterMode ? 'Register New Admin' : 'Admin Portal Login'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 animate-scale-in">
        <div className="glass-panel p-8 rounded-3xl border border-slate-200 shadow-2xl bg-white/90">
          <form onSubmit={handleSubmit} className="space-y-6 text-slate-700">
            {/* Context Error / Form Local Validation Error */}
            {(formError || error) && (
              <div className="bg-red-50 border border-red-100 text-red-500 p-4 rounded-xl flex items-start space-x-3 text-xs">
                <AlertTriangle className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
                <span>{formError || error}</span>
              </div>
            )}

            {/* Name Field (Register Mode Only) */}
            {isRegisterMode && (
              <div className="space-y-2 animate-slide-up">
                <label className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Admin Display Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="text"
                    disabled={loading}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. Mohit Thakur"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#008cff] focus:ring-1 focus:ring-[#008cff] disabled:opacity-50 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  type="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@birbilling.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#008cff] focus:ring-1 focus:ring-[#008cff] disabled:opacity-50 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  type="password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#008cff] focus:ring-1 focus:ring-[#008cff] disabled:opacity-50 transition-colors"
                />
              </div>
            </div>

            {/* Registration Security Code (Register Mode Only) */}
            {isRegisterMode && (
              <div className="space-y-2 animate-slide-up">
                <label className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Validation Security Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="password"
                    required
                    disabled={loading}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter security code"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#008cff] focus:ring-1 focus:ring-[#008cff] disabled:opacity-50 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#008cff] hover:bg-[#0070cc] disabled:bg-blue-300 text-white font-semibold text-sm py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/10 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Please wait...</span>
                </>
              ) : (
                <span>{isRegisterMode ? 'Create & Register Admin' : 'Login to Dashboard'}</span>
              )}
            </button>
          </form>

          {/* Toggle Register Mode */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setFormError('');
              }}
              className="text-xs font-semibold text-[#008cff] hover:text-[#0070cc] hover:underline transition-colors"
            >
              {isRegisterMode ? 'Already have an admin account? Login' : 'Create new admin or Register admin'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
