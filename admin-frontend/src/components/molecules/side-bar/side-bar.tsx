"use client";

import React from "react";
import Image from "next/image";
import SidebarButton from "@/components/atoms/sidebar-button/sidebar-button";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface SidebarProps {
  role: "super-admin" | "service-center-admin" | "cashier" | "data-operator";
  serviceCenters?: { id: string; name: string }[];
  logo?: string;
  stationId?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  role,
  serviceCenters = [],
  stationId,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extract service center ID from pathname if we're in a service center dashboard
  const serviceCenterIdMatch = pathname.match(
    /\/service-center-dashboard\/([^\/]+)/
  );
  // Also check for stationId in query parameters
  const queryStationId = searchParams.get("stationId");
  // Use prop if provided, else fallback to query or path
  const currentStationId =
    typeof stationId === "string" && stationId
      ? stationId
      : queryStationId ||
        (serviceCenterIdMatch ? serviceCenterIdMatch[1] : undefined);

  const getSidebarOptions = () => {
    // If we're in a service center dashboard, show service center specific options
    if (currentStationId) {
      return [
        {
          label: "Dashboard",
          route: `/service-center-dashboard/${currentStationId}?stationId=${currentStationId}`,
        },
        // {
        //   label: "Services",
        //   route: `/services?stationId=${currentStationId}`,
        // },
        {
          label: "Appointments",
          route: `/appointment?stationId=${currentStationId}`,
        },
        {
          label: "Clients",
          route: `/client?stationId=${currentStationId}`,
        },
        {
          label: "Vehicles",
          route: `/vehicle?stationId=${currentStationId}`,
        },
        {
          label: "Feedback",
          route: `/feedback?stationId=${currentStationId}`,
        },
        {
          label: "Service Status",
          route: `/service-status?stationId=${currentStationId}`,
        },
        {
          label: "Closure Schedule",
          route: `/closure-schedule?stationId=${currentStationId}`,
        },
        {
          label: "Loyalty Points",
          route: `/loyalty-points?stationId=${currentStationId}`,
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

  const handleServiceCenterClick = (centerId: string) => {
    router.push(`/service-center-dashboard/${centerId}?stationId=${centerId}`);
  };

  return (
    <div className="w-72 min-h-screen flex flex-col bg-[#010134] bg-gradient-to-b from-[#010134] to-[#010134] backdrop-blur-lg shadow-[4px_0_30px_rgba(0,0,128,0.5)] fixed left-0 top-0 z-50 sidebar-scrollbar overflow-y-auto border-r border-[#0000A0]/30">
      {/* Logo Section */}
      <div className="px-6 py-6 flex items-center justify-center border-b border-white/10 relative">
        <Image
          src="/images/logo3.png"
          alt="Logo"
          width={120}
          height={40}
        />
      </div>

      {/* Service Centers Section for Super Admin */}
      {role === "super-admin" && serviceCenters.length > 0 && (
        <div className="px-6 py-6 border-b border-[#0000A0]/30">
          <div className="mb-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse shadow-lg shadow-white/50"></div>
              Service Centers
            </h3>
          </div>
          <div className="space-y-2">
            {serviceCenters.map((center) => (
              <SidebarButton
                key={center.id}
                label={center.name}
                isActive={
                  pathname.startsWith(`/service-center-dashboard/${center.id}`) &&
                  (queryStationId === center.id ||
                    serviceCenterIdMatch?.[1] === center.id)
                }
                onClick={() => handleServiceCenterClick(center.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Navigation Section */}
      <div className="flex-1 px-4 py-4">
        <div className="space-y-1">
          {sections.map((section) => {
            // For active state, check if pathname and query match
            const url = new URL(section.route, "http://dummy");
            const sectionPath = url.pathname;
            const sectionStationId = url.searchParams.get("stationId");
            const isActive =
              pathname.startsWith(sectionPath) &&
              (!sectionStationId || sectionStationId === currentStationId);
            return (
              <SidebarButton
                key={section.label}
                label={section.label}
                isActive={isActive}
                onClick={() => router.push(section.route)}
              />
            );
          })}
        </div>
      </div>

      {/* Footer with version or additional info */}
      <div className="px-6 py-4 border-t border-[#0000A0]/30">
        <div className="text-xs text-white/70 text-center">
          <span className="block font-medium">VPass Admin</span>
          <span className="text-white/50">v2.0.1</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
