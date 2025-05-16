"use client";

import { useState, useEffect } from "react";
import StatusCard from "@/components/atoms/status-cards/status-card";
import Table from "@/components/organism/table/table";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import "@/styles/fonts.css";

const ServiceCenterDashboard = () => {
  const [dashboardData] = useState({
    customers: 40689,
    vehicles: 10293,
    serviceCenters: 2040,
  });

  const [leadingServices, setLeadingServices] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const services = [
          ["Engine Check", "60,000 LKR", "12-05-2025", "DGFHFRJ Enterprises", "1"],
          ["Engine Check", "60,000 LKR", "12-05-2025", "DGFHFRJ Enterprises", "2"],
          ["Engine Check", "60,000 LKR", "12-05-2025", "DGFHFRJ Enterprises", "3"],
          ["Engine Check", "60,000 LKR", "12-05-2025", "DGFHFRJ Enterprises", "4"],
          ["Engine Check", "60,000 LKR", "12-05-2025", "DGFHFRJ Enterprises", "5"],
          ["Engine Check", "60,000 LKR", "12-05-2025", "DGFHFRJ Enterprises", "6"],
        ];

        setLeadingServices(services);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const tableHeaders = [
    { title: "Name", sortable: false },
    { title: "Price", sortable: false },
    { title: "Effective to", sortable: false },
    { title: "Add Another", sortable: false },
    { title: "Ranking", sortable: false },
  ];

  return (
    <div className="min-h-screen bg-white p-[58px]">
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
        <StatusCard title="Customers" value={dashboardData.customers} icon="customers" />
        <StatusCard title="Vehicles" value={dashboardData.vehicles} icon="vehicles" />
        <StatusCard title="Appointments" value={dashboardData.serviceCenters} icon="serviceCenters" />
      </div>

      {/* Table Section */}
      <div className="bg-white ">
        <h2 className="text-xl font-semibold mb-4">Leading Services</h2>
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
  );
};

export default ServiceCenterDashboard;
