"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Table } from "@/components/organism/closure-schedule-table/closure-schedule-table";
import ScheduleShopClosures from "@/components/molecules/schedule-shop-closures/schedule-shop-closures";
import ShiftCard from "@/components/atoms/shiftcard/shiftcard";
import ServiceAvailabilityTable from "@/components/organism/service-availability-table/service-availability-table";
import {
  addClosureSchedule,
  getClosures,
  fetchServiceCenters,
  fetchServiceCenterServices,
  toggleServiceCenterServiceAvailability,
} from "@/utils/api";
import { ServiceCenter, ServiceCenterServiceDTO } from "@/types";

const ManageServices = () => {
  const searchParams = useSearchParams();
  const queryServiceCenterId = searchParams.get("serviceCenterId");

  const [shiftCards, setShiftCards] = useState<
    { day: string; status: string }[]
  >([]);
  const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>([]);
  const [currentServiceCenterId, setCurrentServiceCenterId] = useState<
    number | null
  >(null);
  const [currentWeek, setCurrentWeek] = useState<number>(() => {
    // Get current week number
    const now = new Date();
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedServiceCenter, setSelectedServiceCenter] =
    useState<ServiceCenter | null>(null);
  const [serviceCenterServices, setServiceCenterServices] = useState<
    ServiceCenterServiceDTO[]
  >([]);
  const [allWeeks, setAllWeeks] = useState<string[]>([]);

  // Generate all weeks for the current year
  const generateAllWeeks = () => {
    const weeks: string[] = [];
    const currentYear = new Date().getFullYear();

    // Generate weeks for the entire year (52 weeks)
    for (let week = 1; week <= 52; week++) {
      const startDate = new Date(currentYear, 0, 1 + (week - 1) * 7);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      const startMonth = startDate.toLocaleDateString("en-US", {
        month: "short",
      });
      const endMonth = endDate.toLocaleDateString("en-US", { month: "short" });
      const startDay = startDate.getDate();
      const endDay = endDate.getDate();

      let weekLabel = `Week ${week}`;
      if (startMonth === endMonth) {
        weekLabel += ` (${startMonth} ${startDay}-${endDay})`;
      } else {
        weekLabel += ` (${startMonth} ${startDay}-${endMonth} ${endDay})`;
      }

      weeks.push(weekLabel);
    }

    return weeks;
  };

  // Get current user role and determine service center access
  const getUserRole = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userRole");
    }
    return null;
  };

  // Load service centers and determine which one to use
  useEffect(() => {
    const loadServiceCenters = async () => {
      try {
        const centers = await fetchServiceCenters();
        setServiceCenters(centers);

        // Generate all weeks
        const weeks = generateAllWeeks();
        setAllWeeks(weeks);

        // If queryServiceCenterId is provided, use that specific service center
        if (queryServiceCenterId) {
          const targetCenter = centers.find(
            (center) =>
              center.id === queryServiceCenterId ||
              center.Station_id?.toString() === queryServiceCenterId
          );
          if (targetCenter) {
            const serviceCenterId =
              targetCenter.Station_id || parseInt(targetCenter.id);
            setCurrentServiceCenterId(serviceCenterId);
            setSelectedServiceCenter(targetCenter);
          } else {
            // If the specified service center is not found, use the first one
            const firstCenter = centers[0];
            const serviceCenterId =
              firstCenter.Station_id || parseInt(firstCenter.id);
            setCurrentServiceCenterId(serviceCenterId);
            setSelectedServiceCenter(firstCenter);
          }
        } else if (centers.length > 0) {
          // Use the first service center as default
          const firstCenter = centers[0];
          const serviceCenterId =
            firstCenter.Station_id || parseInt(firstCenter.id);
          setCurrentServiceCenterId(serviceCenterId);
          setSelectedServiceCenter(firstCenter);
        } else {
          // No service centers available
          setCurrentServiceCenterId(null);
          setSelectedServiceCenter(null);
        }
      } catch (error) {
        console.error("Error loading service centers:", error);
        // Don't set a fallback ID - let the user see the error state
        setCurrentServiceCenterId(null);
        setSelectedServiceCenter(null);
      }
    };

    loadServiceCenters();
  }, []);

  // Load service center services when service center changes
  useEffect(() => {
    const loadServiceCenterServices = async () => {
      if (currentServiceCenterId === null) return;

      try {
        const services = await fetchServiceCenterServices(
          currentServiceCenterId.toString()
        );
        setServiceCenterServices(services);
      } catch (error) {
        console.error("Error loading service center services:", error);
        setServiceCenterServices([]);
      }
    };

    loadServiceCenterServices();
  }, [currentServiceCenterId]);

  // Load closures for the current service center and week
  useEffect(() => {
    const loadClosures = async () => {
      if (currentServiceCenterId === null) return;

      try {
        setIsLoading(true);
        console.log(`Loading closures for service center ${currentServiceCenterId}, week ${currentWeek}`);
        
        const closuresData = await getClosures(
          currentServiceCenterId,
          currentWeek
        );

        console.log("Closures loaded from database:", closuresData);

        // Transform closures to shift cards
        const transformedShiftCards = closuresData.map((closure) => ({
          day: closure.day,
          status: "Closed",
        }));
        setShiftCards(transformedShiftCards);
        
        console.log("Shift cards updated:", transformedShiftCards);
      } catch (error) {
        console.error("Error loading closures:", error);
        // Keep existing shift cards if loading fails
      } finally {
        setIsLoading(false);
      }
    };

    loadClosures();
  }, [currentServiceCenterId, currentWeek]);

  const handleServiceCenterChange = (serviceCenterId: number) => {
    console.log("Changing service center to:", serviceCenterId);
    setCurrentServiceCenterId(serviceCenterId);
    const center = serviceCenters.find(
      (sc) => (sc.Station_id || parseInt(sc.id)) === serviceCenterId
    );
    setSelectedServiceCenter(center || null);

    // Clear existing closures when switching service centers
    setShiftCards([]);
  };

  const handleWeekChange = (newWeek: number) => {
    console.log("Changing week to:", newWeek);
    setCurrentWeek(newWeek);
    // Clear existing closures when switching weeks - they will be reloaded by useEffect
    setShiftCards([]);
  };

  const handleSave = async (week: string, days: string[]) => {
    if (days.length === 0) {
      alert("Please select at least one day to schedule closure.");
      return;
    }

    if (currentServiceCenterId === null) {
      alert("Please select a service center first.");
      return;
    }

    try {
      // Extract week number from the week string (e.g., "Week 12 (Jan 1-7)" -> 12)
      const weekMatch = week.match(/Week (\d+)/);
      const weekNumber = weekMatch ? parseInt(weekMatch[1]) : currentWeek;

      console.log(
        `Adding closures for service center ${currentServiceCenterId}, week ${weekNumber}, days:`,
        days
      );

      // Add closures for each selected day
      for (const day of days) {
        try {
          await addClosureSchedule({
            serviceCenterId: currentServiceCenterId,
            weekNumber: weekNumber,
            day: day,
          });
        } catch (error) {
          console.error(`Error adding closure for ${day}:`, error);
          // Continue with other days even if one fails
        }
      }

      // Reload closures from database to ensure UI reflects actual data
      try {
        const updatedClosures = await getClosures(currentServiceCenterId, weekNumber);
        const transformedShiftCards = updatedClosures.map((closure) => ({
          day: closure.day,
          status: "Closed",
        }));
        setShiftCards(transformedShiftCards);
        console.log("Closures reloaded from database:", updatedClosures);
      } catch (error) {
        console.error("Error reloading closures:", error);
        // Fallback to manual update if reload fails
        const newShiftCards = days.map((day) => ({
          day: `${day} (Week ${weekNumber})`,
          status: "Closed",
        }));
        setShiftCards((prev) => [...prev, ...newShiftCards]);
      }

      console.log("Closures added successfully");
      alert(
        `Successfully scheduled ${days.length} closure(s) for ${selectedServiceCenter?.serviceCenterName}`
      );
    } catch (error) {
      console.error("Error saving closures:", error);
      alert("Failed to save closures. Please try again.");
    }
  };

  const handleServiceAvailabilityToggle = async (serviceId: string, currentAvailability: boolean) => {
    if (currentServiceCenterId === null) {
      alert("Please select a service center first.");
      return;
    }

    try {
      const newAvailability = !currentAvailability;
      
      console.log(
        `Toggling service ${serviceId} availability for service center ${currentServiceCenterId}`
      );
      console.log(`Making PATCH request to toggle availability`);

      // Update the backend and get the updated list
      const updatedServices = await toggleServiceCenterServiceAvailability(
        currentServiceCenterId.toString(),
        serviceId, // This is actually the serviceCenterServiceId from the table
        newAvailability
      );
      setServiceCenterServices(updatedServices);

      console.log("Service availability updated successfully");
      alert(
        `Service availability ${newAvailability ? "enabled" : "disabled"} successfully`
      );
    } catch (error: any) {
      console.error("Error updating service availability:", error);
      console.error("Full error details:", error.response?.data || error.message);
      alert("Failed to update service availability. Please try again.");
    }
  };

  // Transform service center services to table data
  const tableData = serviceCenterServices.map((service) => ({
    id: service.serviceCenterServiceId.toString(),
    label: service.serviceName || "Unknown Service",
    checked: service.isAvailable,
    price: service.customPrice || service.serviceBasePrice || 0,
    category: service.category || "General",
    description: service.serviceDescription || "No description available",
  }));

  if (isLoading) {
    return (
      <div
        className="p-6 space-y-6"
        style={{ backgroundColor: "#FFFFFF", minHeight: "100vh" }}
      >
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Show error state if no service centers are available
  if (serviceCenters.length === 0) {
    return (
      <div
        className="p-6 space-y-6"
        style={{ backgroundColor: "#FFFFFF", minHeight: "100vh" }}
      >
        <h1 className="h2 text-neutral-600">Service Center Closure Schedule</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            No Service Centers Available
          </h3>
          <p className="text-red-700 text-sm">
            No service centers were found. Please ensure service centers are
            properly configured in the system.
          </p>
        </div>
      </div>
    );
  }

  // Show error state if no service center is selected
  if (currentServiceCenterId === null) {
    return (
      <div
        className="p-6 space-y-6"
        style={{ backgroundColor: "#FFFFFF", minHeight: "100vh" }}
      >
        <h1 className="h2 text-neutral-600">Service Center Closure Schedule</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <div className="text-yellow-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            No Service Center Selected
          </h3>
          <p className="text-yellow-700 text-sm">
            Please select a service center to manage closure schedules.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-6 space-y-6"
      style={{
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
      }}
    >
      {/* Page Heading */}
      <h1 className="h2 text-neutral-600">Service Center Closure Schedule</h1>

      {/* Business Context */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          About Closure Scheduling
        </h3>
        <p className="text-blue-700 text-sm">
          Use this tool to schedule when your service center will be closed.
          This information helps customers know when you&apos;re not available
          for appointments and services. Scheduled closures will be visible to
          customers when they try to book appointments.
        </p>
      </div>

      {/* Service Center and Week Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Service Center Selection (for super admin) */}
        {getUserRole() === "super-admin" && serviceCenters.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Select Service Center
            </label>
            <select
              value={currentServiceCenterId || ""}
              onChange={(e) =>
                handleServiceCenterChange(parseInt(e.target.value))
              }
              className="w-full p-2 border border-neutral-150 rounded-md text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-200"
            >
              {serviceCenters.map((center) => (
                <option
                  key={center.id}
                  value={center.Station_id || parseInt(center.id)}
                >
                  {center.serviceCenterName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Week Selection */}
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">
            Select Week to View Closures
          </label>
          <select
            value={currentWeek}
            onChange={(e) => handleWeekChange(parseInt(e.target.value))}
            className="w-full p-2 border border-neutral-150 rounded-md text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            {allWeeks.map((week, index) => (
              <option key={index + 1} value={index + 1}>
                {week}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Current Service Center Info */}
      {selectedServiceCenter && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Managing Closures for: {selectedServiceCenter.serviceCenterName}
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-green-700">
            <div>
              <span className="font-medium">Service Center ID:</span>{" "}
              {currentServiceCenterId}
            </div>
            <div>
              <span className="font-medium">Address:</span>{" "}
              {selectedServiceCenter.address}
            </div>
            <div>
              <span className="font-medium">Phone:</span>{" "}
              {selectedServiceCenter.telephoneNumber}
            </div>
            <div>
              <span className="font-medium">Email:</span>{" "}
              {selectedServiceCenter.email}
            </div>
            <div>
              <span className="font-medium">Status:</span>
              <span
                className={`ml-1 px-2 py-1 rounded text-xs ${
                  selectedServiceCenter.Station_status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {selectedServiceCenter.Station_status || "Active"}
              </span>
            </div>
            <div>
              <span className="font-medium">Available Services:</span>{" "}
              {serviceCenterServices.filter(service => service.isAvailable).length} / {serviceCenterServices.length}
            </div>
            <div>
              <span className="font-medium">Viewing Week:</span>{" "}
              {allWeeks[currentWeek - 1] || `Week ${currentWeek}`}
            </div>
          </div>
        </div>
      )}

      {/* Top Section: ScheduleShopClosures (Left) and ShiftCards (Right) */}
      <div className="flex space-x-4">
        {/* Schedule Shop Closures Section (Left) */}
        <div className="flex-1">
          <ScheduleShopClosures onSave={handleSave} allWeeks={allWeeks} currentWeek={currentWeek} />
        </div>

        {/* Closure Schedule Section (Right) */}
        <div className="space-y-2">
          <div className="text-lg font-semibold text-neutral-600">
            Scheduled Closures for {allWeeks[currentWeek - 1] || `Week ${currentWeek}`}
          </div>
          <div className="text-sm text-neutral-500 mb-3">
            These closures will be visible to customers
          </div>
          <div
            className="p-4 rounded-lg space-y-2"
            style={{
              backgroundColor: "#F3F7FF",
            }}
          >
            {shiftCards.length > 0 ? (
              shiftCards.map((shift, index) => (
                <ShiftCard key={index} day={shift.day} status={shift.status} />
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <svg
                    className="w-12 h-12 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-neutral-500">
                  No closures scheduled for this week
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  Service center is open for all days
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Impact Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-md font-semibold text-yellow-800 mb-2">
          Customer Impact
        </h4>
        <p className="text-yellow-700 text-sm">
          When you schedule closures, customers will see these dates as
          unavailable when booking appointments. This helps prevent booking
          conflicts and improves customer experience by setting clear
          expectations about your service center&apos;s availability.
        </p>
      </div>

      {/* Week Selection Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-md font-semibold text-blue-800 mb-2">
          Week Selection
        </h4>
        <p className="text-blue-700 text-sm">
          Use the week selector above to view closures for different weeks. 
          Closures are saved per week, so make sure to select the correct week 
          to see your scheduled closures. The current week is selected by default.
        </p>
      </div>

      {/* Service Availability Impact Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
        <h4 className="text-md font-semibold text-green-800 mb-2">
          Service Availability Impact
        </h4>
        <p className="text-green-700 text-sm">
          When you disable a service, it will no longer appear in the service list 
          for customers booking appointments. This helps manage which services are 
          currently offered by the service center. Re-enable services when they 
          become available again.
        </p>
      </div>

      {/* Services Table */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-neutral-600 mb-4">
          Service Availability Management for {selectedServiceCenter?.serviceCenterName}
        </h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            About Service Availability
          </h3>
          <p className="text-blue-700 text-sm">
            Toggle the availability of services for this service center. When a service is disabled, 
            it will not appear in the service list for customers booking appointments. This helps 
            manage which services are currently offered by the service center.
          </p>
          <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded">
            <p className="text-yellow-800 text-xs">
              <strong>Note:</strong> Backend support for service availability updates may not be fully implemented yet. 
              UI changes will be reflected immediately, but backend persistence depends on API support.
            </p>
          </div>
        </div>
        {serviceCenterServices.length > 0 ? (
          <ServiceAvailabilityTable 
            data={tableData} 
            onToggle={handleServiceAvailabilityToggle}
          />
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-gray-400 mb-2">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500">
              No services configured for this service center
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Services will appear here once they are added to the service
              center
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageServices;
