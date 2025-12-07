"use client";

import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Sidebar from "@/components/molecules/side-bar/side-bar";

const SidebarWrapper = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [userRole, setUserRole] = React.useState<
    "super-admin" | "admin" | "service-center-admin" | "cashier" | "data-operator"
  >("super-admin");

  // Extract stationId from query or dashboard path
  const stationIdMatch = pathname.match(/\/service-center-dashboard\/([^\/]+)/);
  const queryStationId = searchParams.get("stationId");
  const currentStationId =
    queryStationId || (stationIdMatch ? stationIdMatch[1] : undefined);

  // Get user role from localStorage and listen for changes
  React.useEffect(() => {
    const updateRole = () => {
      const role = localStorage.getItem("userRole");
      if (role) {
        // Convert backend role format to sidebar role format
        const roleMap: Record<string, "super-admin" | "admin" | "service-center-admin" | "cashier" | "data-operator"> = {
          SuperAdmin: "super-admin",
          Admin: "admin",
          ServiceCenterAdmin: "service-center-admin",
          Cashier: "cashier",
          DataOperator: "data-operator",
        };
        setUserRole(roleMap[role] || "super-admin");
      }
    };

    // Initial role update
    updateRole();

    // Listen for storage changes (when user logs in/out in the same tab)
    window.addEventListener("storage", updateRole);
    
    // Custom event for same-tab role changes
    window.addEventListener("roleChanged", updateRole);

    return () => {
      window.removeEventListener("storage", updateRole);
      window.removeEventListener("roleChanged", updateRole);
    };
  }, [pathname]); // Re-run when pathname changes to catch role updates after login

  // Define routes where the sidebar should NOT be shown
  const hideSidebarRoutes = [
    "/",
    "/login",
    "/super-admin",
    "/admin-dashboard",
    "/service-centers/add",
    "/service-centers/[id]/edit",
    "/service-centers/[id]/view",
    "/services",
    "/services/add",
    "/services/[id]/edit",
    "/services/[id]/view",
    "/packages",
    "/packages/add",
    "/packages/[id]/edit",
    "/packages/[id]/view",
    "/user-managment",
    "/user-managment/add-user",
    "/user-managment/edit/[id]",
  ];

  // Function to check if pathname matches any hideSidebarRoutes pattern
  const shouldHideSidebar = hideSidebarRoutes.some((route) => {
    // Handle dynamic routes with [id]
    if (route.includes("[id]")) {
      const baseRoute = route.replace("[id]", "[^/]+"); // Replace [id] with any non-slash characters
      const regex = new RegExp(`^${baseRoute}$`);
      return regex.test(pathname);
    }
    return pathname === route;
  });

  const showSidebar = !shouldHideSidebar;

  // Add a useEffect to adjust body margin based on sidebar visibility
  React.useEffect(() => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      if (showSidebar) {
        mainElement.style.marginLeft = '288px'; // 18rem = 288px for w-72
        mainElement.style.paddingLeft = '1rem';
      } else {
        mainElement.style.marginLeft = '0';
        mainElement.style.paddingLeft = '1rem';
      }
    }
  }, [showSidebar]);

  // Pass stationId as a prop if needed (optional, for future Sidebar API)
  return showSidebar ? (
    <Sidebar role={userRole} stationId={currentStationId} />
  ) : null;
};

export default SidebarWrapper;
