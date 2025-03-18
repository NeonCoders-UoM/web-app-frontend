"use client";

import React from "react";
import colors from "@/styles/colors";

interface ProgressBarProps {
  value: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  return (
    <div className="w-full bg-neutral-200 rounded-full h-4 overflow-hidden">
      <div
        className={`h-full [${colors.primary[200]}] transition-all duration-300`}
        style={{ width: `${value}%`, backgroundColor: colors.primary[100]}}
      />
    </div>
  );
};

export default ProgressBar;