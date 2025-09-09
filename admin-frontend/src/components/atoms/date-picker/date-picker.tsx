"use client";

import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import colors from "@/styles/colors";

interface DatePickerProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  label?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateChange,
  label = "Select Date",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      onDateChange(value);
      setIsOpen(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Select a date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-full relative">
      <label className="block text-sm font-medium text-neutral-600 mb-2">
        {label}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 border border-neutral-150 rounded-md text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-200 text-left"
        style={{
          backgroundColor: "#FFFFFF",
        }}
      >
        {formatDate(selectedDate)}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 bg-white border border-neutral-150 rounded-md shadow-lg">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            className="react-calendar-custom"
          />
        </div>
      )}

      {/* Overlay to close calendar when clicking outside */}
      {isOpen && (
        <div className="fixed inset-0 z-5" onClick={() => setIsOpen(false)} />
      )}

      <style jsx global>{`
        .react-calendar-custom {
          border: none;
          font-family: inherit;
        }
        .react-calendar-custom__tile {
          padding: 0.5rem;
          border-radius: 0.25rem;
          transition: background-color 0.2s;
        }
        .react-calendar-custom__tile:hover {
          background-color: ${colors.neutral[100]};
        }
        .react-calendar-custom__tile--active {
          background-color: ${colors.primary[200]};
          color: white;
        }
        .react-calendar-custom__tile--active:hover {
          background-color: ${colors.primary[300]};
        }
        .react-calendar-custom__navigation {
          margin-bottom: 0.5rem;
        }
        .react-calendar-custom__navigation button {
          color: ${colors.neutral[600]};
          border-radius: 0.25rem;
          padding: 0.25rem 0.5rem;
        }
        .react-calendar-custom__navigation button:hover {
          background-color: ${colors.neutral[100]};
        }
        .react-calendar-custom__month-view__weekdays {
          font-weight: 600;
          color: ${colors.neutral[500]};
        }
      `}</style>
    </div>
  );
};

export default DatePicker;
