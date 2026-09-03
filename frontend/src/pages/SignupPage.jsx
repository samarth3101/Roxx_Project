import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Store,
  ArrowRight,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';

export const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Live Validations
  const isNameValid = name.trim().length >= 2 && name.trim().length <= 60;
  const isAddressValid = address.trim().length > 0 && address.trim().length <= 400;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const hasPassLength = password.length >= 8 && password.length <= 16;
  const hasPassUpper = /[A-Z]/.test(password);
  const hasPassSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const isPasswordValid = hasPassLength && hasPassUpper && hasPassSpecial;

  const isFormValid = isNameValid && isAddressValid && isEmailValid && isPasswordValid;

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!isFormValid) {
      if (!isNameValid) {
        setError('Full name must be at least 2 characters long.');
      } else if (!isEmailValid) {
        setError('Please enter a valid email address.');
      } else if (!isAddressValid) {
        setError('Address cannot be blank and must be under 400 characters.');
      } else if (!hasPassLength) {
        setError('Password must be 8 to 16 characters.');
      } else if (!hasPassUpper) {
        setError('Password needs at least 1 uppercase letter.');
      } else if (!hasPassSpecial) {
        setError('Password needs at least 1 special character.');
      }
      return;
    }

    setLoading(true);
    try {
      await signup({
        name: name.trim(),
        email: email.trim(),
        address: address.trim(),
        password,
      });
      navigate('/stores');
    } catch (err) {
      const serverMsg =
        err.response?.data?.errors?.map((e) => e.message).join('; ') ||
        err.response?.data?.message ||
        err.message ||
        'Registration failed. Please check the details and retry.';
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] texture-dots hero-glow flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[460px] z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-[8px] bg-[#FFFFFF] border border-[#E8E5DF] text-[#C9714F] mb-1">
            <Store className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-semibold text-[#1A1815] tracking-tight">
            Create an account
          </h1>
          <p className="text-xs text-[#8A8578]">
            Sign up as a normal user to explore and submit store ratings
          </p>
        </div>

        {/* Form Card */}
        <div className="craft-card p-6 sm:p-7 space-y-5">
          {error && (
            <div className="p-3 bg-[#FAF9F6] border border-[#B5544A]/30 rounded-[8px] text-[#B5544A] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-3.5">
            {/* Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-[#2B2924]">
                  Full name
                </label>
                <span
                  className={`text-[11px] tabular-nums ${
                    isNameValid ? 'text-[#6B8F6B] font-medium' : 'text-[#8A8578]'
                  }`}
                >
                  {name.length}/60
                </span>
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Samarth Patil"
                className="w-full craft-input"
              />
              {name.length > 0 && !isNameValid && (
                <p className="text-[11px] text-[#C9A15A] mt-1">
                  {name.trim().length < 2
                    ? 'Needs at least 2 characters'
                    : 'Exceeds maximum length of 60 characters'}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-[#2B2924] mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full craft-input"
              />
            </div>

            {/* Address */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-[#2B2924]">
                  Address (max 400 characters)
                </label>
                <span
                  className={`text-[11px] tabular-nums ${
                    address.length <= 400 ? 'text-[#8A8578]' : 'text-[#B5544A]'
                  }`}
                >
                  {address.length}/400
                </span>
              </div>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, city, state and zip"
                className="w-full craft-input resize-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-[#2B2924] mb-1">
                Password (8 to 16 characters)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full craft-input"
              />
            </div>

            {/* Live Inline Feedback Checklist */}
            <div className="p-3 bg-[#FAF9F6] rounded-[8px] border border-[#E8E5DF] space-y-1.5 text-xs">
              <p className="font-medium text-[#2B2924] mb-1">Password rules:</p>
              <div className="flex items-center gap-2">
                {hasPassLength ? (
                  <Check className="w-3.5 h-3.5 text-[#6B8F6B]" />
                ) : (
                  <X className="w-3.5 h-3.5 text-[#8A8578]" />
                )}
                <span className={hasPassLength ? 'text-[#6B8F6B] font-medium' : 'text-[#8A8578]'}>
                  8 to 16 characters in length
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasPassUpper ? (
                  <Check className="w-3.5 h-3.5 text-[#6B8F6B]" />
                ) : (
                  <X className="w-3.5 h-3.5 text-[#8A8578]" />
                )}
                <span className={hasPassUpper ? 'text-[#6B8F6B] font-medium' : 'text-[#8A8578]'}>
                  At least one uppercase letter (A-Z)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasPassSpecial ? (
                  <Check className="w-3.5 h-3.5 text-[#6B8F6B]" />
                ) : (
                  <X className="w-3.5 h-3.5 text-[#8A8578]" />
                )}
                <span className={hasPassSpecial ? 'text-[#6B8F6B] font-medium' : 'text-[#8A8578]'}>
                  At least one special character (!@#$%^&*...)
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full btn-primary py-2 text-sm mt-1"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span>Complete sign up</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#8A8578]">
          Already have an account?{' '}
          <Link to="/login" className="craft-link font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
