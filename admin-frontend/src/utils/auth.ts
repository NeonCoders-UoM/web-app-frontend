import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getCookie, deleteAllAuthCookies } from "./cookies";

export interface AuthUser {
  userId: string;
  userRole: string;
  userRoleId: string;
  stationId?: string;
  serviceCenterName?: string;
}

export const logout = () => {
  if (typeof window === "undefined") return;
  
  deleteAllAuthCookies();
  
  // Dispatch custom event to notify components of role change
  window.dispatchEvent(new Event("roleChanged"));
};

export const getAuthUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  
  const userId = getCookie("userId");
  const userRole = getCookie("userRole");
  const userRoleId = getCookie("userRoleId");
  const stationId = getCookie("station_id");
  const serviceCenterName = getCookie("serviceCenterName");

  if (!userId || !userRole || !userRoleId) {
    return null;
  }

  return {
    userId,
    userRole,
    userRoleId,
    stationId: stationId || undefined,
    serviceCenterName: serviceCenterName || undefined,
  };
};

export const isServiceCenterAdmin = (user: AuthUser | null): boolean => {
  return user?.userRole === "ServiceCenterAdmin" && user?.userRoleId === "3";
};

export const useServiceCenterAuth = (serviceCenterId?: string) => {
  const router = useRouter();

  useEffect(() => {
    const user = getAuthUser();
    
    if (!user) {
      console.warn("No authenticated user found");
      router.push("/login");
      return;
    }

    // Check if user is a service center admin
    if (isServiceCenterAdmin(user)) {
      // If a specific service center ID is provided, check if user can access it
      if (serviceCenterId && user.stationId && user.stationId !== serviceCenterId) {
        console.warn("Unauthorized access: User station_id doesn't match requested service center");
        router.push(`/service-center-dashboard/${user.stationId}`);
        return;
      }
    } else {
      // If not a service center admin, redirect to appropriate dashboard
      console.warn("Unauthorized access: User is not a service center admin");
      router.push("/login");
      return;
    }
  }, [serviceCenterId, router]);

  return getAuthUser();
};

export const getDashboardRoute = (user: AuthUser): string => {
  // Handle by role name first for clarity
  if (user.userRole === "SuperAdmin") {
    return "/super-admin";
  } else if (user.userRole === "Admin") {
    return "/admin-dashboard";
  } else if (user.userRole === "ServiceCenterAdmin" || user.userRole === "Cashier" || user.userRole === "DataOperator") {
    if (user.stationId) {
      return `/service-center-dashboard/${user.stationId}`;
    } else {
      throw new Error("Service Center Admin, Cashier, and Data Operator must have a station_id");
    }
  }

  // Fallback to role ID for other roles
  switch (user.userRoleId) {
    case "1": // Super Admin
      return "/super-admin";
    case "2": // Admin
      return "/admin-dashboard";
    case "3": // Service Center Admin
    case "4": // Cashier
    case "5": // Data Operator
      if (user.stationId) {
        return `/service-center-dashboard/${user.stationId}`;
      } else {
        throw new Error("Service Center Admin, Cashier, and Data Operator must have a station_id");
      }
    default:
      throw new Error(`Invalid role ID: ${user.userRoleId}`);
  }
}; 