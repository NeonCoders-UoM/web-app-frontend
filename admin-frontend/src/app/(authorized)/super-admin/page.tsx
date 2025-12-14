// src/app/pages/super-admin-dashboard
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import Button from "@/components/atoms/button/button";
import StatusCard from "@/components/atoms/status-cards/status-card";
import Table from "@/components/organism/table/table";
import Sidebar from "@/components/molecules/side-bar/side-bar";
import { deleteAllAuthCookies } from "@/utils/cookies";
import {
  fetchDashboardStats,
  fetchServiceCenters,
  deleteServiceCenter,
  checkAllServiceCentersAvailability,
} from "@/utils/api";
import { ServiceCenter, DashboardStats } from "@/types";

export const dynamic = "force-dynamic";

const SuperAdminDashboard: React.FC = () => {
  const router = useRouter();
    const [selectedTab, setSelectedTab] = useState("dashboard");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>([]);
  const [availabilityMap, setAvailabilityMap] = useState<Map<string, { isAvailable: boolean; reason?: string }>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
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
        // Don't show alert, just log the error
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Refresh availability when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (typeof document !== 'undefined' && !document.hidden) {
        try {
          const availabilityData = await checkAllServiceCentersAvailability();
          setAvailabilityMap(availabilityData);
        } catch (error) {
          console.error("Error refreshing availability:", error);
        }
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }
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
    console.log("Super Admin navigating to service center dashboard:", id);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8 overflow-x-hidden">
      <Sidebar
              role="super-admin"
              serviceCenters={[]}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
      <div className="max-w-full mx-auto w-full ml-36">
        <div className="flex justify-between items-center mb-10 mr-36">
          <div className="px-6 md:px-12 lg:px-20 xl:px-32 2xl:px-40">
            <h1 className="text-4xl font-bold text-gray-800 drop-shadow-sm">
              Welcome to VApp Admin Dashboard
              <p className="text-sm font-light text-gray-600 mt-2">
                Manage your service centers and monitor key metrics
              </p>
            </h1>
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

        <div className="px-6 md:px-12 lg:px-20 xl:px-32 2xl:px-40">
        
        

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
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
            icon="availableCenters"
          />
        </div>

        <div className="">
          <div className="">
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
    </div>
  );
};

export default SuperAdminDashboard;
