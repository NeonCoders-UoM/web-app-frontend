"use client";

import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import colors from "@/styles/colors";
import Button from "@/components/atoms/button/button";

interface ServiceOption {
  id: number;
  name: string;
  selected: boolean;
  isAvailable?: boolean;
}

interface ScheduleShopClosuresProps {
  onSave: (
    dates: Date[],
    serviceData: { id: number; isAvailable: boolean }[]
  ) => void;
  availableServices?: ServiceOption[];
  onDatesSelected?: (dates: Date[]) => void;
  onServiceAvailabilityChange?: (serviceAvailabilities: {
    [serviceId: number]: boolean;
  }) => void;
  onModeChange?: (isClosureMode: boolean) => void;
}

const ScheduleShopClosures: React.FC<ScheduleShopClosuresProps> = ({
  onSave,
  availableServices = [],
  onDatesSelected,
  onServiceAvailabilityChange,
  onModeChange,
}) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [serviceAvailabilities, setServiceAvailabilities] = useState<{
    [serviceId: number]: boolean;
  }>({});
  const [isServiceMode, setIsServiceMode] = useState(false);

  // Initialize service availabilities when availableServices changes
  useEffect(() => {
    if (availableServices.length > 0) {
      const initialAvailabilities: { [serviceId: number]: boolean } = {};
      availableServices.forEach((service) => {
        // Always start with services as available by default for modify mode
        initialAvailabilities[service.id] = true;
      });
      setServiceAvailabilities(initialAvailabilities);
    }
  }, [availableServices]);

  // Reset service availabilities when switching to service mode
  useEffect(() => {
    if (isServiceMode && availableServices.length > 0) {
      const resetAvailabilities: { [serviceId: number]: boolean } = {};
      availableServices.forEach((service) => {
        // All services are available by default in service mode
        resetAvailabilities[service.id] = true;
      });
      setServiceAvailabilities(resetAvailabilities);
      console.log("Reset all services to available for service mode");

      // Notify parent component of the reset
      onServiceAvailabilityChange?.(resetAvailabilities);
    }
  }, [isServiceMode, availableServices, onServiceAvailabilityChange]);

  const handleSave = () => {
    if (selectedDates.length === 0) {
      alert("Please select at least one date.");
      return;
    }

    if (isServiceMode) {
      // In service mode, pass the service availabilities
      const serviceAvailabilityData = availableServices.map((service) => ({
        id: service.id,
        isAvailable: serviceAvailabilities[service.id] ?? true, // Default to available
      }));
      onSave(selectedDates, serviceAvailabilityData);
    } else {
      // In closure mode, pass empty array to indicate full closure
      onSave(selectedDates, []);
    }
  };

  const handleDateSelect = (value: unknown) => {
    if (value instanceof Date) {
      if (
        selectedDates.some(
          (selectedDate) => selectedDate.toDateString() === value.toDateString()
        )
      ) {
        // Remove date if already selected
        const newDates = selectedDates.filter(
          (selectedDate) => selectedDate.toDateString() !== value.toDateString()
        );
        setSelectedDates(newDates);
        onDatesSelected?.(newDates);
        console.log("Date deselected, new dates:", newDates);
      } else {
        // Add date if not selected
        const newDates = [...selectedDates, value];
        setSelectedDates(newDates);
        onDatesSelected?.(newDates);
        console.log("Date selected, new dates:", newDates);
      }
    }
  };

  const handleServiceAvailabilityToggle = (serviceId: number) => {
    console.log("Toggling service", serviceId);
    setServiceAvailabilities((prev) => {
      const currentValue = prev[serviceId] ?? true;
      const newValue = !currentValue;
      const newAvailabilities = {
        ...prev,
        [serviceId]: newValue,
      };

      console.log(`Service ${serviceId}: ${currentValue} -> ${newValue}`);
      console.log("New availabilities:", newAvailabilities);

      // Notify parent component of the change
      onServiceAvailabilityChange?.(newAvailabilities);

      return newAvailabilities;
    });
  };

  const isDateSelected = (date: Date) => {
    return selectedDates.some(
      (selectedDate) => selectedDate.toDateString() === date.toDateString()
    );
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
        Schedule Service Availability
      </div>

      {/* Mode Selection */}
      <div className="space-y-2">
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="mode"
              checked={!isServiceMode}
              onChange={() => {
                setIsServiceMode(false);
                onModeChange?.(true); // true for closure mode
              }}
              className="mr-2"
            />
            <span className="text-sm text-neutral-600">
              Close Entire Service Center (Only Selected Dates)
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="mode"
              checked={isServiceMode}
              onChange={() => {
                setIsServiceMode(true);
                onModeChange?.(false); // false for service mode
              }}
              className="mr-2"
            />
            <span className="text-sm text-neutral-600">
              Set Individual Service Availability (For Selected Dates)
            </span>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="p-3 bg-white rounded-md border border-neutral-150">
            <div className="text-sm font-medium text-neutral-600">
              Select Dates to Modify
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              Today:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
          <p className="text-xs text-neutral-500">
            Click on dates in the calendar to select/deselect dates. Only
            selected dates will be affected by your changes.
          </p>
        </div>

        {/* Service Selection (only show in service mode) */}
        {isServiceMode && availableServices.length > 0 && (
          <div className="space-y-2">
            <div className="p-3 bg-white rounded-md border border-neutral-150">
              <div className="text-sm font-medium text-neutral-600 mb-2">
                Set Service Availability for Selected Dates
              </div>
              <div className="text-xs text-neutral-500 mb-3">
                All services are available by default. Toggle switches to make
                services unavailable for selected dates.
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-neutral-600 flex-1">
                      {service.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-neutral-500">
                        {serviceAvailabilities[service.id] ?? true
                          ? "Available"
                          : "Unavailable"}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={serviceAvailabilities[service.id] ?? true}
                          onChange={() =>
                            handleServiceAvailabilityToggle(service.id)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Date Selection Calendar */}
        <div className="space-y-2">
          <div className="bg-white p-4 rounded-md border border-neutral-150">
            <Calendar
              onChange={handleDateSelect}
              value={null}
              tileClassName={({ date, view }) => {
                if (view === "month" && isDateSelected(date)) {
                  return "selected-date";
                }
                return null;
              }}
              minDate={new Date()}
            />
          </div>
          {selectedDates.length > 0 && (
            <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-xs text-blue-700 mb-2 font-medium">
                Selected dates ({selectedDates.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedDates.map((date, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium"
                  >
                    {date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                ))}
              </div>
              <p className="text-xs text-blue-600 mt-2">
                {isServiceMode
                  ? "These dates will have their service availability modified."
                  : "These dates will be closed (all services unavailable)."}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="primary" size="small" onClick={handleSave}>
          {isServiceMode
            ? "Update Service Availability"
            : "Close Service Center"}
        </Button>
      </div>
    </div>
  );
};

export default ScheduleShopClosures;
