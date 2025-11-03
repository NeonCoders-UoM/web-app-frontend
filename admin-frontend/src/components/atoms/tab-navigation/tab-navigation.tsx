'use client';

import React from 'react';

interface Tab {
  label: string; 
  icon: React.ReactNode; 
  onClose?: () => void; 
}

interface TabNavigationProps {
  tabs: Tab[]; 
  activeTab: string; 
  onTabChange: (label: string) => void; 
}

const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-2" role="tablist">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.label;
        return (
          <div
            key={tab.label}
            className={`relative flex items-center px-4 py-2 rounded-t-md transition-all duration-200 ${
              isActive
                ? 'bg-neutral-100 text-primary-200 border-l-2 border-primary-200'
                : 'bg-neutral-150 text-neutral-500'
            }`}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.label)}
          >
            {/* Left Icon */}
            <span className="mr-2 text-md">{tab.icon}</span>

            {/* Label */}
            <span className="text-md font-medium flex-1">{tab.label}</span>

            {/* Close Button (only for non-active tabs) */}
            {tab.onClose && !isActive && (
              <span
                className="ml-2 text-neutral-500 hover:text-neutral-600 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); 
                  tab.onClose!();
                }}
              >
                ×
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TabNavigation;