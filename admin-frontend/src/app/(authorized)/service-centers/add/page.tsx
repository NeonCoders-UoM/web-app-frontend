// src/app/pages/service-centers/add/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ServiceCenterForm from "@/components/organism/service-center-form/service-center-form";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import { createServiceCenter } from "@/utils/api";
import { ServiceCenter } from "@/types";

const AddServiceCenter: React.FC = () => {
  const router = useRouter();

  const handleSubmit = async (data: Omit<ServiceCenter, "id">) => {
    try {
      await createServiceCenter(data);
      alert("Service Center created successfully!");
      router.push("/super-admin"); // Redirect to super admin dashboard
    } catch (error) {
      console.error("Error creating service center:", error);
      alert("Failed to create service center. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col">
      {/* Header with title and user profile card */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-neutral-600">Service Center Registration</h1>
        <UserProfileCard
          pictureSrc="/images/profipic.jpg"
          pictureAlt="Moni Roy"
          name="Moni Roy"
          role="super-admin" // Updated role to super-admin
          onLogout={() => console.log("Logout clicked")}
          onProfileClick={() => console.log("Profile clicked")}
          onSettingsClick={() => console.log("Settings clicked")}
        />
      </div>

      {/* Centered form */}
      <div className="flex-1 flex items-center justify-center">
        <ServiceCenterForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default AddServiceCenter;