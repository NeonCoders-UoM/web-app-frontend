// src/app/pages/service-centers/add/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import EnhancedServiceCenterForm from "@/components/organism/enhanced-service-center-form/enhanced-service-center-form";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import { createServiceCenterWithServices } from "@/utils/api";
import { CreateServiceCenterWithServicesDTO } from "@/types";

const AddServiceCenter: React.FC = () => {
  const router = useRouter();

  const handleSubmit = async (data: CreateServiceCenterWithServicesDTO) => {
    try {
      await createServiceCenterWithServices(data);
      alert("Service Center created successfully with services!");
      
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
      console.error("Error creating service center:", error);
      alert("Failed to create service center. Please try again.");
    }
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
            Service Center Registration
          </h1>
          {/* Centered form */}
          <div>
            <EnhancedServiceCenterForm initialData={undefined} onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddServiceCenter;
