"use client";

import React, { useState } from "react";
import colors from "@/styles/colors";

interface ToggleButtonProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ checked = false, onChange }) => {
  const [isOn, setIsOn] = useState<boolean>(checked);

  // Update internal state when checked prop changes
  React.useEffect(() => {
    setIsOn(checked);
  }, [checked]);

  const handleToggle = () => {
    const newChecked = !isOn;
    setIsOn(newChecked);
    if (onChange) onChange(newChecked);
  };

  return (
    <div
      onClick={handleToggle}
      className="w-10 h-5 flex items-center rounded-full p-0.5 transition-all duration-300"
      style={{
        backgroundColor: isOn ? colors.states.ok : colors.neutral[200],
      }}
    >
      <div
        className="w-4 h-4 rounded-full shadow-md transform transition-transform duration-300"
        style={{
          backgroundColor: colors.neutral[100],
          transform: isOn ? "translateX(1.25rem)" : "translateX(0)",
        }}
      />
    </div>
  );
};

export default ToggleButton;