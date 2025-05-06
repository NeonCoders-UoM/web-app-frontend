"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DocumentUploadForm from "@/components/organism/document-upload-form/document-upload-form";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import { fetchServiceCenterById, updateServiceCenter } from "@/utils/api";
import { ServiceCenter } from "@/types";

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

  const handleSubmit = async (data: Omit<ServiceCenter, "id">) => {
    if (typeof id === "string") {
      try {
        await updateServiceCenter(id, data);
        alert("Service Center updated successfully!");
        router.push("/super-admin");
      } catch (error) {
        console.error("Error updating service center:", error);
        alert("Failed to update service center. Please try again.");
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
      <div className="min-h-screen bg-neutral-50 flex justify-center items-center p-6">
        <p className="text-neutral-900 text-lg">Service Center not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      {/* Header */}
      <div>
        <div className="flex justify-end items-center mb-[64px]">
          <UserProfileCard
            pictureSrc="/images/profipic.jpg"
            pictureAlt="Moni Roy"
            name="Moni Roy"
            role="super-admin"
            onLogout={() => console.log("Logout clicked")}
            onProfileClick={() => console.log("Profile clicked")}
            onSettingsClick={() => console.log("Settings clicked")}
          />
        </div>
      </div>
      
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-bold text-neutral-600 mb-[40px]">Service Center Edit</h1>
          {/* Centered Form */}
            <div>
              <DocumentUploadForm initialData={serviceCenter} onSubmit={handleSubmit} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default EditServiceCenter;