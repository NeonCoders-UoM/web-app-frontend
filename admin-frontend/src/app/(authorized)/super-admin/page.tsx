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

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, serviceCentersData] = await Promise.all([
          fetchDashboardStats(),
          fetchServiceCenters(),
        ]);
        console.log("Fetched service centers in SuperAdminDashboard:", serviceCentersData);
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

  const data = serviceCenters.map((sc) => [
    sc.id,
    sc.serviceCenterName,
    sc.email,
    sc.telephoneNumber,
    sc.address,
  ]);

  const headers = [
    { title: "ID", sortable: false },
    { title: "Name", sortable: false },
    { title: "Email", sortable: false },
    { title: "Phone", sortable: false },
    { title: "Address", sortable: false },
  ];

  const actions: ("edit" | "delete" | "view" | "loyaltyPoints")[] = ["edit", "delete", "view"];

  const handleEdit = (id: string) => {
    console.log("Navigating to:", `/service-centers/${id}/edit`);
    router.push(`/service-centers/${id}/edit`);
  };

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

  const handleView = (id: string) => {
    console.log("Navigating to:", `/service-centers/${id}/view`);
    router.push(`/service-centers/${id}/view`);
  };

  const handleServiceCenterClick = (id: string) => {
    router.push(`/service-centers/${id}/admin`);
  };

  const handleAction = (action: string, row: string[]) => {
    console.log("handleAction called with:", { action, row });
    const id = row[0];
    console.log("Extracted ID:", id);
    const actionMap: Record<string, string> = {
      Edit: "edit",
      Delete: "delete",
      View: "view",
      "Loyalty Points": "loyaltyPoints",
    };
    const actionType = actionMap[action];
    console.log("Mapped actionType:", actionType);
    if (actionType === "edit") handleEdit(id);
    if (actionType === "delete") handleDelete(id);
    if (actionType === "view") handleView(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
        <UserProfileCard
          pictureSrc="/images/profipic.jpg"
          pictureAlt="Moni Roy"
          name="Moni Roy"
          role="super-admin"
          onLogout={() => router.push("/login")} // Updated for consistency
          onProfileClick={() => router.push("/profile")} // Updated for consistency
          onSettingsClick={() => router.push("/settings")} // Updated for consistency
        />
      </div>

      <div className="flex justify-center gap-16 mb-8">
        <StatusCard title="Customers" value={stats?.customers || 0} icon="customers" />
        <StatusCard title="Vehicles" value={stats?.vehicles || 0} icon="vehicles" />
        <StatusCard title="Service Centers" value={stats?.serviceCenters || 0} icon="serviceCenters" />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-neutral-900">Service Centers</h2>
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

        <Table
          headers={headers}
          data={data}
          actions={actions}
          showSearchBar={true}
          onAction={handleAction}
          onServiceCenterClick={handleServiceCenterClick}
        />
      </div>
    </div>
  );
};

export default SuperAdminDashboard;