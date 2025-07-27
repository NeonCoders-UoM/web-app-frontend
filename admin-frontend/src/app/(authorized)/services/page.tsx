"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import Button from "@/components/atoms/button/button";
import Table from "@/components/organism/table/table";
import {
  fetchSystemServices,
  deleteSystemService,
  fetchServiceCenterById,
  fetchServiceCenterServices,
  addServiceToServiceCenter,
  removeServiceFromServiceCenter,
} from "@/utils/api";
import { SystemService, ServiceCenter, ServiceCenterServiceDTO } from "@/types";

const ServicesPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceCenterId = searchParams.get("serviceCenterId");
  const [serviceCenter, setServiceCenter] = useState<ServiceCenter | null>(
    null
  );
  const [services, setServices] = useState<SystemService[] | ServiceCenterServiceDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isServiceCenterView, setIsServiceCenterView] = useState(false);

  useEffect(() => {
    loadServices();
  }, [serviceCenterId]);

  // Refresh data when the page becomes visible (e.g., when returning from add service page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && (serviceCenterId || !isServiceCenterView)) {
        loadServices();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [serviceCenterId, isServiceCenterView]);

  const loadServices = async () => {
    try {
      console.log("Loading services...");

      if (serviceCenterId) {
        // Load service center details and its services
        try {
          const serviceCenterData = await fetchServiceCenterById(serviceCenterId);
          setServiceCenter(serviceCenterData);
          
          const centerServices = await fetchServiceCenterServices(serviceCenterId);
          console.log("Service center services loaded:", centerServices);
          setServices(centerServices);
          setIsServiceCenterView(true);
        } catch (error) {
          console.error("Error fetching service center services:", error);
          setServices([]);
        }
      } else {
        // Load all system services
        const data = await fetchSystemServices();
        console.log("System services loaded successfully:", data);
        setServices(data);
        setIsServiceCenterView(false);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      console.log("Using fallback services data");
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const data = services.map((service, index) => {
    try {
      if (isServiceCenterView) {
        // Handle ServiceCenterServiceDTO
        const centerService = service as ServiceCenterServiceDTO;
        return [
          centerService.serviceCenterServiceId?.toString() || "0",
          centerService.serviceName || "",
          centerService.serviceDescription || "",
          centerService.category || "",
          centerService.isAvailable ? "Available" : "Not Available",
        ];
      } else {
        // Handle SystemService
        const systemService = service as SystemService;
        return [
          systemService.serviceId?.toString() || "0",
          systemService.serviceName || "",
          systemService.description || "",
          systemService.category || "",
          systemService.isActive ? "Active" : "Inactive",
        ];
      }
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
    { title: isServiceCenterView ? "Availability" : "Status", sortable: false },
  ];

  const actions: ("edit" | "delete" | "view")[] = ["edit", "delete", "view"];

  const handleEdit = (id: string) => {
    if (serviceCenterId) {
      router.push(`/service-centers/${serviceCenterId}/view/services/edit/${id}`);
    } else {
      router.push(`/services/${id}/edit`);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        if (isServiceCenterView && serviceCenterId) {
          // Remove service from service center
          await removeServiceFromServiceCenter(serviceCenterId, id);
          alert("Service removed from service center successfully!");
        } else {
          // Delete system service
          await deleteSystemService(parseInt(id));
          alert("Service deleted successfully!");
        }
        // Refresh the data after successful operation
        await loadServices();
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("Failed to delete service. Please try again.");
      }
    }
  };

  const handleView = (id: string) => {
    if (serviceCenterId) {
      router.push(`/service-centers/${serviceCenterId}/view/services/view/${id}`);
    } else {
      router.push(`/services/${id}/view`);
    }
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
      <div className="flex justify-end items-center mb-6">
        <UserProfileCard
          pictureSrc="/images/profipic.jpg"
          pictureAlt="User Profile"
          useCurrentUser={true}
          onLogout={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-6">
          {serviceCenterId
            ? `Service Center Services - ${
                serviceCenter?.serviceCenterName || serviceCenterId
              }`
            : "System Services Management"}
        </h1>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">
              {serviceCenterId ? "Service Center Services" : "System Services"}
            </h2>
            <div className="flex items-center space-x-4">
              <Button
                variant="primary"
                size="medium"
                onClick={() => {
                  if (serviceCenterId) {
                    router.push(`/service-centers/${serviceCenterId}/view/services/add`);
                  } else {
                    router.push("/services/add");
                  }
                }}
              >
                {serviceCenterId ? "Add Service to Center" : "Add System Service"}
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
