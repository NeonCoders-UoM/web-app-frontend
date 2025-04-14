"use client";

import React from "react";
import colors from "@/styles/colors";

interface ProgressBarProps {
  value: number;
  height?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, height = 16 }) => {
  return (
    <div
      className="w-full overflow-hidden rounded-full"
      style={{ height,
        backgroundColor: colors.neutral[200],
       }}
    >
      <div
        className="h-full transition-all duration-300 rounded-full"
        style={{
          width: `${value}%`,
          backgroundColor: colors.primary[100],
        }}
      />
    </div>
  );
};

export default ProgressBar;