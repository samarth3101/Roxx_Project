import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Store, ArrowRight, Shield, Building2, User, AlertCircle } from 'lucide-react';

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
      setError(err.response?.data?.message || err.message || 'Incorrect email or password. Please try again.');
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
    <div className="min-h-screen bg-[#FAF9F6] texture-dots hero-glow flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[400px] z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-[8px] bg-[#FFFFFF] border border-[#E8E5DF] text-[#C9714F] mb-1">
            <Store className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-semibold text-[#1A1815] tracking-tight">
            Sign in to your account
          </h1>
          <p className="text-xs text-[#8A8578]">
            Access platform management, stores, and ratings
          </p>
        </div>

        {/* Card */}
        <div className="craft-card p-6 sm:p-7 space-y-5">
          {error && (
            <div className="p-3 bg-[#FAF9F6] border border-[#B5544A]/30 rounded-[8px] text-[#B5544A] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#2B2924] mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full craft-input"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-[#2B2924]">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full craft-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2 text-sm mt-1"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>
          </form>

          {/* Quick Demo Access Credentials */}
          <div className="pt-4 border-t border-[#E8E5DF] space-y-2">
            <p className="text-[11px] font-medium text-[#8A8578] text-center">
              Quick demo login
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => fillDemo('admin@roxx.com', 'Admin@1234')}
                className="p-2 rounded-[6px] bg-[#FAF9F6] hover:bg-[#F2EFE9] border border-[#E8E5DF] text-[11px] font-medium text-[#2B2924] transition-colors flex flex-col items-center gap-1 cursor-pointer focus-visible:ring-1 focus-visible:ring-[#4A6FA5]"
              >
                <Shield className="w-3.5 h-3.5 text-[#4A6FA5]" />
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('owner1@roxx.com', 'Owner@1234')}
                className="p-2 rounded-[6px] bg-[#FAF9F6] hover:bg-[#F2EFE9] border border-[#E8E5DF] text-[11px] font-medium text-[#2B2924] transition-colors flex flex-col items-center gap-1 cursor-pointer focus-visible:ring-1 focus-visible:ring-[#4A6FA5]"
              >
                <Building2 className="w-3.5 h-3.5 text-[#C9714F]" />
                <span>Store owner</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('user1@roxx.com', 'User@1234')}
                className="p-2 rounded-[6px] bg-[#FAF9F6] hover:bg-[#F2EFE9] border border-[#E8E5DF] text-[11px] font-medium text-[#2B2924] transition-colors flex flex-col items-center gap-1 cursor-pointer focus-visible:ring-1 focus-visible:ring-[#4A6FA5]"
              >
                <User className="w-3.5 h-3.5 text-[#6B8F6B]" />
                <span>Normal user</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#8A8578]">
          Don't have an account yet?{' '}
          <Link to="/signup" className="craft-link font-medium">
            Sign up as a normal user
          </Link>
        </p>
      </div>
    </div>
  );
};
