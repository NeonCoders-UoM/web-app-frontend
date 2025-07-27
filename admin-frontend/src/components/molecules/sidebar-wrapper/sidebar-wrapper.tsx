"use client";

import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Sidebar from "@/components/molecules/side-bar/side-bar";

const SidebarWrapper = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extract stationId from query or dashboard path
  const stationIdMatch = pathname.match(/\/service-center-dashboard\/([^\/]+)/);
  const queryStationId = searchParams.get("stationId");
  const currentStationId =
    queryStationId || (stationIdMatch ? stationIdMatch[1] : undefined);

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
    "/packages",
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
    <Sidebar role="super-admin" stationId={currentStationId} />
  ) : null;
};

export default SidebarWrapper;
