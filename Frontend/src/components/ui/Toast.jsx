import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = {
    success: 'bg-[var(--tertiary-container)] text-[var(--on-tertiary-container)]',
    error: 'bg-[var(--error-container)] text-[var(--on-error-container)]',
    info: 'bg-[var(--surface-container-highest)] text-[var(--on-surface)]',
  };

  const icons = {
    success: <CheckCircle size={20} className="mr-2" />,
    error: <AlertCircle size={20} className="mr-2" />,
    info: null,
  };

  return (
    <div className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 flex items-center px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up ${styles[type]}`}>
      {icons[type]}
      <span className="mr-4 text-sm font-medium">{message}</span>
      <button onClick={onClose} className="hover:opacity-70 focus:outline-none">
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;
