import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Store, Lock, Mail, ArrowRight, Shield, Building2, User, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser.role === 'ADMIN') {
        navigate('/admin');
      } else if (loggedInUser.role === 'STORE_OWNER') {
        navigate('/owner');
      } else {
        navigate('/stores');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/20 mb-2">
            <Store className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold font-display tracking-tight text-slate-900">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500">
            Sign in to access your role-specific dashboard & store ratings
          </p>
        </div>

        {/* Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 space-y-5">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-sm font-semibold mt-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
              Instant Demo Access
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('admin@roxx.com', 'Admin@1234')}
                className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[11px] font-semibold text-blue-700 transition-colors flex flex-col items-center gap-1 cursor-pointer shadow-xs"
              >
                <Shield className="w-4 h-4 text-blue-600" />
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('owner1@roxx.com', 'Owner@1234')}
                className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[11px] font-semibold text-amber-800 transition-colors flex flex-col items-center gap-1 cursor-pointer shadow-xs"
              >
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>Store Owner</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('user1@roxx.com', 'User@1234')}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[11px] font-semibold text-slate-700 transition-colors flex flex-col items-center gap-1 cursor-pointer shadow-xs"
              >
                <User className="w-4 h-4 text-slate-600" />
                <span>Normal User</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-4">
            Sign up as a normal user
          </Link>
        </p>
      </div>
    </div>
  );
};
