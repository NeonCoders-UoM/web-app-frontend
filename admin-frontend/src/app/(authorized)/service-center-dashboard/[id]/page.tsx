"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Users } from "lucide-react";
import StatusCard from "@/components/atoms/status-cards/status-card";
import Table from "@/components/organism/table/table";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import { getCookie,deleteAllAuthCookies  } from "@/utils/cookies";
import {
  fetchServiceCenterById,
  fetchServiceCenterServices,
  fetchClients,
  fetchVehicles,
  getServicesWithAvailability,
  fetchAppointmentsForStation,
} from "@/utils/api";
import { ServiceCenter } from "@/types";
// import Sidebar from "@/components/molecules/side-bar/side-bar";


const ServiceCenterDashboard = () => {
  const params = useParams();
  const router = useRouter();
  const serviceCenterId = params.id as string;

  // Authorization check for different user roles
  useEffect(() => {
    const userRole = getCookie("userRole");
    const userStationId = getCookie("station_id");

    // Super Admin and Admin can access any service center
    if (userRole === "SuperAdmin" || userRole === "Admin") {
      // No restrictions - they can access any service center
      return;
    }

    // Service Center Admin, Cashier, and Data Operator can only access their assigned service center
    if (
      userRole === "ServiceCenterAdmin" ||
      userRole === "Cashier" ||
      userRole === "DataOperator"
    ) {
      if (userStationId && userStationId !== serviceCenterId) {
        console.warn(
          "Unauthorized access: User trying to access different service center"
        );
        router.push(`/service-center-dashboard/${userStationId}`);
        return;
      }
    } else {
      // If not authorized, redirect to login
      console.warn(
        "Unauthorized access: User is not authorized to access service centers"
      );
      router.push("/login");
      return;
    }
  }, [serviceCenterId, router]);

  const [serviceCenter, setServiceCenter] = useState<ServiceCenter | null>(
    null
  );
  const [dashboardData, setDashboardData] = useState({
    customers: 0,
    vehicles: 0,
    serviceCenters: 0,
  });

  const [leadingServices, setLeadingServices] = useState<string[][]>([]);
  const [availableServicesCount, setAvailableServicesCount] = useState(0);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isServiceCenterAdmin, setIsServiceCenterAdmin] = useState(false);

  // Check user role on client side only
  useEffect(() => {
    const userRole = getCookie("userRole");
    setIsServiceCenterAdmin(userRole === "ServiceCenterAdmin");
  }, []);

  const fetchData = useCallback(async () => {
    if (!serviceCenterId) return;

    setIsLoading(true);
    try {
      // Fetch service center details
      const serviceCenterData = await fetchServiceCenterById(serviceCenterId);
      setServiceCenter(serviceCenterData);

      // Fetch all services for this service center
      await fetchServiceCenterServices(serviceCenterId);

      // Get services with their current availability status (considering day-specific overrides)
      const servicesWithAvailability = await getServicesWithAvailability(
        parseInt(serviceCenterId),
        new Date()
      );

      // Fetch all clients and vehicles to calculate counts
      const [clientsData, vehiclesData] = await Promise.all([
        fetchClients(),
        fetchVehicles(),
      ]);

      // Fetch appointments for this service center
      let appointmentsData = [];
      try {
        appointmentsData = await fetchAppointmentsForStation(serviceCenterId);
        setAppointmentsCount(appointmentsData.length);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointmentsCount(0);
      }

      // Calculate counts for this service center
      // For now, we'll use the total counts since there's no direct relationship
      // In a real implementation, you'd filter by service center
      const customerCount = clientsData.length;
      const vehicleCount = vehiclesData.length;
      const serviceCenterCount = 1; // This service center

      setDashboardData({
        customers: customerCount,
        vehicles: vehicleCount,
        serviceCenters: serviceCenterCount,
      });

      // Filter services to only show currently available ones (considering day-specific overrides)
      const availableServices = servicesWithAvailability.filter(
        (item) => item.isAvailable
      );

      // Transform services data to table format (only currently available services)
      const servicesTableData = availableServices.map((item, index) => [
        item.service.serviceName || "Unknown Service",
        `${item.service.customPrice || 0} LKR`,
        "Available", // Since we're only showing available services
        serviceCenterData?.serviceCenterName || "Unknown Center",
        (index + 1).toString(),
      ]);

      setLeadingServices(servicesTableData);
      setAvailableServicesCount(availableServices.length);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Fallback to mock data if API fails
      const fallbackServices = [
        ["Engine Check", "60,000 LKR", "12-05-2025", "Service Center", "1"],
        ["Oil Change", "25,000 LKR", "12-05-2025", "Service Center", "2"],
        ["Brake Service", "45,000 LKR", "12-05-2025", "Service Center", "3"],
      ];
      setLeadingServices(fallbackServices);

      // Set fallback counts
      setDashboardData({
        customers: 150,
        vehicles: 75,
        serviceCenters: 1,
      });
    } finally {
      setIsLoading(false);
    }
  }, [serviceCenterId]);

  useEffect(() => {
    fetchData().catch((error) => {
      console.error("Error in fetchData useEffect:", error);
    });
  }, [serviceCenterId, fetchData]);

  // Refresh data when the page becomes visible (e.g., when returning from closure schedule)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && serviceCenterId) {
        fetchData().catch((error) => {
          console.error("Error in visibility change handler:", error);
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [serviceCenterId, fetchData]);

  const tableHeaders = [
    { title: "Service Name", sortable: false },
    { title: "Price", sortable: false },
    { title: "Status", sortable: false },
    { title: "Service Center", sortable: false },
    { title: "Ranking", sortable: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8 overflow-x-hidden">
      {/* Sidebar */}
      {/* <Sidebar
        role="super-admin"
        serviceCenters={
          serviceCenter
            ? [{ id: serviceCenterId, name: serviceCenter.serviceCenterName }]
            : []
        }
      /> */}

      {/* Main Content */}
      <div className="max-w-full mx-auto">
        {/* Header with user profile */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Service Center Dashboard</h1>
            <p className="text-gray-600">
              {serviceCenter?.serviceCenterName || "Service Center"}
            </p>
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

        {/* User Management Link (Only for Service Center Admin) */}
        {isServiceCenterAdmin && (
          <div className="mb-6">
            <button
              onClick={() => router.push(`/service-center-dashboard/${serviceCenterId}/users`)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
            >
              <Users className="w-5 h-5" />
              Manage Users
            </button>
          </div>
        )}

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatusCard
            title="Total Customers"
            value={dashboardData.customers}
            icon="customers"
          />
          <StatusCard
            title="Total Vehicles"
            value={dashboardData.vehicles}
            icon="vehicles"
          />
          <StatusCard
            title="Available Services"
            value={availableServicesCount}
            icon="availableCenters"
          />
          <StatusCard
            title="Appointments"
            value={appointmentsCount}
            icon="serviceCenters"
          />
        </div>

        {/* Table Section */}
        <div className="">
          <h2 className="text-xl font-semibold mb-4">
            Leading Services -{" "}
            {serviceCenter?.serviceCenterName || "Service Center"}
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-200"></div>
            </div>
          ) : (
            <Table
              headers={tableHeaders}
              data={leadingServices}
              showSearchBar={false}
              actions={[]}
              hideActions
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCenterDashboard;
