'use client';

import React from 'react';
import { Loader2, CheckCircle, XCircle, Save, Send, Trash2 } from 'lucide-react';
import colors from '@/styles/colors';

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'success' | 'danger';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    icon?: 'save' | 'send' | 'check' | 'close' | 'loading' | 'delete';
    iconPosition?: 'left' | 'right';
    className?: string;
};

const iconMap = {
    save: <Save size={16} />,
    send: <Send size={16} />,
    check: <CheckCircle size={16} />,
    close: <XCircle size={16} />,
    delete: <Trash2 size={16} />,
    loading: <Loader2 size={16} className="animate-spin" />,
};

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'medium',
    disabled = false,
    icon,
    iconPosition = 'left',
    className = '',
}) => {
    const baseStyles = 'flex items-center justify-center gap-2 rounded-lg font-medium transition duration-200 focus:outline-none';

    const sizes = {
        small: 'px-3 py-1 text-sm',
        medium: 'px-4 py-2 text-base',
        large: 'px-6 py-3 text-lg',
    };

    const variants = {
        primary: {
            background: colors.primary[200],
            hover: colors.primary[300],
            active: colors.primary[100],
            text: '#FFFFFF',
        },
        success: {
            background: colors.states.ok,
            hover: colors.states.ok,
            active: colors.states.ok,
            text: '#FFFFFF',
        },
        danger: {
            background: colors.states.error,
            hover: colors.states.error,
            active: colors.states.error,
            text: '#FFFFFF',
        },
    };

    const currentVariant = variants[variant];

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${sizes[size]} 
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
            style={{
                backgroundColor: currentVariant.background,
                color: currentVariant.text,
                fontFamily: 'var(--font-family-text)',
                fontWeight: 'var(--font-weight-medium)',
            }}
            onMouseEnter={(e) => {
                if (!disabled) {
                    e.currentTarget.style.backgroundColor = currentVariant.hover;
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled) {
                    e.currentTarget.style.backgroundColor = currentVariant.background;
                }
            }}
            onMouseDown={(e) => {
                if (!disabled) {
                    e.currentTarget.style.backgroundColor = currentVariant.active;
                }
            }}
            onMouseUp={(e) => {
                if (!disabled) {
                    e.currentTarget.style.backgroundColor = currentVariant.background;
                }
            }}
        >
            {icon && iconPosition === 'left' && iconMap[icon]}
            {children}
            {icon && iconPosition === 'right' && iconMap[icon]}
        </button>
    );
};

export default Button;
