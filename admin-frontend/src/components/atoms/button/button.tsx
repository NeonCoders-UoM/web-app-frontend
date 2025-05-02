"use client";

import React, { useState } from 'react';
import colors from '../../../styles/colors';
import * as HeroIcons from '@heroicons/react/24/outline';

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'text';
  size: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onClick?: () => void;
  icon?: keyof typeof HeroIcons;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  children,
  onClick,
  icon,
  iconPosition = 'left',
  disabled = false,
  className = '',
  type = 'button',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleMouseEnter = () => !disabled && setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsActive(false);
  };
  const handleMouseDown = () => !disabled && setIsActive(true);
  const handleMouseUp = () => setIsActive(false);

  const baseStyles = {
    borderRadius: '8px',
    fontFamily: 'var(--font-family-text)',
    fontWeight: 'var(--font-weight-semibold)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box' as const,
    gap: '8px',
    opacity: disabled ? 0.5 : 1,
  };

  const sizeStyles = {
    small: {
      width: '123px',
      height: '40px',
      padding: '0 16px',
      fontSize: 'var(--font-size-sm)',
      iconSize: '16px',
    },
    medium: {
      width: 'full',
      height: '48px',
      padding: '0 24px',
      fontSize: 'var(--font-size-md)',
      iconSize: '20px',
    },
    large: {
      width: '192px',
      height: '56px',
      padding: '0 32px',
      fontSize: 'var(--font-size-lg)',
      iconSize: '24px',
    },
  };

  const variantStyles = {
    primary: {
      default: {
        backgroundColor: colors.primary[200],
        color: colors.neutral[100],
        border: 'none',
      },
      hover: {
        backgroundColor: colors.primary[300],
        color: colors.neutral[100],
        border: 'none',
      },
      active: {
        backgroundColor: colors.primary[100],
        color: colors.neutral[100],
        border: 'none',
      },
    },
    secondary: {
      default: {
        backgroundColor: colors.neutral[100],
        color: colors.primary[200],
        border: `2px solid ${colors.primary[200]}`,
      },
      hover: {
        backgroundColor: colors.neutral[100],
        color: colors.primary[300],
        border: `2px solid ${colors.primary[300]}`,
      },
      active: {
        backgroundColor: colors.neutral[100],
        color: colors.primary[100],
        border: `2px solid ${colors.primary[100]}`,
      },
    },
    text: {
      default: {
        backgroundColor: 'transparent',
        color: colors.primary[200],
        border: 'none',
      },
      hover: {
        backgroundColor: 'transparent',
        color: colors.primary[300],
        border: 'none',
      },
      active: {
        backgroundColor: 'transparent',
        color: colors.primary[100],
        border: 'none',
      },
    },
  };

  const currentState = isActive ? 'active' : isHovered ? 'hover' : 'default';
  const styles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant][currentState],
  };

  const IconComponent = icon ? HeroIcons[icon] : null;

  return (
    <button
      type={type}
      style={styles}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      disabled={disabled}
      className={`w-full ${className}`}
      suppressHydrationWarning={true} // Suppress hydration warning
    >
      {icon && iconPosition === 'left' && IconComponent && (
        <IconComponent
          style={{
            width: sizeStyles[size].iconSize,
            height: sizeStyles[size].iconSize,
            color: styles.color,
          }}
        />
      )}
      {children}
      {icon && iconPosition === 'right' && IconComponent && (
        <IconComponent
          style={{
            width: sizeStyles[size].iconSize,
            height: sizeStyles[size].iconSize,
            color: styles.color,
          }}
        />
      )}
    </button>
  );
};

export default Button;