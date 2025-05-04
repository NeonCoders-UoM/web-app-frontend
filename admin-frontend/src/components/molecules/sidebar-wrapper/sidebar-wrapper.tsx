'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/molecules/side-bar/side-bar';

const SidebarWrapper = () => {
  const pathname = usePathname();

  // Define routes where the sidebar should NOT be shown
  const hideSidebarRoutes = [
    '/',
    '/login',
    '/super-admin',
    '/admin-dashboard',
    '/service-centers/add',
    '/service-centers/[id]/edit',
    '/service-centers/[id]/view',
  ];

  // Function to check if pathname matches any hideSidebarRoutes pattern
  const shouldHideSidebar = hideSidebarRoutes.some((route) => {
    // Handle dynamic routes with [id]
    if (route.includes('[id]')) {
      const baseRoute = route.replace('[id]', '[^/]+'); // Replace [id] with any non-slash characters
      const regex = new RegExp(`^${baseRoute}$`);
      return regex.test(pathname);
    }
    return pathname === route;
  });

  const showSidebar = !shouldHideSidebar;

  return showSidebar ? <Sidebar role="super-admin" /> : null;
};

export default SidebarWrapper;