"use client";
import React, { useState } from "react";

interface TickBoxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const TickBox: React.FC<TickBoxProps> = ({ checked = false, onChange }) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    if (onChange) onChange(newChecked);
  };

  return (
    <div
      onClick={handleToggle}
      className={`w-4 h-4 flex items-center justify-center rounded-sm cursor-pointer ${
        isChecked 
        ? "bg-neutral-950 text-neutral-100" 
        : "bg-neutral-200 border-2 border-neutral-400"
      }`}
    >
      {isChecked && <span className="text-sm">✓</span>}
    </div>
  );
};

export default TickBox;
