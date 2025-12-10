"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import TabNavigation from "@/components/atoms/tab-navigation/tab-navigation";
import ServiceCenterServiceEditForm from "@/components/organism/service-center-service-edit-form/service-center-service-edit-form";
import {
  fetchServiceCenterServices,
  updateServiceCenterService,
} from "@/utils/api";
import { ServiceCenterServiceDTO } from "@/types";
import colors from "@/styles/colors";

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const { id, serviceId } = params;
  const [service, setService] = useState<ServiceCenterServiceDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z"
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

  useEffect(() => {
    const loadService = async () => {
      if (typeof id === "string" && typeof serviceId === "string") {
        try {
          setIsLoading(true);
          const services = await fetchServiceCenterServices(id);
          const targetService = services.find(
            (s) =>
              s.serviceCenterServiceId.toString() ===
              serviceId.replace("#SC-", "")
          );

          if (targetService) {
            setService(targetService);
          } else {
            console.error("Service not found");
            alert("Service not found");
            router.push(`/service-centers/${id}/view/services`);
          }
        } catch (error) {
          console.error("Error loading service:", error);
          alert("Failed to load service details");
          router.push(`/service-centers/${id}/view/services`);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadService();
  }, [id, serviceId, router]);

  const handleTabChange = (tab: string) => {
    if (!id || typeof id !== "string") {
      console.error("Invalid ID for navigation:", id);
      return;
    }
    const tabRoute = tab.toLowerCase();
    router.push(`/service-centers/${id}/view/${tabRoute}`);
  };

  const handleFormSubmit = async (data: {
    customPrice: number;
    loyaltyPoints: number;
  }) => {
    if (
      !id ||
      typeof id !== "string" ||
      !serviceId ||
      typeof serviceId !== "string"
    ) {
      console.error("Invalid IDs for update");
      return;
    }

    try {
      setIsUpdating(true);
      const actualServiceId = serviceId.replace("#SC-", "");

      await updateServiceCenterService(id, actualServiceId, data);

      console.log("Service updated successfully:", data);
      alert("Service updated successfully!");
      router.push(`/service-centers/${id}/view/services`);
    } catch (error) {
      console.error("Error updating service:", error);
      alert("Failed to update service");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center bg-white p-6">
        <div className="w-full flex justify-end items-center mb-[80px]">
          <UserProfileCard
            pictureSrc="/images/profipic.jpg"
            pictureAlt="User Profile"
            useCurrentUser={true}
            onLogout={() => router.push("/login")}
          />
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-white p-6">
      <div className="w-full flex justify-end items-center mb-[80px]">
        <UserProfileCard
          pictureSrc="/images/profipic.jpg"
          pictureAlt="User Profile"
          useCurrentUser={true}
          onLogout={() => router.push("/login")}
        />
      </div>

      <div className="flex-1 flex flex-col p-4 w-[1074px] h-[760]">
        <TabNavigation
          tabs={tabs}
          activeTab="Services"
          onTabChange={handleTabChange}
        />

        <div className="flex-1 flex justify-center items-center p-[28px] bg-neutral-100 rounded-md">
          <div
            className="rounded-lg shadow-md p-6 w-full max-w-2xl"
            style={{
              backgroundColor: "#FFFFFF",
              border: `1px solid ${colors.primary[100]}`,
            }}
          >
            <h2
              className="text-xl mb-6"
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: "var(--font-weight-medium)",
                color: colors.primary[200],
              }}
            >
              Edit Service
            </h2>
            <ServiceCenterServiceEditForm
              service={service || undefined}
              onSubmit={handleFormSubmit}
              buttonLabel="Update"
              isLoading={isUpdating}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
