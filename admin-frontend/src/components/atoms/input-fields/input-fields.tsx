'use client';

import React from 'react';

interface InputFieldProps {
  value?: string; 
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  placeholder?: string; 
  disabled?: boolean; 
  rightIcon?: React.ReactNode; 
  size?: 'sm' | 'md'; 
  type?: string; 
  id?: string; 
  name?: string; 
  ariaLabel?: string; 
}

const InputField: React.FC<InputFieldProps> = ({
  value = '',
  onChange,
  placeholder = 'Enter text...',
  disabled = false,
  rightIcon,
  size = 'md',
  type = 'text',
  id,
  name,
  ariaLabel,
}) => {
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-md', 
  };

  
  const selectedSizeClass = sizeClasses[size];

  return (
    <div className="w-full">
      <div className={`flex items-center bg-neutral-100 border border-neutral-300 rounded-md shadow-sm h-[52px] gap-2`}>
        {/* Input Field */}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`flex-1 h-full bg-transparent border-none focus:outline-none text-neutral-600 placeholder-neutral-500 font-regular pl-4 pr-2 ${selectedSizeClass}`}
          aria-label={ariaLabel}
          suppressHydrationWarning
        />

        {/* Right Icon (if provided) */}
        {rightIcon && (
          <span className="text-neutral-400 pr-4">
            {rightIcon}
          </span>
        )}
      </div>
    </div>
  );
};

export default InputField;