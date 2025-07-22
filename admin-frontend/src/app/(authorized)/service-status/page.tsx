"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ServiceStatusDataTable } from "@/components/organism/service-status-data-table/servise-status-data-table";
import AppointmentSearch from "@/components/organism/search-filter-form/search-filter-form";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import Button from "@/components/atoms/button/button";
import { addServiceHistory, fetchAppointmentDetail, fetchServiceCenterServices } from "@/utils/api";

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
  const [appointmentId, setAppointmentId] = useState("");
  const [services, setServices] = useState<RowData[] | null>(null);
  const [newServiceId, setNewServiceId] = useState<string>("");
  const [availableServices, setAvailableServices] = useState<AvailableService[]>([]);
  const [appointmentDetails, setAppointmentDetails] =
    useState<AppointmentDetail | null>(null); // Holds vehicleId, serviceCenterId, etc.
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const stationId = searchParams.get("stationId");

  // Fetch available services for the service center
  useEffect(() => {
    const fetchServices = async () => {
      if (!stationId) return;
      try {
        const data = await fetchServiceCenterServices(stationId);
        setAvailableServices(data.map((svc: any) => ({
          serviceCenterServiceId: svc.serviceCenterServiceId,
          serviceName: svc.serviceName,
          customPrice: svc.customPrice,
          serviceBasePrice: svc.serviceBasePrice,
        })));
      } catch (e) {
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
      const userId = localStorage.getItem("userId");
      return userId ? parseInt(userId) : undefined;
    }
    return undefined;
  };

  // Fetch appointment details from backend
  const handleSearch = async () => {
    setFeedback(null);
    setLoading(true);
    try {
      const trimmedId = appointmentId.replace("#APT-", "").replace(/^0+/, "");
      const stationIdNum = stationId ? parseInt(stationId) : undefined;
      if (!stationIdNum) {
        setFeedback("No service center selected.");
        setLoading(false);
        return;
      }
      const data = await fetchAppointmentDetail(stationIdNum, trimmedId);
      console.log("Fetched appointment details:", data);
      setAppointmentDetails(data);
      setServices(
        (data.services || []).map((service: string) => {
          const svc = availableServices.find(s => s.serviceName === service);
          return {
            service,
            checked: true,
            serviceCenter: data.serviceCenterName || "",
            price: svc ? (svc.customPrice ?? svc.serviceBasePrice ?? 0) : 0
          };
        })
      );
    } catch {
      setServices([]);
      setAppointmentDetails(null);
      setFeedback("Appointment not found or error fetching details.");
    } finally {
      setLoading(false);
    }
  };

  // Add service from dropdown
  const handleAddService = () => {
    if (!newServiceId || services === null) return;
    const svc = availableServices.find(s => s.serviceCenterServiceId.toString() === newServiceId);
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
    if (services) {
      const updated = [...services];
      updated[index].checked = !updated[index].checked;
      setServices(updated);
    }
  };

  const handleSubmit = async () => {
    setFeedback(null);
    if (!services || !appointmentDetails) {
      setFeedback("No appointment or services to submit.");
      return;
    }
    setLoading(true);
    try {
      const vehicleId = appointmentDetails.vehicleId;
      const serviceCenterId = appointmentDetails.serviceCenterId;
      const servicedByUserId = getCurrentUserId();
      const serviceDate = new Date().toISOString();
      for (const service of services) {
        if (service.checked) {
          await addServiceHistory(vehicleId, {
            serviceType: service.service,
            description: "Completed as per appointment",
            serviceCenterId,
            servicedByUserId,
            serviceDate,
            cost: service.price || 0, // TODO: Add real cost if available
            mileage: undefined, // TODO: Add real mileage if available
          });
        }
      }
      setFeedback("Service history updated successfully.");
    } catch {
      setFeedback("Error saving service history.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate total cost
  const totalCost = (services || []).filter(s => s.checked).reduce((sum, s) => sum + (s.price || 0), 0);

  return (
    <div className="flex flex-col min-h-screen p-[58px] bg-white">
      <div className="flex justify-end items-center mb-[74px]">
        <UserProfileCard
          pictureSrc="/images/profipic.jpg"
          pictureAlt="Moni Roy"
          name="Moni Roy"
          role="admin"
          onLogout={() => console.log("Logout clicked")}
          onProfileClick={() => console.log("Profile clicked")}
          onSettingsClick={() => console.log("Settings clicked")}
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
            feedback.includes("success")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {feedback}
        </div>
      )}

      {/* Service Type Dropdown */}
      {services !== null && (
        <>
          <div className="mb-4">
            <label className="block text-md text-neutral-500 mb-2">Service Type</label>
            <div className="flex items-center w-[496px] h-[62px] mb-[16px]">
              <select
                value={newServiceId}
                onChange={e => setNewServiceId(e.target.value)}
                className="w-full p-3 rounded-md border bg-blue-50 text-neutral-500 mb-6"
              >
                <option value="">Select a service</option>
                {availableServices.map(svc => (
                  <option key={svc.serviceCenterServiceId} value={svc.serviceCenterServiceId}>
                    {svc.serviceName} ({svc.customPrice ?? svc.serviceBasePrice ?? 0} LKR)
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

          {/* Services Table */}
          <div className="flex flex-col gap-[72px] pr-[38px]">
            <div>
              <h2 className="text-lg text-neutral-800 mb-[24px]">Services</h2>
              <ServiceStatusDataTable
                data={services}
                onToggle={handleToggleService}
                showPrice={true}
              />
            </div>
            {/* Total and Submit */}
            <div className="flex flex-col items-end gap-4">
              <div className="text-lg font-semibold text-neutral-700">
                Total: {totalCost} LKR
              </div>
              <Button
                variant="primary"
                size="large"
                className="w-full"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Saving..." : "Submit"}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
