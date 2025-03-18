"use client"; 

import React from "react";
import SidebarButton from "@/components/atoms/sidebar-button/sidebar-button";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  sections: { label: string }[];
  logo?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  sections,
  logo = "V PASS",
}) => {
  return (
    <div className="w-64 min-h-screen flex flex-col bg-neutral-100 shadow-md">
     
      <div className="p-4 flex items-center justify-center">
        <span className="text-xl font-bold text-primary-200">{logo}</span>
      </div>

     
      <div className="flex-1 px-4 space-y-2">
        {sections.map((section) => (
          <SidebarButton
            key={section.label}
            label={section.label}
            isActive={activeSection === section.label}
            onClick={() => onSectionChange(section.label)}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
