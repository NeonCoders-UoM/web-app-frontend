"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SystemServiceForm from "@/components/organism/system-service-form/system-service-form";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import { createSystemService } from "@/utils/api";
import { CreateSystemServiceDTO } from "@/types";

const AddServicePage: React.FC = () => {
  const router = useRouter();

  const handleSubmit = async (data: CreateSystemServiceDTO) => {
    try {
      await createSystemService(data);
      alert("Service created successfully!");
      router.push("/services");
    } catch (error) {
      console.error("Error creating service:", error);
      alert("Failed to create service. Please try again.");
    }
  };

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
            Add New Service
          </h1>
          <SystemServiceForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default AddServicePage;
