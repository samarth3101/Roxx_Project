import React, { useState } from 'react';
import { Modal } from './Modal';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { updatePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password validation checks
  const hasLength = newPassword.length >= 8 && newPassword.length <= 16;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);
  const passwordsMatch = newPassword && newPassword === confirmPassword;
  const isFormValid = hasLength && hasUpper && hasSpecial && passwordsMatch && currentPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isFormValid) {
      setError('Please fulfill all password requirements before submitting.');
      return;
    }

    setLoading(true);
    try {
      await updatePassword(currentPassword, newPassword);
      setSuccess('Password changed successfully!');
      setTimeout(() => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setSuccess('');
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Update Your Password">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Current Password
          </label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            New Password
          </label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="8-16 characters"
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Confirm New Password
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>

        {/* Live Validation Hints */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
          <p className="font-semibold text-slate-700 mb-1">Password Requirements:</p>
          <div className="flex items-center gap-2">
            {hasLength ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className={hasLength ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
              8 to 16 characters in length
            </span>
          </div>
          <div className="flex items-center gap-2">
            {hasUpper ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className={hasUpper ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
              At least one uppercase letter (A-Z)
            </span>
          </div>
          <div className="flex items-center gap-2">
            {hasSpecial ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className={hasSpecial ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
              At least one special character (!@#$%^&*...)
            </span>
          </div>
          {newPassword && (
            <div className="flex items-center gap-2">
              {passwordsMatch ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-rose-500" />
              )}
              <span className={passwordsMatch ? 'text-emerald-700 font-medium' : 'text-rose-600'}>
                Passwords match
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="btn-secondary text-xs px-3.5 py-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="btn-primary text-xs px-4 py-2"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
