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
  closedDates?: Set<string>; // YYYY-MM-DD format
}

const ScheduleShopClosures: React.FC<ScheduleShopClosuresProps> = ({
  onSave,
  availableServices = [],
  onDatesSelected,
  onServiceAvailabilityChange,
  onModeChange,
  closedDates = new Set(),
}) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [serviceAvailabilities, setServiceAvailabilities] = useState<{
    [serviceId: number]: boolean;
  }>({});
  const [isServiceMode, setIsServiceMode] = useState(false);

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

      // Defer the callback to avoid updating parent during render
      setTimeout(() => {
        onServiceAvailabilityChange?.(resetAvailabilities);
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isServiceMode]);

  const handleSave = async () => {
    if (selectedDates.length === 0) {
      alert("Please select at least one date.");
      return;
    }

    try {
      if (isServiceMode) {
        // In service mode, pass the service availabilities
        const serviceAvailabilityData = availableServices.map((service) => ({
          id: service.id,
          isAvailable: serviceAvailabilities[service.id] ?? true, // Default to available
        }));
        await onSave(selectedDates, serviceAvailabilityData);
      } else {
        // In closure mode, pass empty array to indicate full closure
        await onSave(selectedDates, []);
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("An error occurred while saving. Please try again.");
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
            {selectedDates.some(date => {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              const dateKey = `${year}-${month}-${day}`;
              return closedDates.has(dateKey);
            }) ? (
              <div className="p-4 bg-red-50 rounded-md border-2 border-red-300">
                <div className="flex items-start text-red-700 mb-3">
                  <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold mb-1">Service Availability Locked</p>
                    <p className="text-xs">Some selected dates have closure schedules. You must remove the closures first before modifying individual service availability.</p>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-md border border-gray-300 opacity-60">
                  <div className="text-sm font-medium text-gray-500 mb-2">
                    Set Service Availability for Selected Dates
                  </div>
                  <div className="text-xs text-gray-400 mb-3">
                    Service toggles are disabled for dates with closures.
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availableServices.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between opacity-50"
                      >
                        <span className="text-sm text-gray-500 flex-1">
                          {service.name}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">
                            Unavailable
                          </span>
                          <label className="relative inline-flex items-center cursor-not-allowed">
                            <input
                              type="checkbox"
                              checked={false}
                              disabled
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
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
            )}
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
