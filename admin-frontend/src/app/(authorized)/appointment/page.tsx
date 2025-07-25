"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import AppointmentTable from "@/components/organism/appointment-table/appointment-table";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import AppointmentCard from "@/components/molecules/appoinment-cards/appoinment-cards";
import {
  fetchServiceCenterById,
  updateAppointmentStatus,
  fetchAppointmentsForStation,
} from "@/utils/api";
import { ServiceCenter } from "@/types";
import type { AppointmentDetail } from "@/utils/api";
import { fetchServiceCenterServices, fetchAppointmentDetail } from "@/utils/api";
import "@/styles/fonts.css";

// Types matching backend DTOs
// Appointment summary for admin
// { appointmentId, ownerName, appointmentDate }
type AppointmentSummary = {
  appointmentId: number;
  ownerName: string;
  appointmentDate: string;
};

// Table expects this type:
type TableAppointment = {
  id: string;
  name: string;
  date: string;
};

type ServiceWithPrice = { name: string; price: number };

const AppointmentsPage = () => {
  const searchParams = useSearchParams();
  const stationId = searchParams.get("stationId");
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
  const [availableServices, setAvailableServices] = useState<any[]>([]);
  const [servicesWithPrices, setServicesWithPrices] = useState<ServiceWithPrice[]>([]);

  // Fetch service center details
  useEffect(() => {
    const loadServiceCenter = async () => {
      if (stationId) {
        try {
          const serviceCenterData = await fetchServiceCenterById(stationId);
          setServiceCenter(serviceCenterData);
        } catch (error) {
          // Not critical for appointments, so just log
          console.error("Error fetching service center:", error);
        }
      }
    };
    loadServiceCenter();
  }, [stationId]);

  // Fetch appointments for the service center
  useEffect(() => {
    const fetchAppointments = async () => {
      if (stationId) {
        setAppointmentsLoading(true);
        setAppointmentsError(null);
        try {
          const data = await fetchAppointmentsForStation(stationId);
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
  }, [stationId]);

  // Fetch available services for the service center
  useEffect(() => {
    if (stationId) {
      fetchServiceCenterServices(stationId).then(setAvailableServices);
    }
  }, [stationId]);

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
    if (!stationId) return;
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
      // Ensure availableServices are loaded
      let servicesList = availableServices;
      if (!servicesList.length) {
        servicesList = await fetchServiceCenterServices(stationId);
        setAvailableServices(servicesList);
      }

      const data = await fetchAppointmentDetail(stationId, summary.appointmentId);

      // Add prices to services
      const servicesWithPrices = (data.services || []).map((service: string) => {
        const svc = servicesList.find((s: any) => s.serviceName === service);
        return {
          name: service,
          price: svc ? (svc.customPrice ?? svc.serviceBasePrice ?? 0) : 0,
        };
      });
      setServicesWithPrices(servicesWithPrices);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8 overflow-x-hidden">
      {/* Main Content */}
      <div className="max-w-full mx-auto w-full">
        {/* Header with user profile */}
        <div className="flex justify-end items-center mb-10">
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

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-white/80 overflow-x-auto p-6">
          <h1 className="h2 text-neutral-800 mb-[40px]">
            {stationId
              ? `Appointments - Service Center ${
                  serviceCenter?.serviceCenterName || stationId
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
                  servicesWithPrices={servicesWithPrices}
                  onAccept={async () => {
                    try {
                      await updateAppointmentStatus(
                        selectedAppointment.appointmentId,
                        "Accepted"
                      );
                      closeModal();
                      // Refresh appointments
                      if (stationId) {
                        setAppointmentsLoading(true);
                        const data = await fetchAppointmentsForStation(
                          stationId
                        );
                        setAppointments(data);
                        setAppointmentsLoading(false);
                      }
                    } catch {
                      alert("Failed to accept appointment");
                    }
                  }}
                  onReject={async () => {
                    try {
                      await updateAppointmentStatus(
                        selectedAppointment.appointmentId,
                        "Rejected"
                      );
                      closeModal();
                      // Refresh appointments
                      if (stationId) {
                        setAppointmentsLoading(true);
                        const data = await fetchAppointmentsForStation(
                          stationId
                        );
                        setAppointments(data);
                        setAppointmentsLoading(false);
                      }
                    } catch {
                      alert("Failed to reject appointment");
                    }
                  }}
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
