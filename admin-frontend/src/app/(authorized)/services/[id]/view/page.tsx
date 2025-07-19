"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import Button from "@/components/atoms/button/button";
import { fetchSystemServices } from "@/utils/api";
import { SystemService } from "@/types";

const ViewServicePage: React.FC = () => {
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
        <div className="flex justify-between items-center mb-[32px]">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Service Details
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Service Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                  Service Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-1">
                      Service ID
                    </label>
                    <p className="text-neutral-900 font-medium">
                      {service.serviceId}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-1">
                      Service Name
                    </label>
                    <p className="text-neutral-900 font-medium">
                      {service.serviceName}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-1">
                      Category
                    </label>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {service.category}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-1">
                      Status
                    </label>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        service.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Description */}
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                Description
              </h2>
              <div className="bg-neutral-50 rounded-lg p-4">
                <p className="text-neutral-700 leading-relaxed">
                  {service.description || "No description available."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-neutral-200 flex justify-end space-x-4">
            <Button
              variant="secondary"
              size="medium"
              onClick={() => router.push(`/services/${id}/edit`)}
            >
              Edit Service
            </Button>
            <Button
              variant="primary"
              size="medium"
              onClick={() => router.push("/services")}
            >
              Back to Services
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewServicePage;
