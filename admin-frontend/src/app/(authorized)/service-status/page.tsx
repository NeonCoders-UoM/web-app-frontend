"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ServiceStatusDataTable } from "@/components/organism/service-status-data-table/servise-status-data-table";
import AppointmentSearch from "@/components/organism/search-filter-form/search-filter-form";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import Button from "@/components/atoms/button/button";
import { addServiceHistory } from "@/utils/api";

// Define a type for appointment details (customize as needed)
type AppointmentDetail = {
  vehicleId: number;
  serviceCenterId: number;
  serviceCenterName?: string;
  services: string[];
};

type RowData = {
  service: string;
  checked: boolean;
  serviceCenter: string;
};

export default function Page() {
  const [appointmentId, setAppointmentId] = useState("");
  const [services, setServices] = useState<RowData[] | null>(null);
  const [newServiceName, setNewServiceName] = useState("");
  const [appointmentDetails, setAppointmentDetails] =
    useState<AppointmentDetail | null>(null); // Holds vehicleId, serviceCenterId, etc.
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const serviceCenterId = searchParams.get("serviceCenterId");

  // If no serviceCenterId, show error and do not render the rest of the page
  if (!serviceCenterId) {
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
      const stationId = serviceCenterId ? parseInt(serviceCenterId) : undefined;
      if (!stationId) {
        setFeedback("No service center selected.");
        setLoading(false);
        return;
      }
      const res = await fetch(
        `/api/Appointment/station/${stationId}/details/${trimmedId}`
      );
      if (!res.ok) throw new Error("Appointment not found");
      const data = (await res.json()) as AppointmentDetail;
      setAppointmentDetails(data);
      setServices(
        (data.services || []).map((service: string) => ({
          service,
          checked: true,
          serviceCenter: data.serviceCenterName || "",
        }))
      );
    } catch {
      setServices([]);
      setAppointmentDetails(null);
      setFeedback("Appointment not found or error fetching details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = () => {
    if (!newServiceName.trim() || services === null) return;
    const newService: RowData = {
      service: newServiceName.trim(),
      checked: false,
      serviceCenter: appointmentDetails?.serviceCenterName || "", // Use real service center if available
    };
    setServices((prev) => [...(prev || []), newService]);
    setNewServiceName("");
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
            cost: 0, // TODO: Add real cost if available
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

      {/* Services Section */}
      {services !== null && (
        <div className="flex flex-col gap-[72px] pr-[38px]">
          <div>
            <h2 className="text-lg text-neutral-800 mb-[24px]">Services</h2>
            <p className="text-md text-neutral-500 mb-[8px] ">Service Type</p>
            <div className="flex items-center w-[496px] h-[62px] mb-[16px]">
              <input
                type="text"
                placeholder="Service Type"
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
                className="w-full p-3 rounded-md border bg-blue-50 text-neutral-500 mb-6"
              />
            </div>
            <div
              onClick={handleAddService}
              className="border-2 border-dotted border-blue-400 rounded-md p-[12px] mb-[24px] flex justify-center text-blue-500 text-xl cursor-pointer"
            >
              + Add Service
            </div>
            <ServiceStatusDataTable
              data={services}
              onToggle={handleToggleService}
            />
          </div>
          <div>
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
      )}
    </div>
  );
}
