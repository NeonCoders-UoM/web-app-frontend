'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/molecules/side-bar/side-bar';

const SidebarWrapper = () => {
  const pathname = usePathname();

  // Define routes where the sidebar should NOT be shown
  const hideSidebarRoutes = ['/', '/login', '/super-admin', '/admin-dashboard'];

  // Check if the current route is in the hideSidebarRoutes array
  const showSidebar = !hideSidebarRoutes.includes(pathname);

  return showSidebar ? <Sidebar role="super-admin" /> : null;
};

export default SidebarWrapper;