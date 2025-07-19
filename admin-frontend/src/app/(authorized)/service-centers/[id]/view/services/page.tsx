// src/app/service-centers/[id]/view/services/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import TabNavigation from "@/components/atoms/tab-navigation/tab-navigation";
import Table from "@/components/organism/table/table";
import {
  fetchServiceCenterById,
  fetchServiceCenterServices,
  removeServiceFromServiceCenter,
} from "@/utils/api";
import { ServiceCenter, ServiceCenterServiceDTO } from "@/types";

// Mock service data
const mockServices = [
  {
    id: "#SC-0001",
    name: "Engine Check",
    price: "60000LKR",
    effectiveTo: "12-05-2025",
    addAnother: "DGFHR3 Enterprises",
  },
  {
    id: "#SC-0002",
    name: "Engine Check",
    price: "60000LKR",
    effectiveTo: "12-05-2025",
    addAnother: "DGFHR3 Enterprises",
  },
  {
    id: "#SC-0003",
    name: "Engine Check",
    price: "60000LKR",
    effectiveTo: "12-05-2025",
    addAnother: "DGFHR3 Enterprises",
  },
  {
    id: "#SC-0004",
    name: "Engine Check",
    price: "60000LKR",
    effectiveTo: "12-05-2025",
    addAnother: "DGFHR3 Enterprises",
  },
  {
    id: "#SC-0005",
    name: "Engine Check",
    price: "60000LKR",
    effectiveTo: "12-05-2025",
    addAnother: "DGFHR3 Enterprises",
  },
  {
    id: "#SC-0006",
    name: "Engine Check",
    price: "60000LKR",
    effectiveTo: "12-05-2025",
    addAnother: "DGFHR3 Enterprises",
  },
  {
    id: "#SC-0007",
    name: "Engine Check",
    price: "60000LKR",
    effectiveTo: "12-05-2025",
    addAnother: "DGFHR3 Enterprises",
  },
];

const ServicesTab: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [serviceCenter, setServiceCenter] = useState<ServiceCenter | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<ServiceCenterServiceDTO[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (typeof id === "string") {
        try {
          const [serviceCenterData, servicesData] = await Promise.all([
            fetchServiceCenterById(id),
            fetchServiceCenterServices(id),
          ]);

          console.log(
            "Fetched service center in ServicesTab:",
            serviceCenterData
          );
          console.log("Fetched services:", servicesData);

          setServiceCenter(serviceCenterData);
          setServices(servicesData);
        } catch (error) {
          console.error("Error fetching data:", error);
          // Fallback to mock data if API fails
          const fallbackServices = mockServices.map((service) => {
            const price = parseFloat(
              service.price.replace("LKR", "").replace(",", "")
            );
            return {
              serviceCenterServiceId: parseInt(service.id.replace("#SC-", "")),
              station_id: parseInt(id),
              serviceId: parseInt(service.id.replace("#SC-", "")),
              packageId: 1,
              customPrice: price,
              serviceCenterBasePrice: price,
              serviceCenterLoyaltyPoints: Math.round((price * 10) / 100), // 10% for basic package
              isAvailable: true,
              notes: "",
              serviceName: service.name,
              serviceDescription: service.name,
              serviceBasePrice: price,
              category: "General",
              stationName: "Unknown",
              packageName: "Basic Package",
              packagePercentage: 10, // 10% for basic package
              packageDescription:
                "Basic service package with 10% loyalty percentage",
            };
          });
          setServices(fallbackServices);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.error("ID is not a string:", id);
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);

  const tabs = [
    {
      label: "Details",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      label: "Services",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  const headers = [
    { title: "SERVICE ID", sortable: false },
    { title: "SERVICE NAME", sortable: false },
    { title: "DESCRIPTION", sortable: false },
    { title: "CUSTOM PRICE", sortable: false },
    { title: "LOYALTY POINTS", sortable: false },
    { title: "STATUS", sortable: false },
  ];

  const tableData = services.map((service) => {
    // Calculate loyalty points based on custom price and package percentage
    const customPrice = service.customPrice || service.serviceBasePrice || 0;
    const packagePercentage = service.packagePercentage || 0;
    const loyaltyPoints = Math.round((customPrice * packagePercentage) / 100);

    return [
      `#SC-${(service.serviceCenterServiceId || 0)
        .toString()
        .padStart(4, "0")}`,
      service.serviceName || "Unknown Service",
      service.serviceDescription || "No description available",
      `${customPrice} LKR`,
      `${loyaltyPoints} points`,
      service.isAvailable ? "Available" : "Not Available",
      "", // Placeholder for the actions column
    ];
  });

  const handleTabChange = (tab: string) => {
    if (!id || typeof id !== "string") {
      console.error("Invalid ID for navigation:", id);
      return;
    }
    const tabRoute = tab.toLowerCase();
    router.push(`/service-centers/${id}/view/${tabRoute}`);
  };

  const handleAction = async (action: string, row: string[]) => {
    const serviceId = row[0]; // SERVICE ID
    const serviceCenterServiceId = parseInt(serviceId.replace("#SC-", ""));

    if (action === "edit") {
      console.log(`Editing service: ${serviceId}`);
      // Navigate to edit page
      router.push(`/service-centers/${id}/view/services/edit/${serviceId}`);
    } else if (action === "delete") {
      console.log(`Deleting service: ${serviceId}`);
      if (window.confirm("Are you sure you want to remove this service?")) {
        try {
          const actualServiceId = serviceCenterServiceId.toString();
          await removeServiceFromServiceCenter(id as string, actualServiceId);
          // Remove from local state
          setServices(
            services.filter(
              (service) =>
                (service.serviceCenterServiceId || 0) !== serviceCenterServiceId
            )
          );
        } catch (error) {
          console.error("Error removing service:", error);
          alert("Failed to remove service");
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!serviceCenter) {
    return (
      <div className="min-h-screen bg-neutral-50 flex justify-center items-center">
        <p className="text-neutral-900 text-lg">Service Center not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Removed fixed-size frame */}
      <div className="w-full max-w-5xl flex flex-col p-6">
        {/* Header */}
        <div className="flex justify-end items-center mb-[80px]">
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

        <h1 className="text-xl font-semibold text-neutral-800 mb-[40px]">
          Service Center Details
        </h1>
        {/* Tab Navigation and Content */}
        <div className="flex-1 flex flex-col">
          <TabNavigation
            tabs={tabs}
            activeTab="Services"
            onTabChange={handleTabChange}
          />

          <div className="flex-1 p-6 bg-neutral-50 w-[1074px] h-[760]">
            <Table
              headers={headers}
              data={tableData}
              actions={["edit", "delete"]}
              showSearchBar={false}
              onAction={handleAction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesTab;
