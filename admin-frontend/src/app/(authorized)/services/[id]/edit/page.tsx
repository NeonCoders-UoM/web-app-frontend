"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import SystemServiceForm from "@/components/organism/system-service-form/system-service-form";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import { fetchSystemServices, updateSystemService } from "@/utils/api";
import {
  SystemService,
  UpdateSystemServiceDTO,
  CreateSystemServiceDTO,
} from "@/types";

const EditServicePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [service, setService] = useState<SystemService | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadService = async () => {
      if (typeof id === "string") {
        try {
          const services = await fetchSystemServices();
          const foundService = services.find(
            (s) => s.serviceId.toString() === id
          );
          if (foundService) {
            setService(foundService);
          } else {
            alert("Service not found.");
            router.push("/services");
          }
        } catch (error) {
          console.error("Error fetching service:", error);
          alert("Failed to load service.");
          router.push("/services");
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadService();
  }, [id, router]);

  const handleSubmit = async (data: CreateSystemServiceDTO) => {
    if (typeof id === "string" && service) {
      try {
        const updateData: UpdateSystemServiceDTO = {
          serviceName: data.serviceName,
          description: data.description,
          category: data.category,
        };
        await updateSystemService(service.serviceId, updateData);
        alert("Service updated successfully!");
        router.push("/services");
      } catch (error) {
        console.error("Error updating service:", error);
        alert("Failed to update service. Please try again.");
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

  if (!service) {
    return (
      <div className="min-h-screen bg-neutral-50 flex justify-center items-center p-6">
        <p className="text-neutral-900 text-lg">Service not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col">
      <div className="flex justify-end items-center">
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

      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-bold text-neutral-600 mb-[40px]">
            Edit Service
          </h1>
          <SystemServiceForm
            initialData={service}
            onSubmit={handleSubmit}
            isEdit={true}
          />
        </div>
      </div>
    </div>
  );
};

export default EditServicePage;
