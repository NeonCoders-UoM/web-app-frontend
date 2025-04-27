'use client';

import { useRouter, useParams } from "next/navigation";
import UserProfileCard from '@/components/molecules/user-card/user-card';
import TabNavigation from '@/components/atoms/tab-navigation/tab-navigation';
import ServiceUpdateForm from '@/components/organism/service-update-form/service-update-form';
import colors from "@/styles/colors";

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const { id, serviceId } = params;

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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
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

  const handleFormSubmit = (data: { serviceName: string; amount: string; effectiveUntil: string }) => {
    console.log("New service added:", {
      id: serviceId,
      name: data.serviceName,
      price: data.amount,
      effectiveTo: data.effectiveUntil,
      addAnother: "DGFHR3 Enterprises",
    });
    router.push(`/service-centers/${id}/view/services`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center" style={{ backgroundColor: colors.neutral[100] }}>
      <div className="w-full px-6 py-4 flex justify-end items-center">
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

      <div className="flex flex-col p-4 w-1/2">
        <TabNavigation tabs={tabs} activeTab="Services" onTabChange={handleTabChange} />

        <div className="flex-1 flex justify-center items-center py-4">
          <div
            className="rounded-lg shadow-md p-6 w-full"
            style={{
              backgroundColor: "#FFFFFF",
              border: `1px solid ${colors.primary[100]}`,
            }}
          >
            <h2
              className="text-xl mb-6"
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: "var(--font-weight-medium)",
                color: colors.primary[200],
              }}
            >
              Edit Service
            </h2>
            <ServiceUpdateForm onSubmit={handleFormSubmit} buttonLabel="Edit" />
          </div>
        </div>
      </div>
    </div>
  );
}