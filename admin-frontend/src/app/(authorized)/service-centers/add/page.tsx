// src/app/pages/service-centers/add/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import EnhancedServiceCenterForm from "@/components/organism/enhanced-service-center-form/enhanced-service-center-form";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import { createServiceCenterWithServices } from "@/utils/api";
import { CreateServiceCenterWithServicesDTO } from "@/types";
import { deleteAllAuthCookies, getCookie } from "@/utils/cookies";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center relative">
          {/* Back Button */}
          <button
            onClick={() => {
              const userRole = getCookie("userRole");
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
              Back to Service-Centers
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
      <div className="max-w-5xl mx-auto">
        <EnhancedServiceCenterForm initialData={undefined} onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default AddServiceCenter;
