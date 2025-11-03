'use client';

import React from 'react';
import colors from '@/styles/colors';

interface DayPickerProps {
  selectedDays: string[];
  onDayChange: (days: string[]) => void;
}

const DayPicker: React.FC<DayPickerProps> = ({ selectedDays, onDayChange }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      onDayChange(selectedDays.filter((d) => d !== day));
    } else {
      onDayChange([...selectedDays, day]);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-neutral-600 mb-2">Day</label>
      <div className="flex space-x-2">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => toggleDay(day)}
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1"
            style={{
              backgroundColor: selectedDays.includes(day)
                ? '#FFFFFF'
                : colors.neutral[100],
              color: colors.neutral[600],
              border: selectedDays.includes(day)
                ? `1px solid ${colors.neutral[150]}`
                : 'none',
            }}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DayPicker;