"use client";

import { useState } from "react";
import { ServiceStatusDataTable } from "@/components/organism/service-status-data-table/servise-status-data-table";
import AppointmentSearch from "@/components/organism/search-filter-form/search-filter-form";
import UserProfileCard from "@/components/molecules/user-card/user-card";

type RowData = {
  service: string;
  checked: boolean;
  serviceCenter: string;
};

export default function Page() {
  const [appointmentId, setAppointmentId] = useState("");
  const [services, setServices] = useState<RowData[] | null>(null);
  const [newServiceName, setNewServiceName] = useState("");

  const handleSearch = () => {
    if (appointmentId.trim() === "#APT-0002") {
      setServices([
        { service: "Tire Rotation", checked: true, serviceCenter: "Speed Motors" },
        { service: "Oil Filter Change", checked: true, serviceCenter: "Speed Motors" },
        { service: "Engine Check", checked: true, serviceCenter: "Speed Motors" },
        { service: "Wheel Alignments", checked: true, serviceCenter: "Speed Motors" },
      ]);
    } else {
      setServices([]);
    }
  };

  const handleAddService = () => {
    if (!newServiceName.trim() || services === null) return;

    const newService: RowData = {
      service: newServiceName.trim(),
      checked: false,
      serviceCenter: "Speed Motors", // Or you can let user choose later
    };

    setServices(prev => [...(prev || []), newService]);
    setNewServiceName(""); // clear input after adding
  };

  const handleToggleService = (index: number) => {
    if (services) {
      const updated = [...services];
      updated[index].checked = !updated[index].checked;
      setServices(updated);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6 md:p-10 bg-white">
      <div className="flex justify-end items-center mb-8">
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
      <div className="flex justify-center mb-10">
        <AppointmentSearch
          appointmentId={appointmentId}
          setAppointmentId={setAppointmentId}
          onSearch={handleSearch}
        />
      </div>

      {/* Services Section */}
      {services !== null && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-700 mb-4">Services</h2>

            <input
              type="text"
              placeholder="Service Type"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              className="w-full p-3 rounded-md border bg-blue-50 text-neutral-500 mb-6"
            />

            <div
              onClick={handleAddService}
              className="border-2 border-dashed border-blue-400 rounded-md p-4 mb-6 flex justify-center text-blue-500 font-semibold cursor-pointer"
            >
              + Add Service
            </div>

            <ServiceStatusDataTable data={services} onToggle={handleToggleService} />
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md self-center w-full">
            Submit
          </button>
        </div>
      )}
    </div>
  );
}