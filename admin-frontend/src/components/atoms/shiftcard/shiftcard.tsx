"use client";

import React from "react";
import colors from "@/styles/colors";

type ShiftCardProps = {
  date: string; // ISO date string, e.g., "2025-09-13" or "2025-09-13T00:00:00Z"
  status: string; // e.g., "Closed"
  day?: string; // Optional weekday, e.g., "Sat"
};

const ShiftCard: React.FC<ShiftCardProps> = ({ date, status, day }) => {
  // Determine status color based on the status value
  const statusColor =
    status.toLowerCase() === "locked" ? colors.neutral[600] : colors.states.ok;

  // Validate and format the display text using date
  const formatDisplayDate = (dateStr: string): string => {
    // Normalize ISO date string by removing time component
    const normalized = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(normalized)) {
      console.warn(`Invalid date format: ${dateStr}`);
      return "Invalid Date";
    }

    const [year, month, day] = normalized.split("-").map(Number);
    const parsedDate = new Date(Date.UTC(year, month - 1, day));

    // Check if the date is valid
    if (isNaN(parsedDate.getTime())) {
      console.warn(`Invalid date values: ${dateStr}`);
      return "Invalid Date";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  // Derive weekday if not provided, ensuring consistency with date
  const derivedDay = day || new Date(date.includes("T") ? date : `${date}T00:00:00Z`).toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: "UTC",
  });

  const displayText = `${formatDisplayDate(date)} (${derivedDay})`;

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