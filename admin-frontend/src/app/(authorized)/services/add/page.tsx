"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Wrench } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/services")}
          className="group flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-all shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Back to Services</span>
        </button>

        <UserProfileCard
          pictureSrc="/images/profipic.jpg"
          pictureAlt="User Profile"
          useCurrentUser={true}
          onLogout={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
        />
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto">
        <SystemServiceForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default AddServicePage;
