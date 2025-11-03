import React, { useState, useEffect, useCallback } from "react";
import {
  fetchServiceCenters,
  fetchServiceCenterServices,
  toggleServiceAvailabilityForDay,
  getServiceAvailabilities,
} from "@/utils/api";
import {
  ServiceCenter,
  ServiceCenterServiceDTO,
  ServiceAvailabilityDTO,
} from "@/types/index";
import { getAuthUser } from "@/utils/auth";

interface ServiceAvailability {
  serviceId: number;
  serviceName: string;
  date: string;
  isAvailable: boolean;
}

const ServiceAvailabilityManagement: React.FC = () => {
  const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>([]);
  const [selectedServiceCenter, setSelectedServiceCenter] =
    useState<ServiceCenter | null>(null);
  const [services, setServices] = useState<ServiceCenterServiceDTO[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [serviceAvailabilities, setServiceAvailabilities] = useState<
    ServiceAvailability[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentServiceCenterId, setCurrentServiceCenterId] = useState<
    number | null
  >(null);

  useEffect(() => {
    loadServiceCenters();
  }, []);

  const loadServiceCenters = async () => {
    try {
      const centers = await fetchServiceCenters();
      setServiceCenters(centers);

      // Auto-select first service center for non-super-admin users
      const user = getAuthUser();
      if (user?.userRole !== "SuperAdmin" && centers.length > 0) {
        const firstCenter = centers[0];
        const centerId = firstCenter.Station_id || parseInt(firstCenter.id);
        setCurrentServiceCenterId(centerId);
        setSelectedServiceCenter(firstCenter);
      }
    } catch (error) {
      console.error("Error loading service centers:", error);
    }
  };

  const loadServices = useCallback(async () => {
    if (!currentServiceCenterId) return;

    try {
      const serviceList = await fetchServiceCenterServices(
        currentServiceCenterId.toString()
      );
      setServices(serviceList);
    } catch (error) {
      console.error("Error loading services:", error);
    }
  }, [currentServiceCenterId]);

  const loadServiceAvailabilities = useCallback(async () => {
    if (!currentServiceCenterId || !selectedDate) return;

    setIsLoading(true);
    try {
      // First, get all services for this service center
      const allServices = services.map((service) => ({
        serviceId: service.serviceId,
        serviceName: service.serviceName || "Unknown Service",
        date: selectedDate,
        isAvailable: service.isAvailable, // Default to global availability
      }));

      // Then, try to fetch specific availability for this date
      try {
        const existingAvailabilities = await getServiceAvailabilities(
          currentServiceCenterId,
          selectedDate, // startDate
          selectedDate // endDate (same date to get just this date)
        );

        console.log("Fetched existing availabilities:", existingAvailabilities);

        // Merge the existing availabilities with the default ones
        const availabilities: ServiceAvailability[] = allServices.map(
          (service) => {
            const existing = existingAvailabilities.find(
              (avail: ServiceAvailabilityDTO) =>
                avail.serviceId === service.serviceId
            );

            return {
              ...service,
              isAvailable: existing
                ? existing.isAvailable
                : service.isAvailable,
            };
          }
        );

        setServiceAvailabilities(availabilities);
      } catch (fetchError) {
        console.warn(
          "Could not fetch existing availabilities, using defaults:",
          fetchError
        );
        // Fall back to default availabilities
        setServiceAvailabilities(allServices);
      }
    } catch (error) {
      console.error("Error loading service availabilities:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentServiceCenterId, selectedDate, services]);

  useEffect(() => {
    if (currentServiceCenterId) {
      loadServices();
      loadServiceAvailabilities();
    }
  }, [
    currentServiceCenterId,
    selectedDate,
    loadServices,
    loadServiceAvailabilities,
  ]);

  // Refresh data when page becomes visible (e.g., when returning from closure schedule)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && currentServiceCenterId) {
        console.log(
          "Page became visible, refreshing service availability data"
        );
        loadServices();
        loadServiceAvailabilities();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [currentServiceCenterId, loadServices, loadServiceAvailabilities]);

  const handleServiceCenterChange = (serviceCenterId: number) => {
    const center = serviceCenters.find(
      (c) => (c.Station_id || parseInt(c.id)) === serviceCenterId
    );
    setSelectedServiceCenter(center || null);
    setCurrentServiceCenterId(serviceCenterId);
  };

  const handleServiceAvailabilityToggle = async (
    serviceId: number,
    isAvailable: boolean
  ) => {
    if (!currentServiceCenterId) return;

    try {
      // Update the local state immediately for better UX
      setServiceAvailabilities((prev) =>
        prev.map((availability) =>
          availability.serviceId === serviceId
            ? { ...availability, isAvailable }
            : availability
        )
      );

      // Call the backend API to update service availability
      const dateObj = new Date(selectedDate);
      await toggleServiceAvailabilityForDay(
        currentServiceCenterId,
        serviceId,
        dateObj,
        isAvailable
      );

      console.log(
        `Service ${serviceId} availability updated to ${isAvailable} for date ${selectedDate}`
      );
    } catch (error) {
      console.error("Error updating service availability:", error);
      // Revert the change on error
      setServiceAvailabilities((prev) =>
        prev.map((availability) =>
          availability.serviceId === serviceId
            ? { ...availability, isAvailable: !isAvailable }
            : availability
        )
      );
      alert("Failed to update service availability. Please try again.");
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  if (isLoading && serviceAvailabilities.length === 0) {
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

  return (
    <div
      className="p-6 space-y-6"
      style={{ backgroundColor: "#FFFFFF", minHeight: "100vh" }}
    >
      <h1 className="h2 text-neutral-600">Service Availability Management</h1>

      {/* Service Center Selection */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {getAuthUser()?.userRole === "SuperAdmin" &&
          serviceCenters.length > 0 && (
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
                <option value="">Select a service center</option>
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

      {/* Date Selection */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            min={getTodayDate()}
            className="w-full p-2 border border-neutral-150 rounded-md text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={() => handleDateChange(getTodayDate())}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Today
          </button>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => handleDateChange(getTomorrowDate())}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Tomorrow
          </button>
        </div>

        <div className="flex items-end">
          <button
            onClick={async () => {
              if (currentServiceCenterId) {
                setIsRefreshing(true);
                try {
                  await loadServices();
                  await loadServiceAvailabilities();
                } finally {
                  setIsRefreshing(false);
                }
              }
            }}
            disabled={isRefreshing}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh service availability data"
          >
            {isRefreshing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2 inline-block"></div>
                Refreshing...
              </>
            ) : (
              <>🔄 Refresh</>
            )}
          </button>
        </div>
      </div>

      {/* Current Service Center Info */}
      {selectedServiceCenter && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Managing Availability for: {selectedServiceCenter.serviceCenterName}
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <span className="font-medium">Date:</span>{" "}
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div>
              <span className="font-medium">Total Services:</span>{" "}
              {services.length}
            </div>
          </div>
        </div>
      )}

      {/* Service Availability List */}
      {currentServiceCenterId && (
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm">
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-800">
              Service Availability for{" "}
              {new Date(selectedDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              Toggle the availability of individual services for this date.
              Services marked as unavailable will not be bookable by customers.
            </p>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-neutral-600">
                  Loading services...
                </span>
              </div>
            ) : serviceAvailabilities.length > 0 ? (
              <div className="space-y-4">
                {serviceAvailabilities.map((availability) => (
                  <div
                    key={availability.serviceId}
                    className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-neutral-800">
                        {availability.serviceName}
                      </h3>
                      <p className="text-xs text-neutral-500">
                        Service ID: {availability.serviceId}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span
                        className={`text-sm font-medium ${
                          availability.isAvailable
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {availability.isAvailable ? "Available" : "Unavailable"}
                      </span>

                      <button
                        onClick={() =>
                          handleServiceAvailabilityToggle(
                            availability.serviceId,
                            !availability.isAvailable
                          )
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                          availability.isAvailable
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            availability.isAvailable
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Services Found
                </h3>
                <p className="text-gray-500">
                  {currentServiceCenterId
                    ? "No services are configured for this service center."
                    : "Please select a service center to view services."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-md font-semibold text-yellow-800 mb-2">
          How Service Availability Works
        </h4>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>
            • <strong>Available Services:</strong> Customers can book these
            services for the selected date
          </li>
          <li>
            • <strong>Unavailable Services:</strong> These services will not
            appear in the booking system for customers
          </li>
          <li>
            • <strong>Closure Impact:</strong> When a service center is closed,
            all services automatically become unavailable
          </li>
          <li>
            • <strong>Manual Override:</strong> You can manually adjust service
            availability here, independent of closures
          </li>
          <li>
            • <strong>Data Refresh:</strong> Use the &quot;🔄 Refresh&quot;
            button to reload the latest availability data, especially after
            creating closures
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ServiceAvailabilityManagement;
