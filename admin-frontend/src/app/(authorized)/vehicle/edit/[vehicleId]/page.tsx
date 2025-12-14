"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DocumentUploadForm from "@/components/organism/document-upload-form/document-upload-form";
import UserProfileCard from "@/components/molecules/user-card/user-card"
import { ServiceCenter } from "@/types";
import { deleteAllAuthCookies } from "@/utils/cookies";


export default function EditVehiclePage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.vehicleId as string;
  const [loading, setLoading] = useState(true);
  const [vehicleData, setVehicleData] = useState<Partial<ServiceCenter> | null>(null);

  // In a real application, this would fetch the vehicle data based on client ID
  useEffect(() => {
    // Simulate API fetch
    const fetchVehicleData = async () => {
      try {
        // This would be an actual API call in a real application
        // const response = await fetch(`/api/clients/${clientId}/vehicle`);
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockData: Partial<ServiceCenter> = {
          serviceCenterName: "Example Service Center",
          email: "service@example.com",
          address: "123 Service Road",
          telephoneNumber: "1234567890",
          ownersName: "John Doe",
          vatNumber: "VAT123456",
          registrationNumber: "REG987654",
          availableServices: ["Oil Change"],
          photoUrl: "",
          registrationCopyUrl: ""
        };
        
        setVehicleData(mockData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
        setLoading(false);
      }
    };

    fetchVehicleData();
  }, [clientId]);

  const handleSubmit = (data: Omit<ServiceCenter, "id">) => {
    // In a real application, this would make an API call to save the data
    console.log("Form submitted with data:", data);
    
    // Show success notification (could use a toast notification in a real app)
    alert("Vehicle information updated successfully!");
    
    // Navigate back to the client profile page
    router.push(`/client/${clientId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center h-screen">
        <div className="text-xl">Loading vehicle information...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-[58px]">
      <div className="flex justify-end items-center mb-[36px]">
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
      <div>
        <div className="mb-[60px]">
          <h1 className="text-xl font-bold text-neutral-800">Edit Vehicle</h1>
        </div>
        
        <div className="flex justify-start pr-[22px]">
          <DocumentUploadForm 
            initialData={vehicleData || undefined}
            onSubmit={handleSubmit} 
          />
        </div>
      </div>
    </div>
  );
}