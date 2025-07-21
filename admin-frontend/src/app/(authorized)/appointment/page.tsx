"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import AppointmentTable from "@/components/organism/appointment-table/appointment-table";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import AppointmentCard from "@/components/molecules/appoinment-cards/appoinment-cards";
import { fetchServiceCenterById } from "@/utils/api";
import { ServiceCenter } from "@/types";
import "@/styles/fonts.css";

// Types matching backend DTOs
// Appointment summary for admin
// { appointmentId, ownerName, appointmentDate }
type AppointmentSummary = {
  appointmentId: number;
  ownerName: string;
  appointmentDate: string;
};

// Appointment detail for admin
// { appointmentId, licensePlate, vehicleType, ownerName, appointmentDate, services }
type AppointmentDetail = {
  appointmentId: number;
  licensePlate: string;
  vehicleType: string;
  ownerName: string;
  appointmentDate: string;
  services: string[];
};

// Table expects this type:
type TableAppointment = {
  id: string;
  name: string;
  date: string;
};

const AppointmentsPage = () => {
  const searchParams = useSearchParams();
  const serviceCenterId = searchParams.get("serviceCenterId");
  const [serviceCenter, setServiceCenter] = useState<ServiceCenter | null>(
    null
  );
  const [appointments, setAppointments] = useState<AppointmentSummary[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState<string | null>(
    null
  );
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [tableAppointments, setTableAppointments] = useState<
    TableAppointment[]
  >([]);

  // Fetch service center details
  useEffect(() => {
    const loadServiceCenter = async () => {
      if (serviceCenterId) {
        try {
          const serviceCenterData = await fetchServiceCenterById(
            serviceCenterId
          );
          setServiceCenter(serviceCenterData);
        } catch (error) {
          // Not critical for appointments, so just log
          console.error("Error fetching service center:", error);
        }
      }
    };
    loadServiceCenter();
  }, [serviceCenterId]);

  // Fetch appointments for the service center
  useEffect(() => {
    const fetchAppointments = async () => {
      if (serviceCenterId) {
        setAppointmentsLoading(true);
        setAppointmentsError(null);
        try {
          const res = await fetch(
            `/api/Appointment/station/${serviceCenterId}`
          );
          if (!res.ok) throw new Error("Failed to fetch appointments");
          const data = await res.json();
          setAppointments(data);
        } catch (error: unknown) {
          setAppointmentsError(
            error instanceof Error ? error.message : "Unknown error"
          );
        } finally {
          setAppointmentsLoading(false);
        }
      }
    };
    fetchAppointments();
  }, [serviceCenterId]);

  // Map fetched appointments to table format
  useEffect(() => {
    if (appointments && Array.isArray(appointments)) {
      setTableAppointments(
        appointments.map((a) => ({
          id: a.appointmentId.toString(),
          name: a.ownerName,
          date: a.appointmentDate,
        }))
      );
    }
  }, [appointments]);

  // Accepts TableAppointment, finds AppointmentSummary, then fetches detail
  const handleViewAppointment = async (appointment: TableAppointment) => {
    if (!serviceCenterId) return;
    setDetailLoading(true);
    setDetailError(null);
    // Find the original summary by id
    const summary = appointments.find(
      (a) => a.appointmentId.toString() === appointment.id
    );
    if (!summary) {
      setDetailError("Appointment not found");
      setDetailLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `/api/Appointment/station/${serviceCenterId}/details/${summary.appointmentId}`
      );
      if (!res.ok) throw new Error("Failed to fetch appointment details");
      const data = await res.json();
      setSelectedAppointment(data);
      setIsModalOpen(true);
    } catch (error: unknown) {
      setDetailError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setDetailLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
    setDetailError(null);
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
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
          <h1 className="h2 text-neutral-800 mb-[40px]">
            {serviceCenterId
              ? `Appointments - Service Center ${
                  serviceCenter?.serviceCenterName || serviceCenterId
                }`
              : "Appointments Requests"}
          </h1>

          {appointmentsLoading ? (
            <div className="text-gray-500">Loading appointments...</div>
          ) : appointmentsError ? (
            <div className="text-red-500">{appointmentsError}</div>
          ) : (
            <AppointmentTable
              data={tableAppointments}
              onView={handleViewAppointment}
            />
          )}
        </div>

        {/* Appointment Modal Popup */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div ref={modalRef} className="relative">
              {detailLoading ? (
                <div className="bg-white p-8 rounded shadow text-gray-700">
                  Loading details...
                </div>
              ) : detailError ? (
                <div className="bg-white p-8 rounded shadow text-red-500">
                  {detailError}
                </div>
              ) : selectedAppointment ? (
                <AppointmentCard
                  appointmentId={selectedAppointment.appointmentId.toString()}
                  owner={selectedAppointment.ownerName}
                  licensePlate={selectedAppointment.licensePlate}
                  date={selectedAppointment.appointmentDate}
                  vehicle={selectedAppointment.vehicleType}
                  services={selectedAppointment.services}
                  onAccept={() =>
                    console.log(
                      `Accept clicked for appointment ${selectedAppointment.appointmentId}`
                    )
                  }
                  onReject={() =>
                    console.log(
                      `Reject clicked for appointment ${selectedAppointment.appointmentId}`
                    )
                  }
                />
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;
