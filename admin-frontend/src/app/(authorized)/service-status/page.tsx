"use client";

import { useState } from "react";
import { ServiceStatusDataTable } from "@/components/organism/service-status-data-table/servise-status-data-table";
import AppointmentSearch from "@/components/organism/search-filter-form/search-filter-form";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import Button from "@/components/atoms/button/button"

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
    <div className="flex flex-col min-h-screen p-[58px] md:p-10 bg-white">
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

      {/* Services Section */}
      {services !== null && (
        <div className="flex flex-col gap-[72px] pr-[38px]">
          <div>
            <h2 className="text-lg text-neutral-800 mb-[24px]">Services</h2>

            <p className="text-md text-neutral-500 mb-[8px] ">
              Service Type
            </p>
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

            <ServiceStatusDataTable data={services} onToggle={handleToggleService} />
          </div>

          <div>
            <Button
              variant="primary"
              size="large"
              className="w-full"
              onClick={() => console.log("Saved", services)}
            >
              Submit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}