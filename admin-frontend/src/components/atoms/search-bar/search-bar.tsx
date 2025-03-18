'use client';

import React from 'react';

interface SearchBarProps {
  value?: string; 
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  onFilterClick?: () => void; 
  placeholder?: string; 
  disabled?: boolean; 
}

const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  onChange,
  onFilterClick,
  placeholder = 'Search by name, type, brand or other...',
  disabled = false,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center bg-neutral-100 border border-neutral-300 rounded-md shadow-sm h-[56px] gap-4">
        {/* Search Icon (SVG) */}
        <span className="text-neutral-400 pl-4">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>

        {/* Search Input */}
        <input
          type="text"
          className="flex-1 h-full bg-transparent border-none focus:outline-none text-neutral-600 placeholder-neutral-500 text-md font-regular"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          suppressHydrationWarning
        />

        {/* Filters Button */}
        {onFilterClick && (
          <button
            onClick={onFilterClick}
            className="h-[56px] px-4 bg-neutral-200 text-neutral-600 rounded-r-md hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:bg-neutral-100 disabled:cursor-not-allowed"
            disabled={disabled}
            suppressHydrationWarning
          >
            Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;