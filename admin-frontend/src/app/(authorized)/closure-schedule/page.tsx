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

interface ServiceAvailabilityData {
  id: number;
  isAvailable: boolean;
}

const ManageServices = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryServiceCenterId =
    searchParams.get("serviceCenterId") || searchParams.get("stationId");

  const [shiftCards, setShiftCards] = useState<
    { day: string; status: string; specificDate?: string }[]
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
  const [isClosureMode, setIsClosureMode] = useState(true); // Track whether we're in closure mode or service mode

  // Function to fetch service availabilities for selected dates
  const fetchDateServiceAvailabilities = async (dates: Date[]) => {
    if (!currentServiceCenterId || dates.length === 0) {
      setDateServiceAvailabilities([]);
      setSelectedDatesForPreview([]);
      return;
    }

    setSelectedDatesForPreview(dates);
    console.log(
      "Fetching availabilities for dates:",
      dates.map((d) => d.toDateString())
    );

    try {
      setIsLoadingAvailabilities(true);

      // Get current closures to determine if selected dates are closed
      const allClosures: ClosureSchedule[] = [];

      // Load closures for the selected dates
      for (const date of dates) {
        try {
          const dayClosures = await getClosures(currentServiceCenterId, date);
          console.log(
            `DEBUG: Closures loaded for ${date.toDateString()}:`,
            dayClosures
          );
          allClosures.push(...dayClosures);
        } catch (error) {
          console.warn(
            `Failed to load closures for ${date.toDateString()}:`,
            error
          );
        }
      }

      const validClosures = allClosures.filter(
        (closure) =>
          closure.closureDate && typeof closure.closureDate === "string"
      );
      const invalidClosures = allClosures.filter(
        (closure) =>
          !closure.closureDate || typeof closure.closureDate !== "string"
      );

      if (invalidClosures.length > 0) {
        console.warn(
          "DEBUG: Found invalid closures without closureDate field:",
          invalidClosures
        );
      }

      console.log(
        "DEBUG: Valid closures with closureDate:",
        validClosures.map((c) => ({ id: c.id, closureDate: c.closureDate }))
      );

      // Create a set of closed dates for quick lookup
      const closedDates = new Set(
        validClosures.map((closure) => {
          const date = new Date(closure.closureDate);
          return date.toISOString().split("T")[0]; // Normalize to UTC YYYY-MM-DD
        })
      );

      console.log("DEBUG: Current closures loaded:", allClosures);
      console.log(
        "DEBUG: Filtered closures with valid closureDate field:",
        validClosures
      );
      console.log("DEBUG: Closed dates set:", closedDates);

      // Try to fetch actual ServiceAvailability data from backend
      let actualAvailabilities: ServiceAvailabilityDTO[] = [];
      try {
        // Get the date range for the selected dates
        const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
        const startDate = sortedDates[0].toISOString().split("T")[0];
        const endDate = sortedDates[sortedDates.length - 1]
          .toISOString()
          .split("T")[0];

        console.log(
          `DEBUG: Fetching actual service availabilities from ${startDate} to ${endDate}`
        );
        actualAvailabilities = await getServiceAvailabilities(
          currentServiceCenterId,
          startDate,
          endDate
        );
        console.log(
          "DEBUG: Fetched actual availabilities:",
          actualAvailabilities
        );
      } catch (fetchError) {
        console.warn(
          "DEBUG: Failed to fetch actual service availabilities, using defaults:",
          fetchError
        );
        actualAvailabilities = [];
      }

      // Create availability map for quick lookup
      const availabilityMap = new Map<string, Map<number, boolean>>();
      actualAvailabilities.forEach((availability: ServiceAvailabilityDTO) => {
        const dateKey = new Date(availability.date).toISOString().split("T")[0]; // Normalize to UTC YYYY-MM-DD
        if (!availabilityMap.has(dateKey)) {
          availabilityMap.set(dateKey, new Map<number, boolean>());
        }
        availabilityMap
          .get(dateKey)!
          .set(availability.serviceId, availability.isAvailable);
      });

      console.log("DEBUG: Availability map:", availabilityMap);

      // Create default state based on actual data or closure status
      const defaultAvailabilities: DateServiceAvailability[] = [];

      for (const date of dates) {
        // Create date at noon local time to avoid timezone conversion issues
        const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);

        const year = localDate.getFullYear();
        const month = String(localDate.getMonth() + 1).padStart(2, "0");
        const day = String(localDate.getDate()).padStart(2, "0");
        const dateString = `${year}-${month}-${day}`; // YYYY-MM-DD format in local timezone

        // Use UTC version for backend comparison (this is what the API uses)
        const utcDateString = localDate.toISOString().split("T")[0]; // YYYY-MM-DD in UTC

        console.log(`DEBUG: Processing date: ${localDate.toDateString()}`);
        console.log(`DEBUG: Local dateString: ${dateString}`);
        console.log(`DEBUG: UTC dateString: ${utcDateString}`);

        // Check if the specific date is in the closed dates set
        console.log(`DEBUG: Looking for closure on date: ${dateString}`);
        console.log(
          `DEBUG: Checking if closedDates has UTC:`,
          closedDates.has(utcDateString)
        );
        console.log(`DEBUG: All closed dates in set:`, Array.from(closedDates));

        // Use UTC format for comparison
        const isDateClosed = closedDates.has(utcDateString);

        if (isDateClosed) {
          console.log(
            `DEBUG: Found closure for date ${dateString}/${utcDateString} - ALL SERVICES UNAVAILABLE`
          );
        } else {
          console.log(
            `DEBUG: No closure found for ${dateString}/${utcDateString} - services may be available`
          );
        }

        console.log(`DEBUG: Date ${dateString} closed status: ${isDateClosed}`);

        // If date is closed: all services unavailable
        // If date is not closed: check actual availability data or use defaults
        let defaultServices;

        console.log(
          `DEBUG: Determining services for ${dateString}, isClosureMode: ${isClosureMode}, isDateClosed: ${isDateClosed}`
        );

        if (isDateClosed) {
          // Date is closed - ALL SERVICES UNAVAILABLE regardless of mode
          console.log(`DEBUG: Date is closed - forcing all services unavailable`);
          defaultServices = serviceCenterServices.map((service) => ({
            serviceId: service.serviceId,
            serviceName: service.serviceName || "Unknown Service",
            isAvailable: false, // Force unavailable for closed dates
          }));
        } else if (isClosureMode) {
          // In closure mode and date is not closed, just show based on closure status
          console.log(`DEBUG: Using closure mode logic for ${dateString}`);
          defaultServices = serviceCenterServices.map((service) => ({
            serviceId: service.serviceId,
            serviceName: service.serviceName || "Unknown Service",
            isAvailable: true, // Available if not closed
          }));
          console.log(
            `DEBUG: Closure mode result - all services available: true`
          );
        } else {
          // In service mode, check if we have actual availability data for this date
          const dateAvailabilityMap =
            availabilityMap.get(utcDateString);

          if (dateAvailabilityMap) {
            // Use actual availability data from backend
            console.log(
              `DEBUG: Using actual availability data for ${utcDateString}`
            );
            defaultServices = serviceCenterServices.map((service) => {
              const actualAvailability = dateAvailabilityMap.get(
                service.serviceId
              );
              return {
                serviceId: service.serviceId,
                serviceName: service.serviceName || "Unknown Service",
                isAvailable:
                  actualAvailability !== undefined
                    ? actualAvailability
                    : true, // Default to available if no data
              };
            });
          } else {
            // No actual data, check if we have modified availabilities for this date
            const dateKey = date.toDateString();
            const modifiedServices = modifiedServiceAvailabilities[dateKey];

            if (modifiedServices) {
              // Use modified availabilities
              defaultServices = serviceCenterServices.map((service) => ({
                serviceId: service.serviceId,
                serviceName: service.serviceName || "Unknown Service",
                isAvailable:
                  modifiedServices[service.serviceId] ?? true, // Default to available
              }));
            } else {
              // No modifications, use default (available)
              defaultServices = serviceCenterServices.map((service) => ({
                serviceId: service.serviceId,
                serviceName: service.serviceName || "Unknown Service",
                isAvailable: true, // Default to available
              }));
            }
          }
        }

        const dateAvailability: DateServiceAvailability = {
          date: localDate,
          services: defaultServices,
        };

        console.log(`DEBUG: Final availability for ${dateString}:`, {
          date: dateString,
          isClosed: isDateClosed,
          servicesCount: defaultServices.length,
          availableCount: defaultServices.filter((s) => s.isAvailable).length,
          unavailableCount: defaultServices.filter((s) => !s.isAvailable)
            .length,
          firstService: defaultServices[0]
            ? {
                name: defaultServices[0].serviceName,
                available: defaultServices[0].isAvailable,
              }
            : null,
        });

        defaultAvailabilities.push(dateAvailability);
      }

      console.log(
        "DEBUG: Final availabilities:",
        defaultAvailabilities.map((da) => ({
          date:
            da.date.getFullYear() +
            "-" +
            String(da.date.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(da.date.getDate()).padStart(2, "0"),
          closed: !da.services[0]?.isAvailable,
          services: da.services.map((s) => ({
            id: s.serviceId,
            available: s.isAvailable,
          })),
        }))
      );

      setDateServiceAvailabilities(defaultAvailabilities);
    } catch (error) {
      console.error("Error setting up default availabilities:", error);
      setDateServiceAvailabilities([]);
    } finally {
      setIsLoadingAvailabilities(false);
    }
  };

  // Function to handle mode changes from calendar component
  const handleModeChange = (isClosureModeParam: boolean) => {
    setIsClosureMode(isClosureModeParam);
    console.log(
      "Mode changed to:",
      isClosureModeParam ? "closure mode" : "service mode"
    );

    // Clear modified state when switching to closure mode
    if (isClosureModeParam) {
      setModifiedServiceAvailabilities({});
      console.log("Cleared modified service availabilities for closure mode");
    }

    // Always refresh the preview when mode changes to ensure consistency
    if (selectedDatesForPreview.length > 0) {
      console.log("Refreshing preview after mode change");
      fetchDateServiceAvailabilities(selectedDatesForPreview);
    }
  };

  // Function to handle service availability changes from calendar component
  const handleServiceAvailabilityChange = (serviceAvailabilities: {
    [serviceId: number]: boolean;
  }) => {
    console.log("Current mode - isClosureMode:", isClosureMode);
    console.log("Selected dates for preview:", selectedDatesForPreview.length);

    // Only apply changes if we're not in closure mode
    if (isClosureMode) {
      console.log(
        "Ignoring service availability change - currently in closure mode"
      );
      return;
    }

    console.log("Service availability change received:", serviceAvailabilities);

    const updatedAvailabilities = { ...modifiedServiceAvailabilities };

    // Apply the same service availability to all selected dates
    // This ensures consistency across selected dates
    selectedDatesForPreview.forEach((date) => {
      const dateKey = date.toDateString();
      updatedAvailabilities[dateKey] = { ...serviceAvailabilities };
    });

    setModifiedServiceAvailabilities(updatedAvailabilities);
    console.log(
      "Updated modified service availabilities:",
      updatedAvailabilities
    );

    // Update the preview display
    const updatedPreview = dateServiceAvailabilities.map((dateAvailability) => {
      const dateKey = dateAvailability.date.toDateString();
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
    console.log("Updated preview with modified availabilities");
  };

  // Function to calculate week number from date
  const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // Get current week number from current date
  const currentWeek = getWeekNumber(new Date());

  // Get current user role and determine service center access
  const getUserRole = () => {
    const user = getAuthUser();
    return user?.userRole || null;
  };

  // Load service centers and determine which one to use
  useEffect(() => {
    const loadServiceCenters = async () => {
      try {
        const centers = await fetchServiceCenters();
        setServiceCenters(centers);

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
  }, [queryServiceCenterId]);

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

  // Clear date service availabilities when service center changes
  useEffect(() => {
    setDateServiceAvailabilities([]);
    setIsLoadingAvailabilities(false);
  }, [currentServiceCenterId]);
  useEffect(() => {
    const loadClosures = async () => {
      if (currentServiceCenterId === null) return;

      try {
        setIsLoading(true);
        console.log(
          `Loading closures for service center ${currentServiceCenterId}`
        );

        // Load closures for the current week (7 days)
        const allClosures: ClosureSchedule[] = [];
        const today = new Date();

        // Load closures for the current week (today + 6 days)
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

        console.log("Closures loaded from database:", allClosures);

        // Transform closures to shift cards with specific date information
        const transformedShiftCards = allClosures
          .filter(
            (closure) =>
              closure.closureDate && typeof closure.closureDate === "string"
          )
          .map((closure) => {
            // Parse the closure date to get day of week
            const closureDate = new Date(closure.closureDate);
            const dayOfWeek = closureDate.toLocaleDateString("en-US", {
              weekday: "short",
            });
            const dateString = closureDate.toISOString().split("T")[0]; // Use UTC format

            return {
              day: dayOfWeek,
              status: "Closed",
              specificDate: dateString,
            };
          });

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
  }, [currentServiceCenterId]);

  const handleServiceCenterChange = (serviceCenterId: number) => {
    console.log("Changing service center to:", serviceCenterId);
    setCurrentServiceCenterId(serviceCenterId);
    const center = serviceCenters.find(
      (sc) => (sc.Station_id || parseInt(sc.id)) === serviceCenterId
    );
    setSelectedServiceCenter(center || null);
    // Update the URL query parameter
    const params = new URLSearchParams(window.location.search);
    params.set("serviceCenterId", serviceCenterId.toString());
    router.push(`?${params.toString()}`);
    // Clear existing closures when switching service centers
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
        // Handle service-specific availability
        console.log(
          `Processing service availability for service center ${currentServiceCenterId}, dates:`,
          dates
        );

        for (const date of dates) {
          for (const service of serviceData) {
            try {
              // Create date at noon local time to avoid timezone conversion issues
              const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);

              // Set availability for each service on the selected date
              await toggleServiceAvailabilityForDay(
                currentServiceCenterId,
                service.id,
                localDate,
                service.isAvailable
              );
            } catch (error) {
              console.error(
                `Error updating service ${
                  service.id
                } availability for ${date.toDateString()}:`,
                error
              );
              // Continue with other services/dates
            }
          }
        }

        // Refresh service data
        const services = await fetchServiceCenterServices(
          currentServiceCenterId.toString()
        );
        setServiceCenterServices(services);

        const availableCount = serviceData.filter((s) => s.isAvailable).length;
        const unavailableCount = serviceData.filter(
          (s) => !s.isAvailable
        ).length;

        alert(
          `Successfully updated availability: ${availableCount} available, ${unavailableCount} unavailable on ${dates.length} date(s)`
        );

        // Refresh the date service availabilities display
        console.log("Refreshing preview after save");
        await fetchDateServiceAvailabilities(dates);

        // Clear the modified state after saving
        setModifiedServiceAvailabilities({});
        setSelectedDatesForPreview([]);
      } else {
        // Handle full service center closures (existing logic)
        console.log(
          `Processing full closure for service center ${currentServiceCenterId}, dates:`,
          dates
        );

        let totalClosuresCreated = 0;
        let failedServiceUpdates = 0;
        const failedDates: string[] = [];

        for (const date of dates) {
          try {
            // Create date at noon local time to avoid timezone conversion issues
            const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);

            // Format date as YYYY-MM-DD in UTC
            const utcDateString = localDate.toISOString().split("T")[0];

            console.log(`DEBUG: Adding closure for date ${utcDateString}:`, {
              serviceCenterId: currentServiceCenterId,
              closureDate: utcDateString,
            });

            // Create the closure first
            await addClosureSchedule({
              serviceCenterId: currentServiceCenterId,
              closureDate: utcDateString,
            });
            totalClosuresCreated++;

            // Automatically make all services unavailable for this closure date
            console.log(
              `DEBUG: Making all services unavailable for closure date ${utcDateString}`
            );

            let serviceUpdateSuccess = true;
            try {
              // Get all services for this service center
              const services = await fetchServiceCenterServices(
                currentServiceCenterId.toString()
              );

              // Create unavailable entries for all services on this closure date
              let successfulUpdates = 0;
              for (const service of services) {
                try {
                  await toggleServiceAvailabilityForDay(
                    currentServiceCenterId,
                    service.serviceId,
                    localDate,
                    false // Make unavailable
                  );
                  console.log(
                    `DEBUG: Made service ${service.serviceName} (${service.serviceId}) unavailable for ${utcDateString}`
                  );
                  successfulUpdates++;
                } catch (serviceError) {
                  console.warn(
                    `Failed to make service ${service.serviceName} unavailable for ${utcDateString}:`,
                    serviceError
                  );
                  failedServiceUpdates++;
                  serviceUpdateSuccess = false;
                  // Continue with other services even if one fails
                }
              }

              console.log(
                `DEBUG: Service updates for ${utcDateString}: ${successfulUpdates}/${services.length} successful`
              );

              if (!serviceUpdateSuccess) {
                failedDates.push(utcDateString);
                console.warn(
                  `DEBUG: Some service updates failed for date ${utcDateString}`
                );
              }
            } catch (servicesError) {
              console.warn(
                `Failed to fetch services for automatic unavailability on ${utcDateString}:`,
                servicesError
              );
              failedDates.push(utcDateString);
              serviceUpdateSuccess = false;
            }
          } catch (error) {
            console.error(
              `Error adding closure for ${date.toDateString()}:`,
              error
            );
            failedDates.push(
              date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            );
            // Continue with other dates even if one fails
          }
        }

        // Reload closures from database
        try {
          // Load closures for the current week (7 days)
          const allUpdatedClosures: ClosureSchedule[] = [];
          const today = new Date();

          // Load closures for the current week (today + 6 days)
          for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            try {
              const dayClosures = await getClosures(
                currentServiceCenterId,
                date
              );
              allUpdatedClosures.push(...dayClosures);
            } catch (error) {
              console.warn(
                `Failed to load closures for ${date.toDateString()}:`,
                error
              );
            }
          }

          const transformedShiftCards = allUpdatedClosures
            .filter(
              (closure) =>
                closure.closureDate && typeof closure.closureDate === "string"
            )
            .map((closure) => {
              // Parse the closure date to get day of week
              const closureDate = new Date(closure.closureDate);
              const dayOfWeek = closureDate.toLocaleDateString("en-US", {
                weekday: "short",
              });
              // Format date as YYYY-MM-DD in UTC
              const utcDateString = closureDate.toISOString().split("T")[0];

              return {
                day: dayOfWeek,
                status: "Closed",
                specificDate: utcDateString,
              };
            });
          setShiftCards(transformedShiftCards);
        } catch (error) {
          console.error("Error reloading closures:", error);
        }

        // Provide appropriate user feedback based on success/failure
        const dateStrings = dates.map((date) =>
          date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        );

        if (failedServiceUpdates === 0 && failedDates.length === 0) {
          // Complete success
          alert(
            `Successfully scheduled closure for ${dateStrings.join(", ")} in ${
              selectedServiceCenter?.serviceCenterName
            }. All services have been marked as unavailable.`
          );
        } else if (totalClosuresCreated > 0) {
          // Partial success - closures created but some service updates failed
          const successMessage = `Closures created for ${dateStrings.join(
            ", "
          )} in ${
            selectedServiceCenter?.serviceCenterName
          }, but ${failedServiceUpdates} service availability updates failed.`;

          if (failedDates.length > 0) {
            alert(
              `${successMessage}\n\nWarning: Service availability may not be properly updated for dates: ${failedDates.join(
                ", "
              )}. Please check the service availability preview and manually update if needed.`
            );
          } else {
            alert(
              `${successMessage}\n\nWarning: Some services may still show as available. Please check the service availability preview and manually update if needed.`
            );
          }
        } else {
          // Complete failure
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
      {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          About Closure Scheduling
        </h3>
        <p className="text-blue-700 text-sm">
          Use this tool to schedule when your service center will be closed.
          This information helps customers know when you&apos;re not available
          for appointments and services. Scheduled closures will be visible to
          customers when they try to book appointments.
        </p>
      </div> */}

      {/* Service Center Selection */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        {/* Service Center Selection (for super admin) */}
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

      {/* Top Section: ScheduleShopClosures (Left) and ShiftCards (Right) */}
      <div className="flex space-x-4">
        {/* Schedule Shop Closures Section (Left) */}
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

        {/* Closure Schedule Section (Right) */}
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
                  day={shift.day}
                  status={shift.status}
                  specificDate={shift.specificDate}
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

      {/* Service Availability Table */}
      {(dateServiceAvailabilities.length > 0 || isLoadingAvailabilities) && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-neutral-600 mb-4">
            Service Availability Data
          </h2>
          <p className="text-sm text-neutral-500 mb-6">
            This table shows the service availability records from the database for the selected dates.
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
                        <tr key={`${dateAvailability.date.toISOString()}-${service.serviceId}`} className="hover:bg-neutral-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                            {dateAvailability.date.toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                            {service.serviceId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                            {service.serviceName || "Unknown Service"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              service.isAvailable
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                              {service.isAvailable ? "Available" : "Unavailable"}
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

              {/* Summary Footer */}
              <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-200">
                <div className="flex justify-between items-center text-sm text-neutral-600">
                  <span>
                    Total Records: {dateServiceAvailabilities.reduce((total, dateAvailability) =>
                      total + dateAvailability.services.length, 0
                    )}
                  </span>
                  <div className="flex space-x-4">
                    <span className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      Available: {dateServiceAvailabilities.reduce((total, dateAvailability) =>
                        total + dateAvailability.services.filter(s => s.isAvailable).length, 0
                      )}
                    </span>
                    <span className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      Unavailable: {dateServiceAvailabilities.reduce((total, dateAvailability) =>
                        total + dateAvailability.services.filter(s => !s.isAvailable).length, 0
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Customer Impact Notice */}
      {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-md font-semibold text-yellow-800 mb-2">
          Customer Impact
        </h4>
        <p className="text-yellow-700 text-sm">
          When you schedule closures, customers will see these dates as
          unavailable when booking appointments. This helps prevent booking
          conflicts and improves customer experience by setting clear
          expectations about your service center&apos;s availability.
        </p>
      </div> */}

      {/* Week Selection Notice */}
      {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-md font-semibold text-blue-800 mb-2">
          Week Selection
        </h4>
        <p className="text-blue-700 text-sm">
          Use the week selector above to view closures for different weeks.
          Closures are saved per week, so make sure to select the correct week
          to see your scheduled closures. The current week is selected by
          default.
        </p>
      </div> */}

      {/* Service Availability Impact Notice */}
      {/* <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
        <h4 className="text-md font-semibold text-green-800 mb-2">
          Service Availability Impact
        </h4>
        <p className="text-green-700 text-sm">
          When you disable a service, it will no longer appear in the service
          list for customers booking appointments. This helps manage which
          services are currently offered by the service center. Re-enable
          services when they become available again.
        </p>
      </div> */}

      {/* Services Table */}
      {/* Removed - Service availability is now managed through the calendar */}
    </div>
  );
};

export default ManageServices;
