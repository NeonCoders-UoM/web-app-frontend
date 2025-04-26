// src/app/pages/super-admin-dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import Button from "@/components/atoms/button/button";
import StatusCard from "@/components/atoms/status-cards/status-card";
import Table from "@/components/organism/table/table";
import { fetchDashboardStats, fetchServiceCenters, deleteServiceCenter } from "@/utils/api";
import { ServiceCenter, DashboardStats } from "@/types";

const SuperAdminDashboard: React.FC = () => {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard stats and service centers on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, serviceCentersData] = await Promise.all([
          fetchDashboardStats(),
          fetchServiceCenters(),
        ]);
        setStats(statsData);
        setServiceCenters(serviceCentersData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        alert("Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Transform serviceCenters into string[][] for the Table component
  const data = serviceCenters.map((sc) => [
    sc.id,
    sc.serviceCenterName,
    sc.email,
    sc.telephoneNumber,
    sc.address,
  ]);

  // Define table headers
  const headers = [
    { title: "ID", sortable: false },
    { title: "Name", sortable: false },
    { title: "Email", sortable: false },
    { title: "Phone", sortable: false },
    { title: "Address", sortable: false },
  ];

  // Define actions for the kebab menu
  const actions: ("edit" | "delete" | "view" | "loyaltyPoints")[] = ["edit", "delete", "view"];

  // Handle Edit action
  const handleEdit = (id: string) => {
    router.push(`/service-centers/${id}/edit`);
  };

  // Handle Delete action
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service center?")) {
      try {
        await deleteServiceCenter(id);
        setServiceCenters((prev) => prev.filter((sc) => sc.id !== id));
        alert("Service Center deleted successfully!");
      } catch (error) {
        console.error("Error deleting service center:", error);
        alert("Failed to delete service center.");
      }
    }
  };

  // Handle View action
  const handleView = (id: string) => {
    router.push(`/service-centers/${id}/view`);
  };

  // Handle clicking on Service Center Name
  const handleServiceCenterClick = (id: string) => {
    router.push(`/service-centers/${id}/admin`);
  };

  // Handle kebab menu actions
  const handleAction = (action: string, row: string[]) => {
    const id = row[0]; // ID is the first column
    const actionMap: Record<string, string> = {
      Edit: "edit",
      Delete: "delete",
      View: "view",
      "Loyalty Points": "loyaltyPoints",
    };
    const actionType = actionMap[action];
    if (actionType === "edit") handleEdit(id);
    if (actionType === "delete") handleDelete(id);
    if (actionType === "view") handleView(id);
    // "loyaltyPoints" not used in this context
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
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

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatusCard title="Customers" value={stats?.customers || 0} icon="customers" />
        <StatusCard title="Vehicles" value={stats?.vehicles || 0} icon="vehicles" />
        <StatusCard title="Service Centers" value={stats?.serviceCenters || 0} icon="serviceCenters" />
      </div>

      {/* Service Centers Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Service Centers</h2>
          <div className="flex items-center space-x-4">
            <Button
              variant="primary"
              size="medium"
              onClick={() => router.push("/service-centers/add")}
            >
              Add Service Center
            </Button>
          </div>
        </div>

        {/* Service Centers Table */}
        <Table
          headers={headers}
          data={data}
          actions={actions}
          showSearchBar={true}
          onAction={handleAction}
          onServiceCenterClick={handleServiceCenterClick} // Pass the handler
        />
      </div>
    </div>
  );
};

export default SuperAdminDashboard;