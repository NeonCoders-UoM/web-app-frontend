"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ScheduleShopClosures from "@/components/molecules/schedule-shop-closures/schedule-shop-closures";
import ShiftCard from "@/components/atoms/shiftcard/shiftcard";
import {
  addClosureSchedule,
  getClosures,
  fetchServiceCenters,
  fetchServiceCenterServices,
  toggleServiceAvailabilityForDay,
  getServiceAvailabilities,
} from "@/utils/api";
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
    { date: string; status: string; day?: string }[]
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

  // Normalize date to YYYY-MM-DD in UTC
  const normalizeDateString = (date: Date | string): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
  };

  // Format date for display (expects YYYY-MM-DD string)
  const formatDisplayDate = (date: string): string => {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
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
        const utcDate = new Date(
          Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        );
        const closures = await getClosures(currentServiceCenterId, utcDate);
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
          date: new Date(dateString + "T00:00:00Z"),
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
  const handleServiceAvailabilityChange = async (serviceAvailabilities: {
    [serviceId: number]: boolean;
  }) => {
    if (isClosureMode) return;

    const closedDates = new Set(
      (
        await Promise.all(
          selectedDatesForPreview.map(async (date) => {
            const utcDate = new Date(
              Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
            );
            const closures = await getClosures(currentServiceCenterId!, utcDate);
            return closures.length > 0 ? normalizeDateString(date) : null;
          })
        )
      ).filter((d): d is string => d !== null)
    );

    if (closedDates.size > 0) {
      alert(
        `Cannot modify service availability for closed dates: ${Array.from(
          closedDates
        )
          .map((d) => formatDisplayDate(d))
          .join(", ")}. Please remove closures first.`
      );
      return;
    }

    const updatedAvailabilities = { ...modifiedServiceAvailabilities };
    selectedDatesForPreview.forEach((date) => {
      const dateKey = normalizeDateString(date);
      updatedAvailabilities[dateKey] = { ...serviceAvailabilities };
    });
    setModifiedServiceAvailabilities(updatedAvailabilities);

    const updatedPreview = dateServiceAvailabilities.map((dateAvailability) => {
      const dateKey = normalizeDateString(dateAvailability.date);
      const modifiedServices = updatedAvailabilities[dateKey];
      if (modifiedServices) {
        return {
          ...dateAvailability,
          services: dateAvailability.services.map((service) => ({
            ...service,
            isAvailable:
              modifiedServices[service.serviceId] ?? service.isAvailable,
          })),
        };
      }
      return dateAvailability;
    });
    setDateServiceAvailabilities(updatedPreview);
  };

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
          const utcDate = new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
          );
          try {
            const dayClosures = await getClosures(currentServiceCenterId, utcDate);
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
            const closureDate = new Date(dateString + "T00:00:00Z");
            return {
              date: dateString,
              status: "Closed",
              day: closureDate.toLocaleDateString("en-US", {
                weekday: "short",
                timeZone: "UTC",
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
                const utcDate = new Date(
                  Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
                );
                const closures = await getClosures(currentServiceCenterId, utcDate);
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
              const utcDate = new Date(
                Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
              );
              await toggleServiceAvailabilityForDay(
                currentServiceCenterId,
                service.id,
                utcDate,
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
            const utcDate = new Date(
              Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
            );
            const utcDateString = normalizeDateString(utcDate);
            await addClosureSchedule({
              serviceCenterId: currentServiceCenterId,
              closureDate: utcDateString,
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
            const utcDate = new Date(
              Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
            );
            const dayClosures = await getClosures(currentServiceCenterId, utcDate);
            allUpdatedClosures.push(...dayClosures);
          }

          const transformedShiftCards = allUpdatedClosures
            .filter(
              (closure) =>
                closure.closureDate && typeof closure.closureDate === "string"
            )
            .map((closure) => {
              const dateString = normalizeDateString(closure.closureDate);
              const closureDate = new Date(dateString + "T00:00:00Z");
              return {
                date: dateString,
                status: "Closed",
                day: closureDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  timeZone: "UTC",
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
      <h1 className="h2 text-neutral-600">Service Center Closure Schedule</h1>

      <div className="grid grid-cols-1 gap-4 mb-4">
        {getUserRole() === "SuperAdmin" && serviceCenters.length > 0 && (
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
      </div>

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
              {
                serviceCenterServices.filter((service) => service.isAvailable)
                  .length
              }{" "}
              / {serviceCenterServices.length}
            </div>
            <div>
              <span className="font-medium">Viewing Week:</span>{" "}
              {`Week ${currentWeek} (${new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })})`}
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-4">
        <div className="flex-1">
          <ScheduleShopClosures
            onSave={handleSave}
            onDatesSelected={fetchDateServiceAvailabilities}
            onServiceAvailabilityChange={handleServiceAvailabilityChange}
            onModeChange={handleModeChange}
            availableServices={serviceCenterServices.map((service) => ({
              id: service.serviceId,
              name: service.serviceName || "Unknown Service",
              selected: false,
              isAvailable: service.isAvailable,
            }))}
          />
        </div>

        <div className="space-y-2">
          <div className="text-lg font-semibold text-neutral-600">
            Scheduled Closures for Current Week
          </div>
          <div className="text-sm text-neutral-500 mb-3">
            Individual dates closed this week
          </div>
          <div
            className="p-4 rounded-lg space-y-2"
            style={{
              backgroundColor: "#F3F7FF",
            }}
          >
            {shiftCards.length > 0 ? (
              shiftCards.map((shift, index) => (
                <ShiftCard
                  key={index}
                  date={shift.date}
                  status={shift.status}
                  day={shift.day}
                />
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
                  Select dates in the calendar and click &quot;Save&quot; to
                  close specific dates
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {(dateServiceAvailabilities.length > 0 || isLoadingAvailabilities) && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-neutral-600 mb-4">
            Service Availability Data
          </h2>
          <p className="text-sm text-neutral-500 mb-6">
            This table shows the service availability records from the database
            for the selected dates.
          </p>
          {isLoadingAvailabilities ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-neutral-600">
                Loading availability data...
              </span>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Service ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Service Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Service Center ID
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {dateServiceAvailabilities.flatMap((dateAvailability) =>
                      dateAvailability.services.map((service) => (
                        <tr
                          key={`${dateAvailability.date.toISOString()}-${service.serviceId}`}
                          className="hover:bg-neutral-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                            {formatDisplayDate(normalizeDateString(dateAvailability.date))}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                            {service.serviceId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                            {service.serviceName || "Unknown Service"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                service.isAvailable
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {service.isAvailable
                                ? "Available"
                                : "Unavailable"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                            {currentServiceCenterId}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-200">
                <div className="flex justify-between items-center text-sm text-neutral-600">
                  <span>
                    Total Records:{" "}
                    {dateServiceAvailabilities.reduce(
                      (total, dateAvailability) =>
                        total + dateAvailability.services.length,
                      0
                    )}
                  </span>
                  <div className="flex space-x-4">
                    <span className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      Available:{" "}
                      {dateServiceAvailabilities.reduce(
                        (total, dateAvailability) =>
                          total +
                          dateAvailability.services.filter((s) => s.isAvailable)
                            .length,
                        0
                      )}
                    </span>
                    <span className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      Unavailable:{" "}
                      {dateServiceAvailabilities.reduce(
                        (total, dateAvailability) =>
                          total +
                          dateAvailability.services.filter((s) => !s.isAvailable)
                            .length,
                        0
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageServices;