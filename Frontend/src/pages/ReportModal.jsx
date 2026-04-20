import React from 'react';
import { X } from 'lucide-react';
import GradientButton from '../components/ui/GradientButton';

const ReportModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[var(--surface-container-high)] w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b border-[var(--surface-container-low)]">
          <h2 className="font-bold text-[var(--error)]">Report User</h2>
          <button onClick={onClose} className="p-2 bg-[var(--surface-container-low)] rounded-full text-[var(--on-surface-variant)] hover:opacity-80">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-[var(--on-surface-variant)] text-sm mb-4">Please select a reason for reporting.</p>
          <div className="space-y-3 mb-6">
            {['Inappropriate behavior', 'Spam', 'Fake profile', 'Other'].map(r => (
              <label key={r} className="flex items-center gap-3 bg-[var(--surface-container-low)] p-3 rounded-xl cursor-pointer hover:bg-[var(--surface-variant)]">
                <input type="radio" name="report_reason" className="accent-[var(--primary)] w-4 h-4" />
                <span className="text-[var(--on-surface)] font-medium text-sm">{r}</span>
              </label>
            ))}
          </div>
          <GradientButton onClick={onClose}>Submit Report</GradientButton>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
