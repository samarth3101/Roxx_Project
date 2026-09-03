import React, { useState } from 'react';
import { Modal } from './Modal';
import { useAuth } from '../context/AuthContext';
import { Check, X, AlertCircle } from 'lucide-react';

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
      if (!hasLength) {
        setError('Password must be between 8 and 16 characters in length.');
      } else if (!hasUpper) {
        setError('Password needs at least one uppercase letter (A-Z).');
      } else if (!hasSpecial) {
        setError('Password must include at least one special character (e.g. !@#$%^&*).');
      } else if (!passwordsMatch) {
        setError('The new passwords do not match.');
      }
      return;
    }

    setLoading(true);
    try {
      await updatePassword(currentPassword, newPassword);
      setSuccess('Password updated successfully.');
      setTimeout(() => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setSuccess('');
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update password.');
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Change password">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-2.5 bg-[#FAF9F6] border border-[#B5544A]/30 rounded-[8px] text-[#B5544A] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-2.5 bg-[#FAF9F6] border border-[#6B8F6B]/30 rounded-[8px] text-[#6B8F6B] text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-[#2B2924] mb-1">
            Current password
          </label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            className="w-full craft-input"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#2B2924] mb-1">
            New password
          </label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="8 to 16 characters"
            className="w-full craft-input"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#2B2924] mb-1">
            Confirm new password
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            className="w-full craft-input"
          />
        </div>

        {/* Real-time Inline Validation Feedback */}
        <div className="p-3 bg-[#FAF9F6] rounded-[8px] border border-[#E8E5DF] space-y-1.5 text-xs">
          <p className="font-medium text-[#2B2924] mb-1">Requirements:</p>
          <div className="flex items-center gap-2">
            {hasLength ? (
              <Check className="w-3.5 h-3.5 text-[#6B8F6B]" />
            ) : (
              <X className="w-3.5 h-3.5 text-[#8A8578]" />
            )}
            <span className={hasLength ? 'text-[#6B8F6B] font-medium' : 'text-[#8A8578]'}>
              8 to 16 characters
            </span>
          </div>
          <div className="flex items-center gap-2">
            {hasUpper ? (
              <Check className="w-3.5 h-3.5 text-[#6B8F6B]" />
            ) : (
              <X className="w-3.5 h-3.5 text-[#8A8578]" />
            )}
            <span className={hasUpper ? 'text-[#6B8F6B] font-medium' : 'text-[#8A8578]'}>
              At least one uppercase letter (A-Z)
            </span>
          </div>
          <div className="flex items-center gap-2">
            {hasSpecial ? (
              <Check className="w-3.5 h-3.5 text-[#6B8F6B]" />
            ) : (
              <X className="w-3.5 h-3.5 text-[#8A8578]" />
            )}
            <span className={hasSpecial ? 'text-[#6B8F6B] font-medium' : 'text-[#8A8578]'}>
              At least one special character (!@#$%^&*...)
            </span>
          </div>
          {newPassword && (
            <div className="flex items-center gap-2">
              {passwordsMatch ? (
                <Check className="w-3.5 h-3.5 text-[#6B8F6B]" />
              ) : (
                <X className="w-3.5 h-3.5 text-[#B5544A]" />
              )}
              <span className={passwordsMatch ? 'text-[#6B8F6B] font-medium' : 'text-[#B5544A]'}>
                Passwords match
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="btn-secondary text-xs py-1.5 px-3"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="btn-primary text-xs py-1.5 px-3.5"
          >
            {loading ? 'Updating...' : 'Update password'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
