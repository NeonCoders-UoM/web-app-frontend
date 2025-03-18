"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  label: string;
  options: string[];
  placeholder?: string;
  onSelect: (option: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ 
  label, 
  options, 
  placeholder, 
  onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="w-64">
      <label className="block text-sm text-neutral-600 mb-1">{label}</label>
      <div className="relative">
        <button
          className="w-full flex items-center px-4 py-2 bg-neutral-100 border border-neutral-400 rounded-md shadow-sm focus:ring-2 focus:ring-primary-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selected || <span className="flex-1 text-left text-neutral-500">{placeholder}</span>}
          <ChevronDown size={20} className="text-neutral-500 ml-2" />
        </button>

        {isOpen && (
          <ul className="absolute mt-1 w-full bg-neutral-100 border border-neutral-400 rounded-md shadow-md max-h-40 overflow-y-auto z-10">
            {options.map((option, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-neutral-200 cursor-pointer"
                onClick={() => {
                  setSelected(option);
                  onSelect(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
