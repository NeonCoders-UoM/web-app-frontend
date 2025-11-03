"use client"; 

import React, { useState } from "react";

interface SidebarButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ label, isActive, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`
        relative w-full h-12 flex items-center px-4 mx-2 rounded-xl cursor-pointer
        transition-all duration-300 ease-in-out transform
        ${isActive 
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white ' 
          : isHovered 
            ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-100 shadow-lg shadow-gray-700/30' 
            : 'bg-transparent text-gray-300 hover:text-white'
        }
        group
      `}
      style={{
        fontFamily: "Montserrat, sans-serif",
        fontSize: "14px",
        fontWeight: isActive ? 600 : 500,
        backdropFilter: isHovered || isActive ? 'blur(10px)' : 'none',
        border: isActive ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
      }}
    >
      {/* Active indicator line with glow effect */}
      <div
        className={`
          absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 rounded-r-full
          transition-all duration-300 ease-in-out
          ${isActive 
            ? 'bg-blue-400 shadow-lg shadow-blue-400/60 w-1.5' 
            : isHovered 
              ? 'bg-gray-400 shadow-md shadow-gray-400/40 w-1' 
              : 'bg-transparent w-0'
          }
        `}
      />
      
      <div className="w-3 h-3 mr-2" /> {/* Empty spacer */}
      
      {/* Text with subtle animation */}
      <span className={`
        relative z-10 transition-all duration-300
        ${isHovered || isActive ? 'tracking-wide' : 'tracking-normal'}
      `}>
        {label}
      </span>

      {/* Ripple effect on click */}
      <div 
        className={`
          absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300
          ${isActive ? 'opacity-20' : 'opacity-0'}
          bg-gradient-to-r from-blue-400/20 to-blue-600/20
        `}
      />

      {/* 3D shadow effect */}
      {(isHovered || isActive) && (
        <div 
          className={`
            absolute inset-0 rounded-xl -z-10 transition-all duration-300
            ${isActive 
              ? 'bg-gradient-to-br from-blue-600/30 to-blue-800/30' 
              : 'bg-gradient-to-br from-gray-600/20 to-gray-800/20'
            }
          `}
          style={{
            transform: 'translateY(3px) translateX(3px)',
            filter: 'none',
          }}
        />
      )}
    </div>
  );
};

export default SidebarButton;
