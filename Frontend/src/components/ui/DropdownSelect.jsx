import React from 'react';
import { ChevronDown } from 'lucide-react';

const DropdownSelect = ({ value, onChange, options, placeholder = 'Select...', className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={onChange}
        className="w-full appearance-none bg-[var(--surface-container-low)] border-none text-[var(--on-surface)] 
          px-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)]
          transition-shadow"
      >
        <option value="" disabled className="text-[var(--on-surface-variant)]">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-[var(--surface-container-high)] text-[var(--on-surface)]">
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--on-surface-variant)]">
        <ChevronDown size={20} />
      </div>
    </div>
  );
};

export default DropdownSelect;
