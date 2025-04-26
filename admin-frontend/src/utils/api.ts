import { ServiceCenter, DashboardStats } from "@/types";


const mockServiceCenters: ServiceCenter[] = [
  {
    id: "1",
    serviceCenterName: "Center A",
    email: "a@example.com",
    telephoneNumber: "1234567890",
    address: "123 A St",
    ownersName: "Owner A",
    vatNumber: "VAT1",
    registrationNumber: "REG1",
    commissionDate: "2023-01-01",
    availableServices: ["Oil Change"],
    serviceHours: { start: "09:00", end: "17:00" },
    photoUrl: "",
    registrationCopyUrl: "",
  },
  {
    id: "2",
    serviceCenterName: "Center B",
    email: "b@example.com",
    telephoneNumber: "0987654321",
    address: "456 B St",
    ownersName: "Owner B",
    vatNumber: "VAT2",
    registrationNumber: "REG2",
    commissionDate: "2023-01-02",
    availableServices: ["Tire Replacement"],
    serviceHours: { start: "09:00", end: "17:00" },
    photoUrl: "",
    registrationCopyUrl: "",
  },
  {
    id: "13", // Added to match the ID in the error
    serviceCenterName: "Center C",
    email: "c@example.com",
    telephoneNumber: "5555555555",
    address: "789 C St",
    ownersName: "Owner C",
    vatNumber: "VAT3",
    registrationNumber: "REG3",
    commissionDate: "2023-01-03",
    availableServices: ["Brake Service"],
    serviceHours: { start: "09:00", end: "17:00" },
    photoUrl: "",
    registrationCopyUrl: "",
  },
];

// Fetch all service centers (used in SuperAdminDashboard)
export const fetchServiceCenters = async (): Promise<ServiceCenter[]> => {
  try {
    // In a real app, this would be an API call like:
    // const response = await fetch("/api/service-centers");
    // if (!response.ok) throw new Error("Failed to fetch service centers");
    // return response.json();

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockServiceCenters;
  } catch (error) {
    console.error("Error in fetchServiceCenters:", error);
    throw error;
  }
};

// Fetch a single service center by ID (used in EditServiceCenter)
export const fetchServiceCenterById = async (id: string): Promise<ServiceCenter | null> => {
  try {
    // In a real app, this would be an API call like:
    // const response = await fetch(`/api/service-centers/${id}`);
    // if (!response.ok) return null;
    // return response.json();

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    const serviceCenter = mockServiceCenters.find((sc) => sc.id === id);
    return serviceCenter || null; // Return null if not found
  } catch (error) {
    console.error("Error in fetchServiceCenterById:", error);
    throw error;
  }
};

// Fetch dashboard stats (used in SuperAdminDashboard)
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // In a real app, this would be an API call like:
    // const response = await fetch("/api/dashboard-stats");
    // if (!response.ok) throw new Error("Failed to fetch dashboard stats");
    // return response.json();

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      customers: 100,
      vehicles: 50,
      serviceCenters: mockServiceCenters.length,
    };
  } catch (error) {
    console.error("Error in fetchDashboardStats:", error);
    throw error;
  }
};

// Delete a service center (used in SuperAdminDashboard)
export const deleteServiceCenter = async (id: string): Promise<void> => {
  try {
    // In a real app, this would be an API call like:
    // const response = await fetch(`/api/service-centers/${id}`, { method: "DELETE" });
    // if (!response.ok) throw new Error("Failed to delete service center");

    const index = mockServiceCenters.findIndex((sc) => sc.id === id);
    if (index === -1) {
      throw new Error(`Service Center with ID ${id} not found`);
    }
    mockServiceCenters.splice(index, 1);
  } catch (error) {
    console.error("Error in deleteServiceCenter:", error);
    throw error;
  }
};

// Update a service center (used in EditServiceCenter)
export const updateServiceCenter = async (id: string, data: Omit<ServiceCenter, "id">): Promise<void> => {
  try {
    // In a real app, this would be an API call like:
    // const response = await fetch(`/api/service-centers/${id}`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(data),
    // });
    // if (!response.ok) throw new Error("Failed to update service center");

    const index = mockServiceCenters.findIndex((sc) => sc.id === id);
    if (index === -1) {
      throw new Error(`Service Center with ID ${id} not found`);
    }
    mockServiceCenters[index] = { id, ...data };
  } catch (error) {
    console.error("Error in updateServiceCenter:", error);
    throw error;
  }
};