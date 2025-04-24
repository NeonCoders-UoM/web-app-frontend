"use client"

import React, { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"

interface DropdownProps {
  options: string[]
  placeholder?: string
  onSelect: (option: string) => void
  className?: string
  selectedOption?: string
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  placeholder = "Select an option",
  onSelect,
  className = "w-64",
  selectedOption,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<string | null>(selectedOption || null)

  // Update selected state when selectedOption prop changes
  useEffect(() => {
    setSelected(selectedOption || null)
  }, [selectedOption])

  const handleOptionClick = (option: string) => {
    setSelected(option)
    onSelect(option)
    setIsOpen(false)
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="relative">
        {/* Dropdown Button */}
        <button
          className="w-full flex items-center justify-between px-4 py-2 bg-neutral-100 border border-neutral-400 rounded-md shadow-sm focus:ring-2 focus:ring-primary-100"
          onClick={() => setIsOpen(!isOpen)}
          suppressHydrationWarning
        >
          <span className={`flex-1 text-left ${selected ? "" : "text-neutral-500"}`}>
            {selected || placeholder}
          </span>
          <ChevronDown size={20} className="text-neutral-500 ml-2 shrink-0" />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <ul className="absolute mt-1 w-full bg-neutral-100 border border-neutral-400 rounded-md shadow-md max-h-40 overflow-y-auto z-10">
            {options.map((option, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-neutral-200 cursor-pointer"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Dropdown