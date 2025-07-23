'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import KebabMenu from '@/components/atoms/kebab-menu/kebab-menu';
interface Action {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface KebabMenuWithActionsProps {
  actions: ('edit' | 'delete' | 'view' | 'loyaltyPoints')[]; 
  onActionSelect?: (action: string) => void; 
}

const KebabMenuWithActions: React.FC<KebabMenuWithActionsProps> = ({ actions, onActionSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

 
  const actionMap: Record<string, Action> = {
    edit: {
      label: 'Edit',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      onClick: () => {
        onActionSelect?.('Edit');
      },
    },
    delete: {
      label: 'Delete',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      onClick: () => {
        onActionSelect?.('Delete');
      },
    },
    view: {
      label: 'View',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      onClick: () => {
        onActionSelect?.('View');
      },
    },
    loyaltyPoints: {
      label: 'Loyalty Points',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      ),
      onClick: () => {
        onActionSelect?.('Loyalty Points');
      },
    },
  };

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuStyle({
        position: 'absolute',
        top: rect.bottom + window.scrollY + 4,
        left: rect.right + window.scrollX - 192, // 192px is the menu width
        zIndex: 9999,
      });
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={buttonRef} style={{ display: 'inline-block' }}>
      <div onClick={() => setIsOpen(!isOpen)}>
        <KebabMenu />
      </div>

      {isOpen && typeof window !== 'undefined' && ReactDOM.createPortal(
        <div ref={menuRef} style={menuStyle} className="w-48 bg-neutral-100 rounded-md shadow-lg">
          {actions.map((action) => {
            const actionDetails = actionMap[action];
            return (
              <button
                key={action}
                onClick={() => {
                  actionDetails.onClick();
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-neutral-600 hover:bg-neutral-200 text-md font-medium rounded-md transition-colors"
              >
                <span className="mr-2">{actionDetails.icon}</span>
                {actionDetails.label}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
};

export default KebabMenuWithActions;