"use client";

import React from "react";
import colors from "@/styles/colors";

type ShiftCardProps = {
  day: string;
  status: string; // e.g., "Locked", "Unlocked", or custom status
  specificDate?: string; // Optional specific date in YYYY-MM-DD format
};

const ShiftCard: React.FC<ShiftCardProps> = ({ day, status, specificDate }) => {
  // Determine status color based on the status value
  const statusColor =
    status.toLowerCase() === "locked" ? colors.neutral[600] : colors.states.ok; // Green for "Unlocked" or other statuses

  // Format the display text
  const displayText = specificDate
    ? `${day} (${new Date(specificDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })})`
    : day;

  return (
    <div
      className="flex items-center justify-between px-4 rounded-lg"
      style={{
        width: "396px",
        height: "58px",
        backgroundColor: colors.neutral[100],
        border: `1px solid ${colors.neutral[150]}`,
        fontFamily: "var(--font-family-text)",
      }}
    >
      <span
        className="text-md font-medium"
        style={{ color: colors.neutral[300] }}
      >
        {displayText}
      </span>
      <span className="text-md font-semibold" style={{ color: statusColor }}>
        {status.toUpperCase()}
      </span>
    </div>
  );
};

export default ShiftCard;
