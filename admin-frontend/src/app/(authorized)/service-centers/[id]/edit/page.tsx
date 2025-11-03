"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
          commissionRate: "",
          availableServices: [],
          Station_status: data.station_status,
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
      <div className="min-h-screen bg-neutral-50 flex justify-center items-center ">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!serviceCenter) {
    return (
      <div className="min-h-screen bg-neutral-50 flex justify-center items-center p-6">
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
    <div className="min-h-screen bg-white p-6 flex flex-col">
      {/* Header with title and user profile card */}
      <div className="flex justify-end items-center">
        <UserProfileCard
          pictureSrc="/images/profipic.jpg"
          pictureAlt="User Profile"
          useCurrentUser={true}
          onLogout={() => router.push("/login")}
        />
      </div>

      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-bold text-neutral-600 mb-[40px]">
            Service Center Edit
          </h1>
          {/* Centered form */}
          <div>
            <EnhancedServiceCenterForm initialData={initialFormData} onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditServiceCenter;