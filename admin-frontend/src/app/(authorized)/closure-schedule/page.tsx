"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ScheduleShopClosures from "@/components/molecules/schedule-shop-closures/schedule-shop-closures";
import ShiftCard from "@/components/atoms/shiftcard/shiftcard";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import {
  addClosureSchedule,
  getClosures,
  fetchServiceCenters,
  fetchServiceCenterServices,
  toggleServiceAvailabilityForDay,
  getServiceAvailabilities,
  deleteClosureSchedule,
} from "@/utils/api";

export const dynamic = "force-dynamic";
import {
  ClosureSchedule,
  ServiceCenter,
  ServiceCenterServiceDTO,
  ServiceAvailabilityDTO,
} from "@/types";
import { getAuthUser } from "@/utils/auth";

interface ServiceAvailabilityData {
  id: number;
  isAvailable: boolean;
}

interface DateServiceAvailability {
  date: Date;
  services: Array<{
    serviceId: number;
    serviceName: string;
    isAvailable: boolean;
  }>;
}

const ManageServices = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryServiceCenterId =
    searchParams.get("serviceCenterId") || searchParams.get("stationId");

  const [shiftCards, setShiftCards] = useState<
    { id: number; date: string; status: string; day?: string }[]
  >([]);
  const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>([]);
  const [currentServiceCenterId, setCurrentServiceCenterId] = useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedServiceCenter, setSelectedServiceCenter] =
    useState<ServiceCenter | null>(null);
  const [serviceCenterServices, setServiceCenterServices] = useState<
    ServiceCenterServiceDTO[]
  >([]);
  const [dateServiceAvailabilities, setDateServiceAvailabilities] = useState<
    DateServiceAvailability[]
  >([]);
  const [isLoadingAvailabilities, setIsLoadingAvailabilities] = useState(false);
  const [modifiedServiceAvailabilities, setModifiedServiceAvailabilities] =
    useState<{ [dateKey: string]: { [serviceId: number]: boolean } }>({});
  const [selectedDatesForPreview, setSelectedDatesForPreview] = useState<
    Date[]
  >([]);
  const [isClosureMode, setIsClosureMode] = useState(true);
  const [closedDatesSet, setClosedDatesSet] = useState<Set<string>>(new Set());

  // Normalize date to YYYY-MM-DD using local timezone
  const normalizeDateString = (date: Date | string): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  // Format date for display (expects YYYY-MM-DD string)
  const formatDisplayDate = (date: string): string => {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Fetch service availabilities for selected dates
  const fetchDateServiceAvailabilities = async (dates: Date[]) => {
    if (!currentServiceCenterId || dates.length === 0) {
      setDateServiceAvailabilities([]);
      setSelectedDatesForPreview([]);
      return;
    }

    setSelectedDatesForPreview(dates);
    try {
      setIsLoadingAvailabilities(true);

      // Fetch closures for selected dates
      const allClosures: ClosureSchedule[] = [];
      for (const date of dates) {
        const closures = await getClosures(currentServiceCenterId, date);
        allClosures.push(...closures);
      }

      const closedDates = new Set(
        allClosures
          .filter(
            (closure) =>
              closure.closureDate && typeof closure.closureDate === "string"
          )
          .map((closure) => normalizeDateString(closure.closureDate))
      );
      
      // Update closed dates state for child component
      setClosedDatesSet(closedDates);

      // Fetch service availabilities
      const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
      const startDate = normalizeDateString(sortedDates[0]);
      const endDate = normalizeDateString(sortedDates[sortedDates.length - 1]);
      const actualAvailabilities = await getServiceAvailabilities(
        currentServiceCenterId,
        startDate,
        endDate
      );

      // Create availability map
      const availabilityMap = new Map<string, Map<number, boolean>>();
      actualAvailabilities.forEach((availability) => {
        const dateKey = normalizeDateString(availability.date);
        if (!availabilityMap.has(dateKey)) {
          availabilityMap.set(dateKey, new Map<number, boolean>());
        }
        availabilityMap
          .get(dateKey)!
          .set(availability.serviceId, availability.isAvailable);
      });

      // Build availabilities
      const defaultAvailabilities: DateServiceAvailability[] = [];
      for (const date of dates) {
        const dateString = normalizeDateString(date);
        const isDateClosed = closedDates.has(dateString);

        const defaultServices = serviceCenterServices.map((service) => {
          const dateAvailabilityMap = availabilityMap.get(dateString);
          const actualAvailability = dateAvailabilityMap?.get(service.serviceId);
          return {
            serviceId: service.serviceId,
            serviceName: service.serviceName || "Unknown Service",
            isAvailable: isDateClosed
              ? false
              : actualAvailability !== undefined
              ? actualAvailability
              : service.isAvailable,
          };
        });

        defaultAvailabilities.push({
          date: new Date(date),
          services: defaultServices,
        });
      }

      setDateServiceAvailabilities(defaultAvailabilities);
    } catch (error) {
      console.error("Error setting up default availabilities:", error);
      setDateServiceAvailabilities([]);
    } finally {
      setIsLoadingAvailabilities(false);
    }
  };

  // Handle mode changes
  const handleModeChange = (isClosureModeParam: boolean) => {
    setIsClosureMode(isClosureModeParam);
    if (isClosureModeParam) {
      setModifiedServiceAvailabilities({});
    }
    if (selectedDatesForPreview.length > 0) {
      fetchDateServiceAvailabilities(selectedDatesForPreview);
    }
  };

  // Handle service availability changes
  const handleServiceAvailabilityChange = useCallback((serviceAvailabilities: {
    [serviceId: number]: boolean;
  }) => {
    // Check if any selected dates are closed using the state we already have
    const closedSelectedDates = selectedDatesForPreview.filter(date => {
      const dateKey = normalizeDateString(date);
      return closedDatesSet.has(dateKey);
    });

    if (closedSelectedDates.length > 0) {
      alert(
        `Cannot modify service availability for closed dates: ${closedSelectedDates
          .map((d) => formatDisplayDate(normalizeDateString(d)))
          .join(", ")}. Please remove closures first.`
      );
      return;
    }

    setModifiedServiceAvailabilities(prev => {
      const updatedAvailabilities = { ...prev };
      selectedDatesForPreview.forEach((date) => {
        const dateKey = normalizeDateString(date);
        updatedAvailabilities[dateKey] = { ...serviceAvailabilities };
      });
      return updatedAvailabilities;
    });

    setDateServiceAvailabilities(prevAvailabilities => {
      return prevAvailabilities.map((dateAvailability) => {
        const dateKey = normalizeDateString(dateAvailability.date);
        const modifiedServices = serviceAvailabilities;
        return {
          ...dateAvailability,
          services: dateAvailability.services.map((service) => ({
            ...service,
            isAvailable:
              modifiedServices[service.serviceId] ?? service.isAvailable,
          })),
        };
      });
    });
  }, [selectedDatesForPreview, closedDatesSet]);

  // Calculate week number
  const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const currentWeek = getWeekNumber(new Date());

  const getUserRole = () => {
    const user = getAuthUser();
    return user?.userRole || null;
  };

  // Load service centers
  useEffect(() => {
    const loadServiceCenters = async () => {
      try {
        const centers = await fetchServiceCenters();
        setServiceCenters(centers);

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
            const firstCenter = centers[0];
            const serviceCenterId =
              firstCenter.Station_id || parseInt(firstCenter.id);
            setCurrentServiceCenterId(serviceCenterId);
            setSelectedServiceCenter(firstCenter);
          }
        } else if (centers.length > 0) {
          const firstCenter = centers[0];
          const serviceCenterId =
            firstCenter.Station_id || parseInt(firstCenter.id);
          setCurrentServiceCenterId(serviceCenterId);
          setSelectedServiceCenter(firstCenter);
        } else {
          setCurrentServiceCenterId(null);
          setSelectedServiceCenter(null);
        }
      } catch (error) {
        console.error("Error loading service centers:", error);
        setCurrentServiceCenterId(null);
        setSelectedServiceCenter(null);
      }
    };

    loadServiceCenters();
  }, [queryServiceCenterId]);

  // Load service center services
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

  // Clear availabilities when service center changes
  useEffect(() => {
    setDateServiceAvailabilities([]);
    setIsLoadingAvailabilities(false);
  }, [currentServiceCenterId]);

  // Load closures for the current week
  useEffect(() => {
    const loadClosures = async () => {
      if (currentServiceCenterId === null) return;

      try {
        setIsLoading(true);
        const allClosures: ClosureSchedule[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day

        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          try {
            const dayClosures = await getClosures(currentServiceCenterId, date);
            allClosures.push(...dayClosures);
          } catch (error) {
            console.warn(
              `Failed to load closures for ${date.toDateString()}:`,
              error
            );
          }
        }

        const transformedShiftCards = allClosures
          .filter(
            (closure) =>
              closure.closureDate && typeof closure.closureDate === "string"
          )
          .map((closure) => {
            const dateString = normalizeDateString(closure.closureDate);
            const [year, month, day] = dateString.split("-").map(Number);
            const closureDate = new Date(year, month - 1, day);
            return {
              id: closure.id,
              date: dateString,
              status: "Closed",
              day: closureDate.toLocaleDateString("en-US", {
                weekday: "short",
              }),
            };
          });

        setShiftCards(transformedShiftCards);
      } catch (error) {
        console.error("Error loading closures:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClosures();
  }, [currentServiceCenterId]);

  const handleDeleteClosure = async (closureId: number, date: string) => {
    if (!confirm(`Are you sure you want to delete the closure for ${formatDisplayDate(date)}?`)) {
      return;
    }

    try {
      await deleteClosureSchedule(closureId);
      
      // Remove the closure from local state
      setShiftCards(prevCards => prevCards.filter(card => card.id !== closureId));
      
      // Refresh the availabilities if dates are selected
      if (selectedDatesForPreview.length > 0) {
        await fetchDateServiceAvailabilities(selectedDatesForPreview);
      }
      
      alert("Closure deleted successfully");
    } catch (error) {
      console.error("Error deleting closure:", error);
      alert("Failed to delete closure. Please try again.");
    }
  };

  const handleServiceCenterChange = (serviceCenterId: number) => {
    setCurrentServiceCenterId(serviceCenterId);
    const center = serviceCenters.find(
      (sc) => (sc.Station_id || parseInt(sc.id)) === serviceCenterId
    );
    setSelectedServiceCenter(center || null);
    const params = new URLSearchParams(window.location.search);
    params.set("serviceCenterId", serviceCenterId.toString());
    router.push(`?${params.toString()}`);
    setShiftCards([]);
  };

  const handleSave = async (
    dates: Date[],
    serviceData: ServiceAvailabilityData[]
  ) => {
    if (currentServiceCenterId === null) {
      alert("Please select a service center first.");
      return;
    }

    if (dates.length === 0) {
      alert("Please select at least one date.");
      return;
    }

    try {
      if (serviceData.length > 0) {
        const closedDates = new Set(
          (
            await Promise.all(
              dates.map(async (date) => {
                const closures = await getClosures(currentServiceCenterId, date);
                return closures.length > 0 ? normalizeDateString(date) : null;
              })
            )
          ).filter((d): d is string => d !== null)
        );

        if (closedDates.size > 0) {
          alert(
            `Cannot set service availability for closed dates: ${Array.from(
              closedDates
            )
              .map((d) => formatDisplayDate(d))
              .join(", ")}. Please remove closures first.`
          );
          return;
        }

        for (const date of dates) {
          for (const service of serviceData) {
            try {
              await toggleServiceAvailabilityForDay(
                currentServiceCenterId,
                service.id,
                date,
                service.isAvailable
              );
            } catch (error) {
              console.error(
                `Error updating service ${
                  service.id
                } availability for ${date.toDateString()}:`,
                error
              );
            }
          }
        }

        const availableCount = serviceData.filter((s) => s.isAvailable).length;
        const unavailableCount = serviceData.filter(
          (s) => !s.isAvailable
        ).length;

        alert(
          `Successfully updated availability: ${availableCount} available, ${unavailableCount} unavailable on ${dates.length} date(s)`
        );

        await fetchDateServiceAvailabilities(dates);
        setModifiedServiceAvailabilities({});
        setSelectedDatesForPreview([]);
      } else {
        let totalClosuresCreated = 0;
        const failedDates: string[] = [];

        for (const date of dates) {
          try {
            const dateString = normalizeDateString(date);
            await addClosureSchedule({
              serviceCenterId: currentServiceCenterId,
              closureDate: dateString,
            });
            totalClosuresCreated++;
          } catch (error) {
            console.error(
              `Error adding closure for ${date.toDateString()}:`,
              error
            );
            failedDates.push(formatDisplayDate(normalizeDateString(date)));
          }
        }

        try {
          const allUpdatedClosures: ClosureSchedule[] = [];
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dayClosures = await getClosures(currentServiceCenterId, date);
            allUpdatedClosures.push(...dayClosures);
          }

          const transformedShiftCards = allUpdatedClosures
            .filter(
              (closure) =>
                closure.closureDate && typeof closure.closureDate === "string"
            )
            .map((closure) => {
              const dateString = normalizeDateString(closure.closureDate);
              const [year, month, day] = dateString.split("-").map(Number);
              const closureDate = new Date(year, month - 1, day);
              return {
                id: closure.id,
                date: dateString,
                status: "Closed",
                day: closureDate.toLocaleDateString("en-US", {
                  weekday: "short",
                }),
              };
            });
          setShiftCards(transformedShiftCards);
        } catch (error) {
          console.error("Error reloading closures:", error);
        }

        const dateStrings = dates.map((date) => formatDisplayDate(normalizeDateString(date)));
        if (totalClosuresCreated > 0 && failedDates.length === 0) {
          alert(
            `Successfully scheduled closure for ${dateStrings.join(", ")} in ${
              selectedServiceCenter?.serviceCenterName
            }. All services have been marked as unavailable.`
          );
        } else if (totalClosuresCreated > 0) {
          alert(
            `Closures created for ${dateStrings.join(", ")} in ${
              selectedServiceCenter?.serviceCenterName
            }, but issues occurred for dates: ${failedDates.join(
              ", "
            )}. Please check and update manually.`
          );
        } else {
          alert(
            `Failed to create closures for ${dateStrings.join(
              ", "
            )}. Please try again.`
          );
        }
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8">
        <div className="flex flex-col justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading closure schedule...</p>
        </div>
      </div>
    );
  }

  if (serviceCenters.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8">
        <h1 className="text-2xl font-bold text-gray-800">Service Center Closure Schedule</h1>
        <div className="max-w-2xl mx-auto bg-white rounded-md shadow-sm border border-red-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
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
          <h3 className="text-xl font-bold text-red-900 mb-2">
            No Service Centers Available
          </h3>
          <p className="text-gray-600 text-sm">
            No service centers were found. Please ensure service centers are
            properly configured in the system.
          </p>
        </div>
      </div>
    );
  }

  if (currentServiceCenterId === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8">
        {/* Header with user profile */}
        <div className="flex justify-end items-center mb-10">
          <UserProfileCard
            pictureSrc="/images/profipic.jpg"
            pictureAlt="User Profile"
            useCurrentUser={true}
            onLogout={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Service Center Closure Schedule</h1>
        <div className="max-w-2xl mx-auto bg-white rounded-md shadow-sm border border-yellow-200 p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-yellow-500"
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
          <h3 className="text-xl font-bold text-yellow-900 mb-2">
            No Service Center Selected
          </h3>
          <p className="text-gray-600 text-sm">
            Please select a service center to manage closure schedules.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8">
      {/* Header with user profile */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Closure Schedule Management</h1>
          <p className="text-gray-600">Schedule service center closures and manage service availability</p>
        </div>
        <UserProfileCard
          pictureSrc="/images/profipic.jpg"
          pictureAlt="User Profile"
          useCurrentUser={true}
          onLogout={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        />
      </div>

      {/* Service Center Selection */}
      {getUserRole() === "SuperAdmin" && serviceCenters.length > 0 && (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Service Center
          </label>
          <select
            value={currentServiceCenterId || ""}
            onChange={(e) =>
              handleServiceCenterChange(parseInt(e.target.value))
            }
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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

      {/* Service Center Info Card */}
      {selectedServiceCenter && (
        <div className="bg-white rounded-md border shadow-md border-blue-100 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-blue-600 mb-1">
                {selectedServiceCenter.serviceCenterName}
              </h2>
              
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                selectedServiceCenter.Station_status === "Active"
                  ? " text-blue-600 "
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {selectedServiceCenter.Station_status || "Active"}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div className="bg-white/60 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Address</p>
              <p className="text-sm font-medium text-gray-800">{selectedServiceCenter.address}</p>
            </div>
            <div className="bg-white/60 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Phone</p>
              <p className="text-sm font-medium text-gray-800">{selectedServiceCenter.telephoneNumber}</p>
            </div>
            <div className="bg-white/60 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="text-sm font-medium text-gray-800">{selectedServiceCenter.email}</p>
            </div>
            <div className="bg-white/60 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Available Services</p>
              <p className="text-sm font-medium text-gray-800">
                {serviceCenterServices.filter((service) => service.isAvailable).length} / {serviceCenterServices.length}
              </p>
            </div>
            <div className="bg-white/60 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Current Week</p>
              <p className="text-sm font-medium text-gray-800">
                Week {currentWeek} - {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar and Controls */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
            <ScheduleShopClosures
              onSave={handleSave}
              onDatesSelected={fetchDateServiceAvailabilities}
              onServiceAvailabilityChange={handleServiceAvailabilityChange}
              onModeChange={handleModeChange}
              closedDates={closedDatesSet}
              availableServices={serviceCenterServices.map((service) => ({
                id: service.serviceId,
                name: service.serviceName || "Unknown Service",
                selected: false,
                isAvailable: service.isAvailable,
              }))}
            />
          </div>
        </div>

        {/* Scheduled Closures Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">This Week's Closures</h3>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">{shiftCards.length}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">Individual dates closed this week</p>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {shiftCards.length > 0 ? (
                shiftCards.map((shift, index) => (
                  <ShiftCard
                    key={index}
                    date={shift.date}
                    status={shift.status}
                    day={shift.day}
                    onDelete={() => handleDeleteClosure(shift.id, shift.date)}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-8 h-8 text-gray-400"
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
                  <p className="text-sm font-medium text-gray-600 mb-1">No closures scheduled</p>
                  <p className="text-xs text-gray-400">
                    Select dates and click "Save" to schedule closures
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Service Availability Table */}
      {(dateServiceAvailabilities.length > 0 || isLoadingAvailabilities) && (
        <div className="mt-8 bg-white rounded-md shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Service Availability Details</h2>
            <p className="text-sm text-gray-600">
              View and manage service availability for selected dates
            </p>
          </div>
          
          {isLoadingAvailabilities ? (
            <div className="flex flex-col justify-center items-center h-32">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mb-3"></div>
              <span className="text-sm text-gray-600 font-medium">Loading availability data...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Service ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Service Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Service Center ID
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {dateServiceAvailabilities.flatMap((dateAvailability) => {
                      const dateKey = normalizeDateString(dateAvailability.date);
                      const isDateClosed = closedDatesSet.has(dateKey);
                      return dateAvailability.services.map((service) => (
                        <tr
                          key={`${dateAvailability.date.toISOString()}-${service.serviceId}`}
                          className={`hover:bg-blue-50/30 transition-colors ${isDateClosed ? 'bg-gray-50' : ''}`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <div className="flex items-center">
                              {formatDisplayDate(dateKey)}
                              {isDateClosed && (
                                <svg className="w-4 h-4 ml-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {service.serviceId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {service.serviceName || "Unknown Service"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {isDateClosed ? (
                              <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-700 border border-gray-400">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                Closed (Locked)
                              </span>
                            ) : (
                              <span
                                className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                                  service.isAvailable
                                    ? "bg-green-100 text-green-700 border border-green-300"
                                    : "bg-red-100 text-red-700 border border-red-300"
                                }`}
                              >
                                <div className={`w-2 h-2 rounded-full mr-2 ${service.isAvailable ? "bg-green-500" : "bg-red-500"}`}></div>
                                {service.isAvailable ? "Available" : "Unavailable"}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {currentServiceCenterId}
                          </td>
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Table Footer with Stats */}
              <div className="bg-gray-50 px-6 py-4 mt-4 rounded-lg border border-gray-200">
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div className="text-sm font-medium text-gray-700">
                    Total Records:{" "}
                    <span className="text-blue-600 font-bold">
                      {dateServiceAvailabilities.reduce(
                        (total, dateAvailability) =>
                          total + dateAvailability.services.length,
                        0
                      )}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-700">
                        Available:{" "}
                        <span className="font-semibold text-green-600">
                          {dateServiceAvailabilities.reduce(
                            (total, dateAvailability) =>
                              total +
                              dateAvailability.services.filter((s) => s.isAvailable)
                                .length,
                            0
                          )}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-700">
                        Unavailable:{" "}
                        <span className="font-semibold text-red-600">
                          {dateServiceAvailabilities.reduce(
                            (total, dateAvailability) =>
                              total +
                              dateAvailability.services.filter((s) => !s.isAvailable)
                                .length,
                            0
                          )}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageServices;