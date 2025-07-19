"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import Button from "@/components/atoms/button/button";
import Table from "@/components/organism/table/table";
import { fetchSystemServices, deleteSystemService } from "@/utils/api";
import { SystemService } from "@/types";

const ServicesPage: React.FC = () => {
  const router = useRouter();
  const [services, setServices] = useState<SystemService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        console.log("Loading services...");
        const data = await fetchSystemServices();
        console.log("Services loaded successfully:", data);
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
        // Don't show alert since fetchSystemServices has fallback data
        console.log("Using fallback services data");
      } finally {
        setIsLoading(false);
      }
    };
    loadServices();
  }, []);

  const data = services.map((service, index) => {
    try {
      // Ensure all properties exist with fallback values
      const safeService = {
        serviceId: service?.serviceId || 0,
        serviceName: service?.serviceName || "",
        description: service?.description || "",
        category: service?.category || "",
        isActive: service?.isActive ?? true,
      };

      return [
        safeService.serviceId.toString(),
        safeService.serviceName,
        safeService.description,
        safeService.category,
        safeService.isActive ? "Active" : "Inactive",
      ];
    } catch (error) {
      console.error(
        `Error processing service at index ${index}:`,
        error,
        service
      );
      // Return a safe fallback row
      return [
        "0",
        "Error loading service",
        "Service data could not be processed",
        "Unknown",
        "Inactive",
      ];
    }
  });

  const headers = [
    { title: "ID", sortable: false },
    { title: "Service Name", sortable: false },
    { title: "Description", sortable: false },
    { title: "Category", sortable: false },
    { title: "Status", sortable: false },
  ];

  const actions: ("edit" | "delete" | "view")[] = ["edit", "delete", "view"];

  const handleEdit = (id: string) => {
    router.push(`/services/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteSystemService(parseInt(id));
        setServices((prev) =>
          prev.filter((service) => (service.serviceId || 0).toString() !== id)
        );
        alert("Service deleted successfully!");
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("Failed to delete service.");
      }
    }
  };

  const handleView = (id: string) => {
    router.push(`/services/${id}/view`);
  };

  const handleAction = (action: string, row: string[]) => {
    const id = row[0];
    if (!id || id.trim() === "") {
      console.error("Invalid ID for action:", id);
      alert("Unable to perform action: Invalid service ID");
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex justify-end items-center mb-[32px]">
        <UserProfileCard
          pictureSrc="/images/profipic.jpg"
          pictureAlt="Moni Roy"
          name="Moni Roy"
          role="super-admin"
          onLogout={() => router.push("/login")}
          onProfileClick={() => router.push("/profile")}
          onSettingsClick={() => router.push("/settings")}
        />
      </div>

      <div className="px-[182px]">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-[32px]">
          Services Management
        </h1>

        <div>
          <div className="flex justify-between items-center mb-[32px]">
            <h2 className="text-xl font-semibold text-neutral-900">
              System Services
            </h2>
            <div className="flex items-center space-x-4">
              <Button
                variant="primary"
                size="medium"
                onClick={() => router.push("/services/add")}
              >
                Add Service
              </Button>
            </div>
          </div>

          {services.length > 0 ? (
            <Table
              headers={headers}
              data={data}
              actions={actions}
              showSearchBar={true}
              onAction={handleAction}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-neutral-600">No services found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
