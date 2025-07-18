"use client";

import React, { useState, useEffect, useRef } from "react";
import AppointmentTable from "@/components/organism/appointment-table/appointment-table";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import AppointmentCard from "@/components/molecules/appoinment-cards/appoinment-cards"; 
import "@/styles/fonts.css";

// Proper type for Appointment
type AppointmentSummary = {
  id: string;
  name: string;
  date: string;
};

type AppointmentDetail = {
  appointmentId: string;
  owner: string;
  licensePlate: string;
  date: string;
  vehicle: string;
  services: string[];
};

const AppointmentsPage = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalRef = useRef<HTMLDivElement | null>(null);

  const appointments: AppointmentSummary[] = [
    { id: "#APT-0001", name: "Devon Lane", date: "12-05-2025" },
    { id: "#APT-0002", name: "Devon Lane", date: "12-05-2025" },
    { id: "#APT-0003", name: "Devon Lane", date: "12-05-2025" },
    { id: "#APT-0004", name: "Devon Lane", date: "12-05-2025" },
    { id: "#APT-0005", name: "Devon Lane", date: "12-05-2025" },
    { id: "#APT-0006", name: "Devon Lane", date: "12-05-2025" },
    { id: "#APT-0007", name: "Devon Lane", date: "12-05-2025" },
  ];

  const handleViewAppointment = (appointment: AppointmentSummary) => {
    setSelectedAppointment({
      appointmentId: appointment.id,
      owner: appointment.name,
      licensePlate: "ABC-1234",
      date: appointment.date,
      vehicle: "Toyota Prius 2021",
      services: ["Oil Change", "Tire Rotation"],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  // Close modal when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          closeModal();
        }
      };
  
      if (isModalOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isModalOpen]);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Main Content */}
      <div className="flex-1 p-[58px]">
        {/* Header with user profile */}
        <div className="flex justify-end items-center mb-[80px]">
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
        
        <div className="pr-[50px]">
          <h1 className="h2 text-neutral-800 mb-[40px]">Appointments Requests</h1>

          <AppointmentTable
            data={appointments}
            onView={handleViewAppointment}
          />
        </div>
        
        {/* Appointment Modal Popup */}
        {isModalOpen && selectedAppointment && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div ref={modalRef} className="relative">
              <AppointmentCard
                appointmentId={selectedAppointment.appointmentId}
                owner={selectedAppointment.owner}
                licensePlate={selectedAppointment.licensePlate}
                date={selectedAppointment.date}
                vehicle={selectedAppointment.vehicle}
                services={selectedAppointment.services}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;