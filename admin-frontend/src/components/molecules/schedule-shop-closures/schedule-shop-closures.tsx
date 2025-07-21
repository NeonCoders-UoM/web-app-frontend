"use client";

import React, { useState } from "react";
import colors from "@/styles/colors";
import DayPicker from "@/components/atoms/day-picker/day-picker";
import Button from "@/components/atoms/button/button";

const Select: React.FC<{
  options: string[];
  value: string;
  onChange: (value: string) => void;
}> = ({ options, value, onChange }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-neutral-600 mb-2">
      Week
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border border-neutral-150 rounded-md text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-200"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

interface ScheduleShopClosuresProps {
  onSave: (week: string, days: string[]) => void;
  allWeeks?: string[];
  currentWeek?: number;
}

const ScheduleShopClosures: React.FC<ScheduleShopClosuresProps> = ({
  onSave,
  allWeeks = [],
  currentWeek = 12,
}) => {
  // Use currentWeek to determine the selected week
  const selectedWeek = allWeeks.length > 0 && currentWeek > 0 && currentWeek <= allWeeks.length 
    ? allWeeks[currentWeek - 1] 
    : "Week 12 (Jan 1-7)";
  const [selectedDays, setSelectedDays] = useState<string[]>(["Mon"]);

  // Use provided allWeeks or fallback to default weeks
  const weeks =
    allWeeks.length > 0
      ? allWeeks
      : [
          "Week 12 (Jan 1-7)",
          "Week 13 (Jan 8-14)",
          "Week 14 (Jan 15-21)",
          "Week 15 (Jan 22-28)",
        ];

  const handleSave = () => {
    onSave(selectedWeek, selectedDays);
  };

  return (
    <div
      className="p-6 rounded-lg space-y-6"
      style={{
        backgroundColor: "#F3F7FF",
        fontFamily: "var(--font-family-text)",
      }}
    >
      <div
        className="text-lg font-semibold"
        style={{ color: colors.neutral[600] }}
      >
        Schedule Shop Closures
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Select
            options={weeks}
            value={selectedWeek}
            onChange={() => {}} // Read-only since it's controlled by parent
          />
          <p className="text-xs text-neutral-500">
            Week selection is controlled by the main page. Use the week selector above to change weeks.
          </p>
        </div>
        <DayPicker selectedDays={selectedDays} onDayChange={setSelectedDays} />
      </div>
      <div className="flex justify-end">
        <Button variant="primary" size="small" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default ScheduleShopClosures;
