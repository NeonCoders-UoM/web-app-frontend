"use client"; 

import React, { useState } from "react";
import colors from "@/styles/colors"; 

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
      style={{
        width: "200px",
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        fontSize: "14px",
        fontWeight: 500,
        fontFamily: "Montserrat, sans-serif",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
        backgroundColor: isActive ? "rgba(39, 95, 235, 0.8)" : isHovered ? colors.neutral[150] : colors.neutral[100],
        color: isActive ? "#FFFFFF" : colors.primary[300],
        position: "relative",
        paddingLeft: "16px",
      }}
    >
      {/* Button text */}
      <span>{label}</span>

      {/* Left indicator */}
      <div
        style={{
          position: "absolute",
          left: "-8px",
          width: "4px",
          height: "70%",
          backgroundColor: isActive ? "rgba(39, 95, 235, 0.8)" : colors.neutral[300],
          borderRadius: "2px",
        }}
      ></div>
    </div>
  );
};

export default SidebarButton;
