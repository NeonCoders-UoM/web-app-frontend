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
      <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 h-14 gap-4">
        {/* Search Icon (SVG) */}
        <span className="text-gray-400 pl-4">
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
          className="flex-1 h-full bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-400 text-sm font-medium"
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
            className="h-14 px-6 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 rounded-r-xl hover:from-gray-100 hover:to-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm"
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