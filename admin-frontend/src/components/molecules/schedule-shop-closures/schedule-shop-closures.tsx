"use client";

import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@/styles/closure-calendar.css";
import { Calendar as CalendarIcon, Clock, Check, X, AlertCircle, Lock, Unlock } from "lucide-react";

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
  const [step, setStep] = useState(1);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [serviceAvailabilities, setServiceAvailabilities] = useState<{
    [serviceId: number]: boolean;
  }>({});
  const [isServiceMode, setIsServiceMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setIsSubmitting(true);
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
      // Reset form after successful save
      setSelectedDates([]);
      setStep(1);
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("An error occurred while saving. Please try again.");
    } finally {
      setIsSubmitting(false);
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

      // Defer the callback to avoid updating parent during render
      setTimeout(() => {
        onServiceAvailabilityChange?.(newAvailabilities);
      }, 0);

      return newAvailabilities;
    });
  };

  const isDateSelected = (date: Date) => {
    return selectedDates.some(
      (selectedDate) => selectedDate.toDateString() === date.toDateString()
    );
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const canProceedToNextStep = () => {
    if (step === 1) return true; // Can always proceed from mode selection
    if (step === 2) return selectedDates.length > 0;
    if (step === 3 && isServiceMode) return true;
    return false;
  };

  const hasClosedDatesInSelection = selectedDates.some(date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    return closedDates.has(dateKey);
  });

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    step >= num
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step > num ? <Check className="w-5 h-5" /> : num}
                </div>
                <span className="text-xs mt-2 text-gray-600 text-center">
                  {num === 1 && "Select Mode"}
                  {num === 2 && "Choose Dates"}
                  {num === 3 && isServiceMode ? "Configure Services" : "Review"}
                </span>
              </div>
              {num < 3 && (
                <div
                  className={`h-1 flex-1 transition-all duration-300 ${
                    step > num ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Mode Selection */}
      {step === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-blue-600">Choose Your Action</h2>
            <p className="text-gray-600">Select how you want to manage service availability</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Closure Mode Card */}
            <div
              onClick={() => {
                setIsServiceMode(false);
                onModeChange?.(true);
              }}
              className={`p-6 border-2 rounded-md cursor-pointer transition-all duration-300 ${
                !isServiceMode
                  ? "border-blue-600 bg-blue-50 shadow-lg scale-105"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  !isServiceMode ? "bg-blue-600" : "bg-gray-100"
                }`}>
                  <Lock className={`w-6 h-6 ${
                    !isServiceMode ? "text-white" : "text-gray-600"
                  }`} />
                </div>
                {!isServiceMode && (
                  <Check className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <h3 className="text-lg font-bold text-blue-600 mb-2">Complete Closure</h3>
              <p className="text-sm text-gray-600 mb-4">
                Close the entire service center for selected dates. All services will be unavailable.
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                Best for holidays or facility maintenance
              </div>
            </div>

            {/* Service Mode Card */}
            <div
              onClick={() => {
                setIsServiceMode(true);
                onModeChange?.(false);
              }}
              className={`p-6 border-2 rounded-md cursor-pointer transition-all duration-300 ${
                isServiceMode
                  ? "border-blue-600 bg-blue-50 shadow-lg scale-105"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isServiceMode ? "bg-blue-600" : "bg-gray-100"
                }`}>
                  <Unlock className={`w-6 h-6 ${
                    isServiceMode ? "text-white" : "text-gray-600"
                  }`} />
                </div>
                {isServiceMode && (
                  <Check className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <h3 className="text-lg font-bold text-blue-600 mb-2">Custom Availability</h3>
              <p className="text-sm text-gray-600 mb-4">
                Set availability for individual services. Keep some services open while others are unavailable.
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                Flexible control over service offerings
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Date Selection */}
      {step === 2 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-blue-600">Select Dates</h2>
            <p className="text-gray-600">
              {isServiceMode
                ? "Choose dates to modify service availability"
                : "Choose dates to close the service center"}
            </p>
          </div>

          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-700">Calendar</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Click dates to select/deselect • Today: {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              {selectedDates.length > 0 && (
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                  <CalendarIcon className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-600">
                    {selectedDates.length} date{selectedDates.length > 1 ? "s" : ""} selected
                  </span>
                </div>
              )}
            </div>

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

            {selectedDates.length > 0 && (
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-900 mb-2">
                      Selected Dates ({selectedDates.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedDates.map((date, index) => (
                        <div
                          key={index}
                          className="group relative px-3 py-1.5 bg-white rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-3 h-3 text-blue-600" />
                            <span className="text-xs font-medium text-gray-800">
                              {date.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                            <button
                              onClick={() => handleDateSelect(date)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3 text-red-500 hover:text-red-700" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-blue-700 mt-3">
                      {isServiceMode
                        ? "✨ These dates will have custom service availability"
                        : "🔒 These dates will be completely closed"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Service Configuration (only in service mode) */}
      {step === 3 && isServiceMode && (
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Configure Service Availability</h2>
            <p className="text-gray-600">
              Set which services will be available on the selected dates
            </p>
          </div>

          {hasClosedDatesInSelection ? (
            <div className="bg-red-50 border-2 border-red-300 rounded-md p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-900 mb-2">Services Locked</h3>
                  <p className="text-sm text-red-800 mb-4">
                    Some selected dates have closure schedules. You must remove the closures first before modifying individual service availability.
                  </p>
                  <div className="bg-white/60 rounded-lg p-4 border border-red-200">
                    <p className="text-xs font-semibold text-red-700 mb-3">Services (Locked)</p>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {availableServices.map((service) => (
                        <div
                          key={service.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg opacity-50"
                        >
                          <span className="text-sm font-medium text-gray-600">
                            {service.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-200 rounded">
                              Unavailable
                            </span>
                            <div className="w-11 h-6 bg-gray-300 rounded-full relative">
                              <div className="absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-700">Available Services</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Unavailable</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Toggle services to set availability. Green = Available, Red = Unavailable
                </p>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {availableServices.map((service) => {
                  const isAvailable = serviceAvailabilities[service.id] ?? true;
                  return (
                    <div
                      key={service.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                        isAvailable
                          ? "border-green-200 bg-green-50"
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isAvailable ? "bg-green-100" : "bg-red-100"
                        }`}>
                          {isAvailable ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : (
                            <X className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {service.name}
                          </p>
                          <p className={`text-xs font-medium ${
                            isAvailable ? "text-green-600" : "text-red-600"
                          }`}>
                            {isAvailable ? "Available for booking" : "Not available"}
                          </p>
                        </div>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isAvailable}
                          onChange={() => handleServiceAvailabilityToggle(service.id)}
                          className="sr-only peer"
                        />
                        <div className={`w-14 h-7 rounded-full peer transition-all duration-300 ${
                          isAvailable ? "bg-green-500" : "bg-red-500"
                        } peer-focus:ring-4 peer-focus:ring-${isAvailable ? "green" : "red"}-300`}>
                          <div className={`absolute top-0.5 left-0.5 bg-white border-2 border-gray-200 rounded-full h-6 w-6 transition-all duration-300 ${
                            isAvailable ? "translate-x-7" : "translate-x-0"
                          }`}></div>
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Review (closure mode) */}
      {step === 3 && !isServiceMode && (
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Review Closure</h2>
            <p className="text-gray-600">Confirm the dates you want to close</p>
          </div>

          <div className="bg-white border-2 border-blue-600 rounded-md p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-600 mb-2">Complete Closure Scheduled</h3>
                <p className="text-sm text-gray-800">
                  The service center will be completely closed on the following dates. All services will be unavailable.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <p className="text-xs font-semibold text-gray-700 mb-3">Affected Dates:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedDates.map((date, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 bg-blue-600 rounded-lg border border-blue-200"
                  >
                    <CalendarIcon className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">
                      {formatDisplayDate(date)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <button
          onClick={() => {
            if (step === 1) {
              setSelectedDates([]);
              setServiceAvailabilities({});
            } else {
              setStep(step - 1);
            }
          }}
          disabled={isSubmitting}
          className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {step === 1 ? "Reset" : "Previous"}
        </button>

        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceedToNextStep()}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            Next Step
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={isSubmitting || (isServiceMode && hasClosedDatesInSelection)}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                {isServiceMode ? "Update Availability" : "Confirm Closure"}
              </>
            )}
          </button>
        )}
      </div>

      

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ScheduleShopClosures;
