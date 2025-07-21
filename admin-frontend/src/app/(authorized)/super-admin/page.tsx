// src/app/pages/super-admin-dashboard
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import Button from "@/components/atoms/button/button";
import StatusCard from "@/components/atoms/status-cards/status-card";
import Table from "@/components/organism/table/table";
import {
  fetchDashboardStats,
  fetchServiceCenters,
  deleteServiceCenter,
  checkAllServiceCentersAvailability,
} from "@/utils/api";
import { ServiceCenter, DashboardStats } from "@/types";

const SuperAdminDashboard: React.FC = () => {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>([]);
  const [availabilityMap, setAvailabilityMap] = useState<Map<string, { isAvailable: boolean; reason?: string }>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, serviceCentersData, availabilityData] = await Promise.all([
          fetchDashboardStats(),
          fetchServiceCenters(),
          checkAllServiceCentersAvailability(),
        ]);
        console.log(
          "Fetched service centers in SuperAdminDashboard:",
          serviceCentersData
        );
        console.log("Service centers availability:", availabilityData);
        setStats(statsData);
        setServiceCenters(serviceCentersData);
        setAvailabilityMap(availabilityData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        alert("Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Refresh availability when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!document.hidden) {
        try {
          const availabilityData = await checkAllServiceCentersAvailability();
          setAvailabilityMap(availabilityData);
        } catch (error) {
          console.error("Error refreshing availability:", error);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const data = serviceCenters.map((sc) => {
    console.log("Mapping service center to table data:", sc);
    const availability = availabilityMap.get(sc.id);
    const availabilityStatus = availability?.isAvailable ? "🟢 Available" : "🔴 Closed";
    const reason = availability?.reason ? ` (${availability.reason})` : "";
    
    const rowData = [
      sc.id,
      sc.serviceCenterName,
      sc.email,
      sc.telephoneNumber,
      sc.address,
      availabilityStatus + reason,
    ];
    console.log("Generated row data:", rowData);
    return rowData;
  });

  const headers = [
    { title: "ID", sortable: false },
    { title: "Name", sortable: false },
    { title: "Email", sortable: false },
    { title: "Phone", sortable: false },
    { title: "Address", sortable: false },
    { title: "Availability", sortable: false },
  ];

  const actions: ("edit" | "delete" | "view" | "loyaltyPoints")[] = [
    "edit",
    "delete",
    "view",
  ];

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
    console.log("Navigating to:", `/service-centers/${id}/admin-dashboard`);
    router.push(`/service-center-dashboard/${id}`);
  };

  const handleAction = (action: string, row: string[]) => {
    console.log("handleAction called with:", { action, row });
    const id = row[0];
    console.log("Extracted ID:", id);

    // Check if ID is valid
    if (!id || id.trim() === "") {
      console.error("Invalid ID for action:", id);
      alert("Unable to perform action: Invalid service center ID");
      return;
    }

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
    <div className="min-h-screen bg-white p-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex justify-end items-center mb-[32px]">
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

        <div className="px-4 md:px-8 lg:px-16 xl:px-32">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-[32px]">
          Dashboard
        </h1>
        
        {/* Availability Notice */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Service Center Availability
          </h3>
          <p className="text-blue-700 text-sm leading-relaxed">
            Availability status is based on closure schedules. Centers marked as "Closed" have scheduled closures for today.
            Use the closure schedule management to update availability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-[44px]">
          <StatusCard
            title="Customers"
            value={stats?.customers || 0}
            icon="customers"
          />
          <StatusCard
            title="Vehicles"
            value={stats?.vehicles || 0}
            icon="vehicles"
          />
          <StatusCard
            title="Service Centers"
            value={stats?.serviceCenters || 0}
            icon="serviceCenters"
          />
          <StatusCard
            title="Available Centers"
            value={Array.from(availabilityMap.values()).filter(av => av.isAvailable).length}
            icon="serviceCenters"
          />
        </div>

        <div>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-[32px]">
            <h2 className="text-xl font-semibold text-neutral-900">
              Service Centers
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="primary"
                size="medium"
                onClick={() => router.push("/service-centers/add")}
              >
                Add Service Center
              </Button>
              <Button
                variant="secondary"
                size="medium"
                onClick={() => router.push("/services")}
              >
                Manage Services
              </Button>
              <Button
                variant="secondary"
                size="medium"
                onClick={() => router.push("/packages")}
              >
                Manage Packages
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
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
