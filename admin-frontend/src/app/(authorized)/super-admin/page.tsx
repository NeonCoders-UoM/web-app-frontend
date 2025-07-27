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
  fetchServiceCentersPaginated,
  //fetchServiceCenters,
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
  // NEW Pagination & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, /*serviceCentersData,*/ availabilityData] = await Promise.all([
          fetchDashboardStats(),
          //fetchServiceCenters(),
          checkAllServiceCentersAvailability(),
        ]);
        /*console.log(
          "Fetched service centers in SuperAdminDashboard:",
          serviceCentersData
        );
        console.log("Service centers availability:", availabilityData);*/
        setStats(statsData);
        //setServiceCenters(serviceCentersData);
        setAvailabilityMap(availabilityData);
        await fetchPage();
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        alert("Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [searchTerm, currentPage, itemsPerPage]); // re-run when any of these change

  // NEW: Call backend to fetch current page with filters
  const fetchPage = async () => {
    try {
      const result = await fetchServiceCentersPaginated(searchTerm, currentPage, itemsPerPage);

      // Transform backend DTO into usable frontend objects
      const transformed = result.data.map((sc) => ({
        id: sc.station_id?.toString() || '',
        serviceCenterName: sc.station_name || '',
        email: sc.email || '',
        telephoneNumber: sc.telephone || '',
        address: sc.address || '',
      }));

      setServiceCenters(transformed);
      setTotalPages(Math.ceil(result.totalCount / itemsPerPage));
    } catch (err) {
      console.error("Failed to fetch service centers:", err);
      alert("Unable to load service center data.");
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8 overflow-x-hidden">
      <div className="max-w-full mx-auto w-full">
        <div className="flex justify-end items-center mb-10">
          <UserProfileCard
            pictureSrc="/images/profipic.jpg"
            pictureAlt="Moni Roy"
            name="Moni Roy"
            role="super-admin"
            onLogout={() => router.push("/login")}
          />
        </div>

        <div className="px-6 md:px-12 lg:px-20 xl:px-32 2xl:px-40">
        <h1 className="text-4xl font-bold text-gray-800 mb-12 drop-shadow-sm">
          Dashboard
        </h1>
        
        {/* Availability Notice */}
        <div className="mb-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-3xl shadow-lg backdrop-blur-sm">
          <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-4 animate-pulse"></div>
            Service Center Availability
          </h3>
          <p className="text-blue-700 text-base leading-relaxed">
            Availability status is based on closure schedules. Centers marked as &quot;Closed&quot; have scheduled closures for today.
            Use the closure schedule management to update availability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-16 mb-16">
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

        <div className="bg-gradient-to-br from-white/90 via-blue-50/20 to-indigo-50/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/70 p-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center">
              <div className="w-2 h-12 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-600 rounded-full mr-6 shadow-lg"></div>
              Service Centers
            </h2>
            <div className="flex flex-wrap items-center gap-4">
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

          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-white/80 overflow-hidden">
            <Table
              headers={headers}
              data={data}
              actions={actions}
              showSearchBar={true}
              onAction={handleAction}
              onServiceCenterClick={handleServiceCenterClick}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              totalPages={totalPages}
              onSearchChange={(val) => setSearchTerm(val)}
              onItemsPerPageChange={setItemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
