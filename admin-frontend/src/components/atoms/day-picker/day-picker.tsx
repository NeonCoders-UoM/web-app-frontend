import React from 'react';

interface DayPickerProps {
  selectedDays: string[]; 
  onDayChange: (days: string[]) => void; 
}

const DayPicker: React.FC<DayPickerProps> = ({ selectedDays, onDayChange }) => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      
      onDayChange(selectedDays.filter((d) => d !== day));
    } else {
      
      onDayChange([...selectedDays, day]);
    }
  };

  return (
    <div className="w-full">
      {/* Label */}
      <label className="block text-sm font-medium text-neutral-600 mb-2">Day</label>

      {/* Day Buttons */}
      <div className="flex space-x-2">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            onClick={() => toggleDay(day)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md border transition-colors ${
              selectedDays.includes(day)
                ? 'bg-primary-100 text-primary-300 border-primary-200'
                : 'bg-neutral-100 text-neutral-600 border-neutral-300 hover:bg-neutral-150'
            }`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DayPicker;