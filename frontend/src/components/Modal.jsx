import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dim overlay */}
      <div
        className="fixed inset-0 bg-[#1A1815]/25 backdrop-blur-[2px] transition-opacity duration-150"
        onClick={onClose}
      />

      {/* Craft Modal Dialog */}
      <div
        className={`relative w-full ${maxWidth} bg-[#FFFFFF] border border-[#E8E5DF] rounded-[8px] shadow-dropdown p-6 z-10 transition-all duration-150`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DF]">
          <h3 className="text-base font-semibold text-[#1A1815]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#8A8578] hover:text-[#1A1815] rounded-[6px] hover:bg-[#FAF9F6] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4A6FA5]"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};
