'use client';

import React, { useState } from 'react';
import colors from '@/styles/colors';
import DayPicker from '@/components/atoms/day-picker/day-picker';
import Button from '@/components/atoms/button/button';

const Select: React.FC<{
  options: string[];
  value: string;
  onChange: (value: string) => void;
}> = ({ options, value, onChange }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-neutral-600 mb-2">Week</label>
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

const ScheduleShopClosures: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState('Week 12 (Jan 1-7)');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon']);
  const weeks = [
    'Week 12 (Jan 1-7)',
    'Week 13 (Jan 8-14)',
    'Week 14 (Jan 15-21)',
    'Week 15 (Jan 22-28)',
  ];

  const handleSave = () => {
    console.log('Saved:', { week: selectedWeek, days: selectedDays });
  };

  return (
    <div
      className="p-6 rounded-lg space-y-6"
      style={{
        backgroundColor: '#F3F7FF',
        fontFamily: 'var(--font-family-text)',
      }}
    >
      <div className="text-lg font-semibold" style={{ color: colors.neutral[600] }}>
        Schedule Shop Closures
      </div>
      <div className="space-y-4">
        {/* Week Select at the top */}
        <Select
          options={weeks}
          value={selectedWeek}
          onChange={setSelectedWeek}
        />
        {/* DayPicker below the Week Select */}
        <DayPicker selectedDays={selectedDays} onDayChange={setSelectedDays} />
      </div>
      <div className="flex justify-end">
        <Button
          variant="primary"
          size="small"
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default ScheduleShopClosures;