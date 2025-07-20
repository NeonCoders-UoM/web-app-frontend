"use client";

import React from "react";
import Image from "next/image";
import SidebarButton from "@/components/atoms/sidebar-button/sidebar-button";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface SidebarProps {
  role: "super-admin" | "service-center-admin" | "cashier" | "data-operator";
  serviceCenters?: { id: string; name: string }[];
  logo?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ role, serviceCenters = [] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extract service center ID from pathname if we're in a service center dashboard
  const serviceCenterIdMatch = pathname.match(
    /\/service-center-dashboard\/([^\/]+)/
  );

  // Also check for serviceCenterId in query parameters
  const queryServiceCenterId = searchParams.get("serviceCenterId");

  const currentServiceCenterId = serviceCenterIdMatch
    ? serviceCenterIdMatch[1]
    : queryServiceCenterId;

  const getSidebarOptions = () => {
    // If we're in a service center dashboard, show service center specific options
    if (currentServiceCenterId) {
      return [
        {
          label: "Dashboard",
          route: `/service-center-dashboard/${currentServiceCenterId}`,
        },
        {
          label: "Services",
          route: `/services?serviceCenterId=${currentServiceCenterId}`,
        },
        {
          label: "Appointments",
          route: `/appointment?serviceCenterId=${currentServiceCenterId}`,
        },
        {
          label: "Clients",
          route: `/client?serviceCenterId=${currentServiceCenterId}`,
        },
        {
          label: "Vehicles",
          route: `/vehicle?serviceCenterId=${currentServiceCenterId}`,
        },
        {
          label: "Feedback",
          route: `/feedback?serviceCenterId=${currentServiceCenterId}`,
        },
        {
          label: "Service Status",
          route: `/service-status?serviceCenterId=${currentServiceCenterId}`,
        },
        {
          label: "Closure Schedule",
          route: `/closure-schedule?serviceCenterId=${currentServiceCenterId}`,
        },
        {
          label: "Loyalty Points",
          route: `/loyalty-points?serviceCenterId=${currentServiceCenterId}`,
        },
        { label: "Back to Admin", route: "/admin-dashboard" },
      ];
    }

    // Default admin options
    return [
      { label: "Dashboard", route: "/admin-dashboard" },
      { label: "Clients", route: "/client" },
      { label: "Vehicles", route: "/vehicle" },
      { label: "Appointments", route: "/appointment" },
      { label: "Feedback", route: "/feedback" },
      { label: "Users", route: "/user-managment" },
      { label: "Service Status", route: "/service-status" },
      { label: "Closure Schedule", route: "/closure-schedule" },
      { label: "Loyalty Points", route: "/loyalty-points" },
      { label: "Logout", route: "/login" },
    ];
  };

  const sidebarOptions: Record<string, { label: string; route: string }[]> = {
    "super-admin": getSidebarOptions(),
    "service-center-admin": [
      { label: "Dashboard", route: "/dashboard" },
      { label: "Clients", route: "/client" },
      { label: "Vehicles", route: "/vehicle" },
      { label: "Service Status", route: "/service-status" },
      { label: "Appointments", route: "/appointment" },
      { label: "Feedback", route: "/feedback" },
      { label: "Closure Schedule", route: "/closure-schedule" },
    ],
    cashier: [
      { label: "Dashboard", route: "/dashboard" },
      { label: "Clients", route: "/client" },
      { label: "Vehicles", route: "/vehicle" },
      { label: "Service Status", route: "/service-status" },
      { label: "Feedback", route: "/feedback" },
      { label: "Appointments", route: "/appointment" },
    ],
    "data-operator": [
      { label: "Dashboard", route: "/dashboard" },
      { label: "Clients", route: "/client" },
      { label: "Vehicles", route: "/vehicle" },
      { label: "Closure Schedule", route: "/closure-schedule" },
      { label: "Feedback", route: "/feedback" },
    ],
  };

  const sections = sidebarOptions[role] || [];

  const activeSection =
    sections.find((section) => pathname.startsWith(section.route))?.label ||
    sections[0]?.label ||
    "";

  const handleServiceCenterClick = (centerId: string) => {
    router.push(`/service-center/${centerId}/dashboard`);
  };

  return (
    <div className="w-64 min-h-screen flex flex-col bg-white shadow-lg">
      {/* Logo */}
      <div className="pb-1 pt-3 flex items-center justify-center">
        <Image
          src="/images/logo1.png"
          alt="Logo"
          width={150}
          height={40}
          className="object-contain"
        />
      </div>

      {/* Service Centers for Super Admin */}
      {role === "super-admin" && serviceCenters.length > 0 && (
        <div className="px-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-500">
            Service Centers
          </h3>
          {serviceCenters.map((center) => (
            <SidebarButton
              key={center.id}
              label={center.name}
              isActive={pathname === `/service-center/${center.id}/dashboard`}
              onClick={() => handleServiceCenterClick(center.id)}
            />
          ))}
        </div>
      )}

      {/* Sidebar Sections */}
      <div className="flex-1 px-2 space-y-2">
        {sections.map((section) => (
          <SidebarButton
            key={section.label}
            label={section.label}
            isActive={activeSection === section.label}
            onClick={() => router.push(section.route)}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
