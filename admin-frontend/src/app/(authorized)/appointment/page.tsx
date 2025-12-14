"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import AppointmentTable from "@/components/organism/appointment-table/appointment-table";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import AppointmentCard from "@/components/molecules/appoinment-cards/appoinment-cards";
import StatusCard from "@/components/atoms/status-cards/status-card";
import {
  fetchServiceCenterById,
  updateAppointmentStatus,
  fetchAppointmentsForStation,
} from "@/utils/api";
import { ServiceCenter, ServiceCenterServiceDTO } from "@/types";
import type { AppointmentDetail } from "@/utils/api";
import {
  fetchServiceCenterServices,
  fetchAppointmentDetail,
} from "@/utils/api";
import { useRouter } from "next/navigation";
import { deleteAllAuthCookies } from "@/utils/cookies";

export const dynamic = "force-dynamic";


// Types matching backend DTOs
// Appointment summary for admin
// { appointmentId, ownerName, appointmentDate, status }
type AppointmentSummary = {
  appointmentId: number;
  ownerName: string;
  appointmentDate: string;
  status?: string;
};

// Table expects this type:
type TableAppointment = {
  id: string;
  name: string;
  date: string;
  status?: string;
};

type ServiceWithPrice = { name: string; price: number };

const AppointmentsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stationId = searchParams.get("stationId");
  const [serviceCenter, setServiceCenter] = useState<ServiceCenter | null>(
    null
  );
  const [appointments, setAppointments] = useState<AppointmentSummary[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<AppointmentSummary[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<string>("All"); // All, Today, Tomorrow
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
  const [availableServices, setAvailableServices] = useState<
    ServiceCenterServiceDTO[]
  >([]);
  const [servicesWithPrices, setServicesWithPrices] = useState<
    ServiceWithPrice[]
  >([]);
  const [appointmentPrice, setAppointmentPrice] = useState<number>(0);

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
          setFilteredAppointments(data); // Initially show all
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

  // Helper function to check if date is today
  const isToday = (dateString: string) => {
    const today = new Date();
    const appointmentDate = new Date(dateString);
    return (
      appointmentDate.getDate() === today.getDate() &&
      appointmentDate.getMonth() === today.getMonth() &&
      appointmentDate.getFullYear() === today.getFullYear()
    );
  };

  // Helper function to check if date is tomorrow
  const isTomorrow = (dateString: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const appointmentDate = new Date(dateString);
    return (
      appointmentDate.getDate() === tomorrow.getDate() &&
      appointmentDate.getMonth() === tomorrow.getMonth() &&
      appointmentDate.getFullYear() === tomorrow.getFullYear()
    );
  };

  // Filter appointments based on selected status and date filter
  useEffect(() => {
    let filtered = appointments;

    // Apply status filter
    if (selectedFilter !== "All") {
      if (selectedFilter === "Payment_Pending") {
        filtered = filtered.filter(
          (apt) => apt.status === "Payment_Pending" || apt.status === "Pending"
        );
      } else {
        filtered = filtered.filter((apt) => apt.status === selectedFilter);
      }
    }

    // Apply date filter
    if (dateFilter === "Today") {
      filtered = filtered.filter((apt) => isToday(apt.appointmentDate));
    } else if (dateFilter === "Tomorrow") {
      filtered = filtered.filter((apt) => isTomorrow(apt.appointmentDate));
    }

    setFilteredAppointments(filtered);
  }, [selectedFilter, dateFilter, appointments]);

  // Fetch available services for the service center
  useEffect(() => {
    if (stationId) {
      fetchServiceCenterServices(stationId).then(setAvailableServices);
    }
  }, [stationId]);

  // Map fetched appointments to table format
  useEffect(() => {
    if (filteredAppointments && Array.isArray(filteredAppointments)) {
      setTableAppointments(
        filteredAppointments.map((a) => ({
          id: a.appointmentId.toString(),
          name: a.ownerName,
          date: a.appointmentDate,
          status: a.status || "Pending",
        }))
      );
    }
  }, [filteredAppointments]);

  // Calculate status counts
  const totalAppointments = appointments.length;
  const paymentPendingCount = appointments.filter(
    (apt) => apt.status === "Payment_Pending" || apt.status === "Pending"
  ).length;
  const confirmedCount = appointments.filter(
    (apt) => apt.status === "Confirmed"
  ).length;
  const completedCount = appointments.filter(
    (apt) => apt.status === "Completed"
  ).length;

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

      const data = await fetchAppointmentDetail(
        stationId,
        summary.appointmentId
      );

      // Add prices to services
      const servicesWithPrices = (data.services || []).map(
        (service: string) => {
          const svc = servicesList.find(
            (s: ServiceCenterServiceDTO) => s.serviceName === service
          );
          return {
            name: service,
            price: svc ? svc.customPrice ?? svc.serviceBasePrice ?? 0 : 0,
          };
        }
      );
      setServicesWithPrices(servicesWithPrices);

      // Calculate total appointment price - use backend price if available, otherwise calculate from services
      const totalPrice =
        data.appointmentPrice ||
        servicesWithPrices.reduce((sum, service) => sum + service.price, 0);
      setAppointmentPrice(totalPrice);

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
    setAppointmentPrice(0);
    setServicesWithPrices([]);
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
            pictureAlt="User Profile"
            useCurrentUser={true}
            onLogout={() => {
              deleteAllAuthCookies();
              router.push("/login");
            }}
          />
        </div>
        {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <StatusCard
          title="Totaly Appointments"
          value={totalAppointments}
          icon="customers"
          onClick={() => setSelectedFilter("All")}
        />
        <StatusCard
          title="Payment Pending Appointments"
          value={paymentPendingCount}
          icon="customers"
          onClick={() => setSelectedFilter("Payment_Pending")}
        />
        <StatusCard
          title="Confirmed Appointments"
          value={confirmedCount}
          icon="customers"
          onClick={() => setSelectedFilter("Confirmed")}
        />
        <StatusCard
          title="Completed Appointments"
          value={completedCount}
          icon="customers"
          onClick={() => setSelectedFilter("Completed")}
        />
      </div>

        <div className=" p-6">
          <h1 className="h2 text-neutral-800 mb-[20px]">
            {stationId
              ? `Appointments - Service Center ${
                  serviceCenter?.serviceCenterName || stationId
                }`
              : "Appointments Requests"}
          </h1>

          {/* Date Filter Buttons */}
          <div className="mb-[20px] flex gap-3">
            <button
              onClick={() => setDateFilter("All")}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                dateFilter === "All"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-blue-400 hover:text-blue-600"
              }`}
            >
              All Appointments
            </button>
            <button
              onClick={() => setDateFilter("Today")}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                dateFilter === "Today"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-blue-400 hover:text-blue-600"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDateFilter("Tomorrow")}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                dateFilter === "Tomorrow"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-blue-400 hover:text-blue-600"
              }`}
            >
              Tomorrow
            </button>
          </div>

          {/* Filter Status Indicator */}
          {selectedFilter !== "All" && (
            <div className="mb-[20px] p-[16px] bg-blue-50 border border-blue-200 rounded-[12px] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="text-blue-700 font-medium">
                  Showing: <span className="font-bold">{selectedFilter}</span> appointments
                </span>
              </div>
              <button
                onClick={() => setSelectedFilter("All")}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
              >
                Clear Filter
              </button>
            </div>
          )}

          {appointmentsLoading ? (
            <div className="text-gray-500">Loading appointments...</div>
          ) : appointmentsError ? (
            <div className="text-red-500">{appointmentsError}</div>
          ) : (
            <>
              {/* Price Display Section */}
              {appointmentPrice > 0 && (
                <div className="mb-[32px] p-[24px] bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-[16px] shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-green-800 mb-[4px]">
                        Selected Appointment Price
                      </h3>
                      <p className="text-sm text-green-600">
                        Total cost for the selected services
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-700">
                        LKR {appointmentPrice.toLocaleString()}
                      </div>
                      <div className="text-sm text-green-600 mt-[4px]">
                        {servicesWithPrices.length} service
                        {servicesWithPrices.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <AppointmentTable
                data={tableAppointments}
                onView={handleViewAppointment}
              />
            </>
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
                  appointmentPrice={appointmentPrice}
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
