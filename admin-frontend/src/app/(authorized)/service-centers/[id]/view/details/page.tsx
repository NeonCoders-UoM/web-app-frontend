// src/app/service-centers/[id]/view/details/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import TabNavigation from "@/components/atoms/tab-navigation/tab-navigation";
import { fetchServiceCenterById } from "@/utils/api";
import { ServiceCenter } from "@/types";

const DetailsTab: React.FC = () => {
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
          console.log("Fetched service center in DetailsTab:", data);
          setServiceCenter(data);
        } catch (error) {
          console.error("Error fetching service center:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.error("ID is not a string:", id);
        setIsLoading(false);
      }
    };
    loadServiceCenter();
  }, [id]);

  const tabs = [
    {
      label: "Details",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      label: "Services",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const handleTabChange = (tab: string) => {
    if (!id || typeof id !== "string") {
      console.error("Invalid ID for navigation:", id);
      return;
    }
    const tabRoute = tab.toLowerCase();
    router.push(`/service-centers/${id}/view/${tabRoute}`);
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
      <div className="min-h-screen bg-neutral-50 flex justify-center items-center">
        <p className="text-neutral-900 text-lg">Service Center not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center">
      {/* Removed fixed-size frame */}
      <div className="w-full max-w-5xl flex flex-col">
        {/* Header */}
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-neutral-900">Service Center Details</h1>
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
        </div>

        {/* Tab Navigation and Content */}
        <div className="flex-1 flex flex-col">
          <TabNavigation tabs={tabs} activeTab="Details" onTabChange={handleTabChange} />

          <div className="flex-1 p-6">
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              {/* Left Column */}
              <div>
                <div className="mb-4">
                  <p className="text-gray-500 text-sm">Service Center Name :</p>
                  <p className="font-medium">{serviceCenter.serviceCenterName}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-500 text-sm">Service Center Address :</p>
                  <p className="font-medium">{serviceCenter.address}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-500 text-sm">Owner&apos;s Name :</p>
                  <p className="font-medium">{serviceCenter.ownersName}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-500 text-sm">VAT Number :</p>
                  <p className="font-medium">{serviceCenter.vatNumber}</p>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div className="mb-4">
                  <p className="text-gray-500 text-sm">Email :</p>
                  <p className="font-medium">{serviceCenter.email}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-500 text-sm">Telephone Number :</p>
                  <p className="font-medium">{serviceCenter.telephoneNumber}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-500 text-sm">Registration Number :</p>
                  <p className="font-medium">{serviceCenter.registrationNumber}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-500 text-sm">Commission Date :</p>
                  <p className="font-medium">{serviceCenter.commissionDate}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-500 text-sm">Service Hours :</p>
                  <p className="font-medium">
                    {serviceCenter.serviceHours.start} - {serviceCenter.serviceHours.end}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Image
                src="/images/vehicle.jpg"
                alt="Vehicle mechanics"
                width={200}
                height={120}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsTab;