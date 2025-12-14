"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/atoms/button/button";
import Sidebar from "@/components/molecules/side-bar/side-bar";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import Table from "@/components/organism/table/table";
import { ServiceCenter } from "@/types";
import {
  fetchServiceCenters,
  deleteServiceCenter,
  updateServiceCenterStatus,
} from "@/utils/api";
import { deleteAllAuthCookies } from "@/utils/cookies";

export const dynamic = "force-dynamic";

const ServiceCentersPage: React.FC = () => {
  const router = useRouter();
  const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>([]);
  const [loading, setLoading] = useState(true);

  const loadServiceCenters = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchServiceCenters();
      console.log("Loaded service centers:", data);
      setServiceCenters(data);
    } catch (error) {
      console.error("Error loading service centers:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServiceCenters();
  }, [loadServiceCenters]);

  const handleDelete = async (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this service center?")
    ) {
      try {
        await deleteServiceCenter(id);
        await loadServiceCenters();
        alert("Service center deleted successfully!");
      } catch (error) {
        console.error("Error deleting service center:", error);
        alert("Failed to delete service center");
      }
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/service-centers/${id}/edit`);
  };

  const handleView = (id: string) => {
    router.push(`/service-centers/${id}/view`);
  };

  const handleAction = (action: string, row: string[]) => {
    const id = row[0];
    if (!id || id.trim() === "") {
      alert("Unable to perform action: Invalid service center ID");
      return;
    }

    const actionMap: Record<string, string> = {
      Edit: "edit",
      Delete: "delete",
      View: "view",
    };
    const actionType = actionMap[action];
    if (actionType === "edit") handleEdit(id);
    if (actionType === "delete") handleDelete(id);
    if (actionType === "view") handleView(id);
  };

  const data = serviceCenters.map((sc) => [
    sc.id || sc.Station_id?.toString() || "",
    sc.serviceCenterName || sc.Station_name || "",
    sc.ownersName || sc.OwnerName || "",
    sc.email || sc.Email || "",
    sc.telephoneNumber || sc.Telephone || "",
    sc.address || sc.Address || "",
    sc.Station_status || "Active",
  ]);

  const headers = [
    { title: "ID", sortable: false },
    { title: "Name", sortable: false },
    { title: "Owner", sortable: false },
    { title: "Email", sortable: false },
    { title: "Phone", sortable: false },
    { title: "Address", sortable: false },
    { title: "Status", sortable: false },
  ];

  const actions: ("edit" | "delete" | "view")[] = ["edit", "delete", "view"];

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8 overflow-x-hidden">
      <Sidebar role="super-admin" serviceCenters={[]} />
      <div className="max-w-full mx-auto">
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

        <div className="">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 drop-shadow-sm">
                Service Centers
                <p className="text-sm font-light text-gray-600 mt-2">
                  Manage and monitor service center locations
                </p>
              </h1>
            </div>
            <Button
              variant="primary"
              size="medium"
              onClick={() => router.push("/service-centers/add")}
            >
              Add Service Center
            </Button>
          </div>

          {/* Table */}
          <div>
            {serviceCenters.length > 0 ? (
              <Table
                headers={headers}
                data={data}
                actions={actions}
                showSearchBar={true}
                onAction={handleAction}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No service centers found</p>
                <p className="text-gray-400 text-sm mt-2">
                  Get started by adding your first service center
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCentersPage;
