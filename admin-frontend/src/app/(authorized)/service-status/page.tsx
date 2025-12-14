"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ServiceStatusDataTable } from "@/components/organism/service-status-data-table/servise-status-data-table";
import { deleteAllAuthCookies, getCookie } from "@/utils/cookies";
import AppointmentSearch from "@/components/organism/search-filter-form/search-filter-form";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import Button from "@/components/atoms/button/button";
import {
  addServiceHistory,
  completeAppointment,
  fetchAppointmentDetail,
  fetchServiceCenterServices,
  addServicesToAppointment,
} from "@/utils/api";

export const dynamic = "force-dynamic";

// Use the AppointmentDetail type from api.ts
import type { AppointmentDetail } from "@/utils/api";

type RowData = {
  service: string;
  checked: boolean;
  serviceCenter: string;
  price?: number;
};

// Add type for available service
interface AvailableService {
  serviceCenterServiceId: number;
  serviceName: string;
  customPrice?: number;
  serviceBasePrice?: number;
}

export default function Page() {
  const router = useRouter();
  const [appointmentId, setAppointmentId] = useState("");
  const [services, setServices] = useState<RowData[] | null>(null);
  const [newServiceId, setNewServiceId] = useState<string>("");
  const [availableServices, setAvailableServices] = useState<
    AvailableService[]
  >([]);
  const [appointmentDetails, setAppointmentDetails] =
    useState<AppointmentDetail | null>(null); // Holds vehicleId, serviceCenterId, etc.
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(
    null
  );
  const searchParams = useSearchParams();
  const stationId = searchParams.get("stationId");

  // Check if appointment is completed
  const isAppointmentCompleted = appointmentDetails?.status === "Completed";

  // Fetch available services for the service center
  useEffect(() => {
    const fetchServices = async () => {
      if (!stationId) return;
      try {
        const data = await fetchServiceCenterServices(stationId);
        setAvailableServices(
          data.map((svc: AvailableService) => ({
            serviceCenterServiceId: svc.serviceCenterServiceId,
            serviceName: svc.serviceName,
            customPrice: svc.customPrice,
            serviceBasePrice: svc.serviceBasePrice,
          }))
        );
      } catch {
        setAvailableServices([]);
      }
    };
    fetchServices();
  }, [stationId]);

  // If no stationId, show error and do not render the rest of the page
  if (!stationId) {
    return (
      <div className="flex flex-col min-h-screen p-[58px] bg-white">
        <div className="text-red-600 text-lg font-semibold">
          No service center selected. Please select a service center from the
          dashboard.
        </div>
      </div>
    );
  }

  // Helper to get userId from localStorage
  const getCurrentUserId = () => {
    if (typeof window !== "undefined") {
      const userId = getCookie("userId");
      return userId ? parseInt(userId) : undefined;
    }
    return undefined;
  };

  // Fetch appointment details from backend
  const handleSearch = async () => {
    setFeedback(null);
    setFeedbackType(null);
    setLoading(true);
    try {
      const trimmedId = appointmentId.replace("#APT-", "").replace(/^0+/, "");
      const stationIdNum = stationId ? parseInt(stationId) : undefined;
      if (!stationIdNum) {
        setFeedback("No service center selected.");
        setFeedbackType("error");
        setLoading(false);
        return;
      }
      const data = await fetchAppointmentDetail(stationIdNum, trimmedId);

      setAppointmentDetails(data);
      // Handle the case where services might be empty (from fallback approach)
      if (data.services && data.services.length > 0) {
        setServices(
          data.services.map((service: string) => {
            const svc = availableServices.find(
              (s) => s.serviceName === service
            );
            return {
              service,
              checked: true,
              serviceCenter: data.serviceCenterName || "",
              price: svc ? svc.customPrice ?? svc.serviceBasePrice ?? 0 : 0,
            };
          })
        );
      } else {
        // If no services are returned, create a placeholder service
        setServices([
          {
            service: "Service details not available",
            checked: false,
            serviceCenter: data.serviceCenterName || "N/A",
            price: 0,
          },
        ]);
      }

      // Show appropriate message based on appointment status
      if (data.status === "Completed") {
        setFeedback(
          "Appointment found! This appointment has already been completed."
        );
        setFeedbackType("success");
      } else {
        setFeedback("Appointment found successfully!");
        setFeedbackType("success");
      }
    } catch {
      setServices([]);
      setAppointmentDetails(null);
      setFeedback("Appointment not found or error fetching details.");
      setFeedbackType("error");
    } finally {
      setLoading(false);
    }
  };

  // Add service from dropdown (only for non-completed appointments)
  const handleAddService = () => {
    if (!newServiceId || services === null || isAppointmentCompleted) return;
    const svc = availableServices.find(
      (s) => s.serviceCenterServiceId.toString() === newServiceId
    );
    if (!svc) return;
    const price = svc.customPrice ?? svc.serviceBasePrice ?? 0;
    const newService: RowData = {
      service: svc.serviceName,
      checked: false,
      serviceCenter: appointmentDetails?.serviceCenterName || "",
      price,
    };
    setServices((prev) => [...(prev || []), newService]);
    setNewServiceId("");
  };

  const handleToggleService = (index: number) => {
    if (services && !isAppointmentCompleted) {
      const updated = [...services];
      updated[index].checked = !updated[index].checked;
      setServices(updated);
    }
  };

  const handleSubmit = async () => {
    if (!appointmentDetails || !services) {
      setFeedback("No appointment or services to submit.");
      setFeedbackType("error");
      return;
    }

    // Check if at least one service is selected
    const selectedServices = services.filter((service) => service.checked);
    if (selectedServices.length === 0) {
      setFeedback("Please select at least one service to complete.");
      setFeedbackType("error");
      return;
    }

    setLoading(true);
    setFeedback("");

    try {
      const vehicleId = appointmentDetails.vehicleId;
      const serviceCenterId = appointmentDetails.serviceCenterId;
      const servicedByUserId = getCurrentUserId();
      const serviceDate = new Date().toISOString();

      // Check if we have valid vehicle and service center IDs
      if (!vehicleId || vehicleId === 0) {
        setFeedback(
          "Cannot complete appointment: Vehicle information not available."
        );
        setFeedbackType("error");
        setLoading(false);
        return;
      }

      // Step 1: Add selected services to AppointmentServices table
      const serviceNames = selectedServices.map((s) => s.service);
      try {
        await addServicesToAppointment(
          appointmentDetails.appointmentId,
          serviceNames
        );
      } catch (appointmentServiceError) {
        console.error(
          "Error adding services to appointment:",
          appointmentServiceError
        );
        // Continue even if this fails - we still want to create service history
      }

      // Step 2: Create service history records for completed services
      for (const service of selectedServices) {
        try {
          await addServiceHistory(vehicleId, {
            serviceType: service.service,
            description: "Completed as per appointment",
            serviceCenterId,
            servicedByUserId,
            serviceDate,
            cost: service.price || 0,
            mileage: undefined, // TODO: Add real mileage if available
          });
        } catch (serviceError) {
          console.error(
            `Error adding service history for ${service.service}:`,
            serviceError
          );
          throw new Error(
            `Failed to add service history for ${service.service}: ${
              serviceError instanceof Error
                ? serviceError.message
                : "Unknown error"
            }`
          );
        }
      }

      // Step 3: Mark appointment as "Completed" using the backend endpoint
      await completeAppointment(appointmentDetails.appointmentId);

      setFeedback(
        "Appointment completed successfully! Service history has been created and the appointment is marked as completed."
      );
      setFeedbackType("success");

      // Update appointment details to reflect completed status
      setAppointmentDetails({
        ...appointmentDetails,
        status: "Completed",
      });

      // Clear services and appointment ID
      setServices(null);
      setAppointmentId("");
    } catch (error) {
      console.error("Error completing appointment:", error);

      // More detailed error logging to help debug the issue
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }

      // Check if it's an API error with response details
      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as {
          response?: {
            status?: number;
            data?: { message?: string; error?: string };
          };
        };
        console.error("API Error Status:", apiError.response?.status);
        console.error("API Error Data:", apiError.response?.data);
        console.error(
          "API Error Message:",
          apiError.response?.data?.message || apiError.response?.data?.error
        );
      }

      setFeedback("Error completing appointment. Please try again.");
      setFeedbackType("error");
    } finally {
      setLoading(false);
    }
  };

  // Calculate total cost
  const totalCost = (services || [])
    .filter((s) => s.checked)
    .reduce((sum, s) => sum + (s.price || 0), 0);

  // Calculate selected services count
  const selectedServicesCount = (services || []).filter(
    (s) => s.checked
  ).length;

  return (
    <div className="flex flex-col min-h-screen p-8 bg-white">
      <div className="flex justify-between items-center mb-10">
        <div className="flex justify-between items-center mb-[8px]">
          <h1 className="h2 text-gray-800">Appointment Service Status</h1>
        </div>
        <UserProfileCard
          pictureSrc="/images/profipic.jpg"
          pictureAlt="User Profile"
          useCurrentUser={true}
          onLogout={() => {
            deleteAllAuthCookies();
            router.push("/login");
          }}
        />
      </div>

      {/* Appointment Search */}
      <div className="flex justify-start mb-[36px]">
        <AppointmentSearch
          appointmentId={appointmentId}
          setAppointmentId={setAppointmentId}
          onSearch={handleSearch}
        />
      </div>

      {feedback && (
        <div
          className={`mb-4 p-3 rounded ${
            feedbackType === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {feedback}
        </div>
      )}

      {/* Completed Appointment Notice */}
      {isAppointmentCompleted && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Appointment Completed
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  This appointment has already been completed. You can view the
                  services that were performed below.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Basic Appointment Information Notice */}
      {appointmentDetails && appointmentDetails.licensePlate === "N/A" && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Limited Appointment Information
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Some appointment details are not available due to backend
                  limitations. You can still add services and complete the
                  appointment.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Type Dropdown - Only show for non-completed appointments */}
      {services !== null && !isAppointmentCompleted && (
        <>
          <div className="mb-4">
            <label className="block text-md text-neutral-500 mb-2">
              Service Type
            </label>
            <div className="flex items-center w-[496px] h-[62px] mb-[16px]">
              <select
                value={newServiceId}
                onChange={(e) => setNewServiceId(e.target.value)}
                className="w-full p-3 rounded-md border bg-blue-50 text-neutral-500 mb-6"
              >
                <option value="">Select a service</option>
                {availableServices.map((svc) => (
                  <option
                    key={svc.serviceCenterServiceId}
                    value={svc.serviceCenterServiceId}
                  >
                    {svc.serviceName} (
                    {svc.customPrice ?? svc.serviceBasePrice ?? 0} LKR)
                  </option>
                ))}
              </select>
            </div>
            <div
              onClick={handleAddService}
              className="border-2 border-dotted border-blue-400 rounded-md p-[12px] mb-[24px] flex justify-center text-blue-500 text-xl cursor-pointer"
            >
              + Add Service
            </div>
          </div>
        </>
      )}

      {/* Services Table */}
      {services !== null && (
        <>
          <div className="flex flex-col gap-[72px] pr-[38px]">
            <div>
              <h2 className="text-lg text-neutral-800 mb-[24px]">
                {isAppointmentCompleted ? "Completed Services" : "Services"}
              </h2>
              <ServiceStatusDataTable
                data={services}
                onToggle={handleToggleService}
                showPrice={true}
              />
            </div>

            {/* Total and Submit - Only show for non-completed appointments */}
            {!isAppointmentCompleted && (
              <div className="flex flex-col items-end gap-4">
                <div className="text-sm text-neutral-600 mb-2">
                  Selected: {selectedServicesCount} of {services.length}{" "}
                  services
                </div>
                <div className="text-lg font-semibold text-neutral-700">
                  Total: {totalCost} LKR
                </div>
                <Button
                  variant="primary"
                  size="large"
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={loading || selectedServicesCount === 0}
                >
                  {loading ? "Processing..." : "Submit & Complete Appointment"}
                </Button>
              </div>
            )}

            {/* Completed appointment summary */}
            {isAppointmentCompleted && (
              <div className="flex flex-col items-end gap-4">
                <div className="text-sm text-neutral-600 mb-2">
                  Completed: {services.length} services
                </div>
                <div className="text-lg font-semibold text-neutral-700">
                  Total: {totalCost} LKR
                </div>
                <div className="text-sm text-green-600 font-medium">
                  ✓ Appointment completed successfully
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
