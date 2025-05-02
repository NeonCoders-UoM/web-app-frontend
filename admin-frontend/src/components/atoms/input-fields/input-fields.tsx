"use client";

import React from 'react';
import colors from '../../../styles/colors';

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
  status?: 'error' | 'ok' | 'default'; // Add status prop
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
  status = 'default',
}) => {
  const sizeClasses = {
    sm: 'text-sm h-10',
    md: 'text-md h-12',
  };

  const selectedSizeClass = sizeClasses[size];

  const textColor = {
    error: colors.states.error,
    ok: colors.states.ok,
    default: colors.neutral[600],
  }[status];

  const placeholderColor = {
    error: colors.states.error,
    ok: colors.states.ok,
    default: colors.neutral[500],
  }[status];

  return (
    <div className="w-full">
      <div
        className={`flex items-center bg-${colors.neutral[100]} border border-${colors.neutral[300]} rounded-md shadow-sm ${selectedSizeClass} gap-2`}
        style={{ height: '52px' }}
      >
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`flex-1 h-full bg-transparent border-none focus:outline-none text-${textColor} placeholder-${placeholderColor} font-regular pl-4 pr-2 ${selectedSizeClass}`}
          aria-label={ariaLabel}
          suppressHydrationWarning
        />
        {rightIcon && <span className={`text-${colors.neutral[400]} pr-4`}>{rightIcon}</span>}
      </div>
    </div>
  );
};

export default InputField;