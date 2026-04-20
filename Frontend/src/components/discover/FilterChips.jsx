import React from 'react';
import PillBadge from '../ui/PillBadge';

const FilterChips = ({ options, selectedOptions, onToggle }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
      {options.map((option) => {
        const isSelected = selectedOptions.includes(option.value);
        return (
          <PillBadge 
            key={option.value}
            active={isSelected}
            onClick={() => onToggle(option.value)}
          >
            {option.label}
          </PillBadge>
        );
      })}
    </div>
  );
};

export default FilterChips;
