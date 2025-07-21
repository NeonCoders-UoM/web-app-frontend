"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import StatusCard from "@/components/atoms/status-cards/status-card";
import Table from "@/components/organism/table/table";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import {
  fetchServiceCenterById,
  fetchServiceCenterServices,
  fetchClients,
  fetchVehicles,
} from "@/utils/api";
import { ServiceCenter } from "@/types";
// import Sidebar from "@/components/molecules/side-bar/side-bar";
import "@/styles/fonts.css";

const ServiceCenterDashboard = () => {
  const params = useParams();
  const serviceCenterId = params.id as string;

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
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (!serviceCenterId) return;

    setIsLoading(true);
    try {
      // Fetch service center details
      const serviceCenterData = await fetchServiceCenterById(serviceCenterId);
      setServiceCenter(serviceCenterData);

      // Fetch services for this service center
      const servicesData = await fetchServiceCenterServices(serviceCenterId);

      // Fetch all clients and vehicles to calculate counts
      const [clientsData, vehiclesData] = await Promise.all([
        fetchClients(),
        fetchVehicles(),
      ]);

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

      // Filter services to only show available ones
      const availableServices = servicesData.filter(
        (service) => service.isAvailable
      );

      // Transform services data to table format (only available services)
      const servicesTableData = availableServices.map((service, index) => [
        service.serviceName || "Unknown Service",
        `${service.customPrice || 0} LKR`,
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
  };

  useEffect(() => {
    fetchData();
  }, [serviceCenterId]);

  // Refresh data when the page becomes visible (e.g., when returning from closure schedule)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && serviceCenterId) {
        fetchData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [serviceCenterId]);

  const tableHeaders = [
    { title: "Service Name", sortable: false },
    { title: "Price", sortable: false },
    { title: "Status", sortable: false },
    { title: "Service Center", sortable: false },
    { title: "Ranking", sortable: false },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
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
      <div className="flex-1 p-[58px]">
        {/* Header with user profile */}
        <div className="flex justify-end mb-[32px]">
          <UserProfileCard
            pictureSrc="/images/profipic.jpg"
            pictureAlt="Moni Roy"
            name="Moni Roy"
            role="super-admin"
            onLogout={() => console.log("Logout clicked")}
            onProfileClick={() => console.log("Profile clicked")}
            onSettingsClick={() => console.log("Settings clicked")}
          />
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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
            icon="serviceCenters"
          />
        </div>

        {/* Table Section */}
        <div className="bg-white ">
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
