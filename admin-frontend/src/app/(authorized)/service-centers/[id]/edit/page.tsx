"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import EnhancedServiceCenterForm from "@/components/organism/enhanced-service-center-form/enhanced-service-center-form";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import { fetchServiceCenterById, updateServiceCenter } from "@/utils/api";
import { ServiceCenter, CreateServiceCenterWithServicesDTO } from "@/types";

const EditServiceCenter: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [serviceCenter, setServiceCenter] = useState<ServiceCenter | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadServiceCenter = async () => {
      if (typeof id === "string") {
        try {
          const data = await fetchServiceCenterById(id);
          console.log("Fetched service center in EditServiceCenter:", data);
          setServiceCenter(data);
        } catch (error) {
          console.error("Error fetching service center:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadServiceCenter();
  }, [id]);

  const handleSubmit = async (data: CreateServiceCenterWithServicesDTO) => {
    if (typeof id === "string") {
      try {
        // Convert CreateServiceCenterWithServicesDTO to the format expected by updateServiceCenter
        const updateData = {
          serviceCenterName: data.station_name,
          Station_name: data.station_name,
          email: data.email,
          Email: data.email,
          address: data.address,
          Address: data.address,
          telephoneNumber: data.telephone,
          Telephone: data.telephone,
          ownersName: data.ownerName,
          OwnerName: data.ownerName,
          vatNumber: data.vatNumber,
          VATNumber: data.vatNumber,
          registrationNumber: data.registerationNumber,
          RegisterationNumber: data.registerationNumber,
          Station_status: data.station_status,
          Latitude: data.lat,
          Longitude: data.lng,
          DefaultDailyAppointmentLimit: data.defaultDailyAppointmentLimit,
          commissionRate: "",
          availableServices: [],
        };
        
        await updateServiceCenter(id, updateData);
        alert("Service Center updated successfully!");
        
        // Redirect based on user role
        const userRole = localStorage.getItem("userRole");
        if (userRole === "SuperAdmin") {
          router.push("/super-admin");
        } else if (userRole === "Admin") {
          router.push("/admin-dashboard");
        } else {
          router.push("/super-admin"); // Fallback
        }
      } catch (error) {
        console.error("Error updating service center:", error);
        alert("Failed to update service center. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading service center...</p>
        </div>
      </div>
    );
  }

  if (!serviceCenter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex justify-center items-center p-6">
        <p className="text-neutral-900 text-lg">Service Center not found.</p>
      </div>
    );
  }

  // Convert ServiceCenter to CreateServiceCenterWithServicesDTO for the form
  const initialFormData: CreateServiceCenterWithServicesDTO = {
    ownerName: serviceCenter.ownersName || serviceCenter.OwnerName || "",
    vatNumber: serviceCenter.vatNumber || serviceCenter.VATNumber || "",
    registerationNumber: serviceCenter.registrationNumber || serviceCenter.RegisterationNumber || "",
    station_name: serviceCenter.serviceCenterName || serviceCenter.Station_name || "",
    email: serviceCenter.email || serviceCenter.Email || "",
    telephone: serviceCenter.telephoneNumber || serviceCenter.Telephone || "",
    address: serviceCenter.address || serviceCenter.Address || "",
    station_status: serviceCenter.Station_status || "Active",
    packageId: 0,
    services: [],
    lat: serviceCenter.Latitude || 0,
    lng: serviceCenter.Longitude || 0,
    defaultDailyAppointmentLimit: serviceCenter.DefaultDailyAppointmentLimit || 20,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center relative">
          {/* Back Button */}
          <button
            onClick={() => {
              const userRole = localStorage.getItem("userRole");
              if (userRole === "SuperAdmin") {
                router.push("/super-admin");
              } else if (userRole === "Admin") {
                router.push("/admin-dashboard");
              } else {
                router.push("/super-admin");
              }
            }}
            className="group flex items-center gap-2 px-6 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
            <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
              Back to Dashboard
            </span>
          </button>

          {/* User Profile */}
          <UserProfileCard
            pictureSrc="/images/profipic.jpg"
            pictureAlt="User Profile"
            useCurrentUser={true}
            onLogout={() => router.push("/login")}
          />
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-5xl mx-auto">
        <EnhancedServiceCenterForm initialData={initialFormData} onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default EditServiceCenter;