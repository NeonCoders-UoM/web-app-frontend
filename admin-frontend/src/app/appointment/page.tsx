"use client";

import React, { useState } from "react";
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header with user profile */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="h2 text-neutral-600">Appointments</h1>

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

        {/* Client Table */}
        <AppointmentTable
          data={appointments}
          onView={handleViewAppointment}
        />

        {/* Appointment Modal Popup */}
        {isModalOpen && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-neutral-100 rounded-lg p-6 relative w-full max-w-md">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={handleCloseModal}
              >
                ✕
              </button>
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