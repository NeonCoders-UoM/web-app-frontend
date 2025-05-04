'use client';

import React from "react";
import Image from "next/image";
import SidebarButton from "@/components/atoms/sidebar-button/sidebar-button";
import { useRouter, usePathname } from "next/navigation";

interface SidebarProps {
  role: "super-admin" | "service-center-admin" | "cashier" | "data-operator";
  serviceCenters?: { id: string; name: string }[];
  logo?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  role,
  serviceCenters = [],
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const sidebarOptions: Record<string, { label: string; route: string }[]> = {
    "super-admin": [
      { label: "Dashboard", route: "/service-center-dashboard" },
      { label: "Clients", route: "/client" },
      { label: "Vehicles", route: "/vehicle" },
      { label: "Appointments", route: "/appointment" },
      { label: "Feedback", route: "/feedback" },
      { label: "Users", route: "/user-managment" },
      { label: "Service Status", route: "/service-status" },
      { label: "Closure Schedule", route: "/closure-schedule" },
      { label: "Loyalty Points", route: "/loyalty-points" },
      { label: "Logout", route: "/login" },
    ],
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
    <div className="w-64 min-h-screen flex flex-col bg-neutral-50 shadow-md">
      {/* Logo */}
      <div className="p-3 flex items-center justify-center">
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
      <div className="flex-1 px-4 space-y-2 mt-4">
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
