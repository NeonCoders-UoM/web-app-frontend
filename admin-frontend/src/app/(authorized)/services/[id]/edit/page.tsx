"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import SystemServiceForm from "@/components/organism/system-service-form/system-service-form";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import { fetchSystemServices, updateSystemService } from "@/utils/api";
import { deleteAllAuthCookies } from "@/utils/cookies";
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
          basePrice: data.basePrice,
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading service...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex justify-center items-center p-6">
        <p className="text-neutral-900 text-lg">Service not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center relative">
          {/* Back Button */}
          <button
            onClick={() => router.push("/services")}
            className="group flex items-center gap-2 px-6 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
            <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
              Back to Services
            </span>
          </button>

          

          {/* User Profile */}
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
      </div>

      {/* Form Section */}
      <div className="max-w-3xl mx-auto">
        <SystemServiceForm
          initialData={service}
          onSubmit={handleSubmit}
          isEdit={true}
        />
      </div>
    </div>
  );
};

export default EditServicePage;
