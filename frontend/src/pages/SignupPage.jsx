import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Store,
  Lock,
  Mail,
  User,
  MapPin,
  ArrowRight,
  CheckCircle2,
  XCircle,
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
  const isNameValid = name.trim().length >= 20 && name.trim().length <= 60;
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
      setError('Please resolve all validation errors before proceeding.');
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
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/20 mb-2">
            <Store className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold font-display tracking-tight text-slate-900">
            Create an Account
          </h1>
          <p className="text-sm text-slate-500">
            Join the platform as a normal user to explore and rate registered stores
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 space-y-5">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Name */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Full Name (20 to 60 characters)
                </label>
                <span
                  className={`text-[11px] ${
                    name.length >= 20 && name.length <= 60
                      ? 'text-emerald-600 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  {name.length}/60
                </span>
              </div>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Christopher Robin Customer One"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
              {name.length > 0 && !isNameValid && (
                <p className="text-[11px] text-amber-600 font-medium mt-1">
                  {name.length < 20
                    ? `Needs ${20 - name.length} more characters (min 20)`
                    : 'Exceeds maximum of 60 characters'}
                </p>
              )}
            </div>

            {/* Email */}
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
                  placeholder="user@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Address (max 400 characters)
                </label>
                <span
                  className={`text-[11px] ${
                    address.length <= 400 ? 'text-slate-400' : 'text-rose-600 font-semibold'
                  }`}
                >
                  {address.length}/400
                </span>
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 12 Blossom Lane, Green Meadows Suburb, Austin, TX"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm resize-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password (8-16 chars, 1 uppercase, 1 special character)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. UserPass@2026"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            {/* Live Password Checklist */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <p className="font-semibold text-slate-700 mb-1">Password Requirements:</p>
              <div className="flex items-center gap-2">
                {hasPassLength ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span className={hasPassLength ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                  8 to 16 characters ({password.length}/16)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasPassUpper ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span className={hasPassUpper ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                  At least one uppercase letter (A-Z)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasPassSpecial ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span className={hasPassSpecial ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                  At least one special character (!@#$%^&*...)
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full btn-primary py-3 text-sm font-semibold mt-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-4">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};
