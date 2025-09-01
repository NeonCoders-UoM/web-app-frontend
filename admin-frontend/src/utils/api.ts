import { 
  ServiceCenter, 
  DashboardStats, 
  Client, 
  User, 
  Vehicle,
  ServiceCenterDTO,
  CreateServiceCenterDTO,
  UpdateServiceCenterDTO,
  ServiceCenterServiceDTO,
  CreateServiceCenterServiceDTO,
  SystemService,
  CreateSystemServiceDTO,
  UpdateSystemServiceDTO,
  Package,
  CreatePackageDTO,
  UpdatePackageDTO,
  CreateServiceCenterWithServicesDTO,
  ClosureSchedule,
  CreateClosureScheduleDTO,
  UpdateClosureScheduleDTO,
  ServiceAvailabilityDTO,
  UpdateServiceAvailabilityDTO,
  FeedbackDTO,
  CreateFeedbackDTO,
  UpdateFeedbackDTO,
  FeedbackStatsDTO,
  FeedbackFilters
} from "@/types";
import axiosInstance from "./axios";


// Mock data (as provided)
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
    commissionRate: "20",
    availableServices: ["Oil Change"],
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
    commissionRate: "20",
    availableServices: ["Tire Replacement"],
    photoUrl: "",
    registrationCopyUrl: "",
  },
  {
    id: "13",
    serviceCenterName: "Center C",
    email: "c@example.com",
    telephoneNumber: "5555555555",
    address: "789 C St",
    ownersName: "Owner C",
    vatNumber: "VAT3",
    registrationNumber: "REG3",
    commissionRate: "20",
    availableServices: ["Brake Service"],
    photoUrl: "",
    registrationCopyUrl: "",
  },
  {
    id: "SC-0001",
    serviceCenterName: "Speed Motors",
    email: "maria.rodriguez@gmail.com",
    telephoneNumber: "+1 (961) 523-4453",
    address: "456 Ocean Avenue, Miami, FL 33146",
    ownersName: "",
    vatNumber: "",
    registrationNumber: "",
    commissionRate: "",
    availableServices: [],
    photoUrl: "",
    registrationCopyUrl: "",
  },
  {
    id: "SC-0002",
    serviceCenterName: "AutoFix Hub",
    email: "juan.rodriguez@gmail.com",
    telephoneNumber: "+1 (961) 523-4453",
    address: "234 Oak Street, Flat 7",
    ownersName: "",
    vatNumber: "",
    registrationNumber: "",
    commissionRate: "",
    availableServices: [],
    photoUrl: "",
    registrationCopyUrl: "",
  },
  {
    id: "SC-0003",
    serviceCenterName: "Rapid Repairs",
    email: "maria.rodriguez@gmail.com",
    telephoneNumber: "+1 (961) 523-4453",
    address: "234 Oak Street, Flat 7",
    ownersName: "",
    vatNumber: "",
    registrationNumber: "",
    commissionRate: "",
    availableServices: [],
    photoUrl: "",
    registrationCopyUrl: "",
  },
  {
    id: "SC-0004",
    serviceCenterName: "NextGen Motors",
    email: "juan.rodriguez@gmail.com",
    telephoneNumber: "+1 (961) 523-4453",
    address: "456 Ocean Avenue, Miami, FL 33146",
    ownersName: "",
    vatNumber: "",
    registrationNumber: "",
    commissionRate: "",
    availableServices: [],
    photoUrl: "",
    registrationCopyUrl: "",
  },
  {
    id: "SC-0005",
    serviceCenterName: "Prime AutoCare",
    email: "maria.rodriguez@gmail.com",
    telephoneNumber: "+1 (961) 523-4453",
    address: "234 Oak Street, Flat 7",
    ownersName: "",
    vatNumber: "",
    registrationNumber: "",
    commissionRate: "",
    availableServices: [],
    photoUrl: "",
    registrationCopyUrl: "",
  },
  {
    id: "SC-0006",
    serviceCenterName: "Elite Vehicle Care",
    email: "maria.rodriguez@gmail.com",
    telephoneNumber: "+1 (961) 523-4453",
    address: "234 Oak Street, Flat 7",
    ownersName: "",
    vatNumber: "",
    registrationNumber: "",
    commissionRate: "",
    availableServices: [],
    photoUrl: "",
    registrationCopyUrl: "",
  },
  {
    id: "SC-0007",
    serviceCenterName: "TurboTune Auto",
    email: "juan.rodriguez@gmail.com",
    telephoneNumber: "+1 (961) 523-4453",
    address: "456 Ocean Avenue, Miami, FL 33146",
    ownersName: "",
    vatNumber: "",
    registrationNumber: "",
    commissionRate: "",
    availableServices: [],
    photoUrl: "",
    registrationCopyUrl: "",
  },
];

// ========== Vehicle API Functions ==========

// Backend vehicle response interface (matching your backend API)
interface VehicleResponse {
  vehicleId: number;
  customerId: number;
  model: string;
  chassisNumber: string;
  mileage?: number;
}

// Vehicle registration DTO (for creating/updating vehicles)
export interface VehicleRegistrationDto {
  registrationNumber: string;
  brand: string;
  model: string;
  chassisNumber: string;
  mileage?: number;
  fuel: string;
  year: string;
}

// Frontend vehicle interface (for display)
interface VehicleDisplay {
  id: string;
  vehicleId: number;
  customerId: number;
  client: string;
  clientEmail: string;
  pictureSrc: string;
  type: string; // We'll derive this from fuel type or set as "Car"
  brand: string;
  model: string;
  licenseplate: string; // This will be registrationNumber
  registrationNumber: string;
  chassisNumber: string;
  mileage?: number;
  fuel: string;
  year: string;
}

// Fetch all vehicles from the system
export const fetchVehicles = async (): Promise<VehicleDisplay[]> => {
  try {
    console.log("fetchVehicles: Starting to fetch all vehicles from system...");
    
    // Try different possible API endpoints for getting all vehicles
    let response;
    let allVehicles: VehicleResponse[] = [];
    
    try {
      // Try the main vehicles endpoint
      response = await axiosInstance.get("/Vehicles");
      allVehicles = response.data;
      console.log("fetchVehicles: Successfully fetched from /Vehicles");
    } catch (error1) {
      console.log("fetchVehicles: /Vehicles failed, trying /api/Vehicles");
      try {
        response = await axiosInstance.get("/api/Vehicles");
        allVehicles = response.data;
        console.log("fetchVehicles: Successfully fetched from /api/Vehicles");
      } catch (error2) {
        console.log("fetchVehicles: /api/Vehicles failed, trying /Vehicle");
        try {
          response = await axiosInstance.get("/Vehicle");
          allVehicles = response.data;
          console.log("fetchVehicles: Successfully fetched from /Vehicle");
        } catch (error3) {
          console.log("fetchVehicles: All API endpoints failed");
          throw new Error("All vehicle API endpoints failed");
        }
      }
    }
    
    console.log("fetchVehicles: Total vehicles from API:", allVehicles.length);

    // Fetch all customers to get customer information
    let customers: Client[] = [];
    try {
      customers = await fetchClients();
      console.log("fetchVehicles: Successfully fetched customers:", customers.length);
    } catch (error) {
      console.log("fetchVehicles: Failed to fetch customers, will use default values");
      customers = [];
    }

    // Transform vehicles to display format
    const transformedVehicles = allVehicles.map((vehicle) => {
      // Find customer information
      const customer = customers.find(c => c.customerId === vehicle.customerId);
      
      return {
        id: `#${vehicle.vehicleId.toString().padStart(4, "0")}`,
        vehicleId: vehicle.vehicleId,
        customerId: vehicle.customerId,
        client: customer ? `${customer.firstName} ${customer.lastName}` : "Unknown Customer",
        clientEmail: customer ? customer.email : "unknown@example.com",
        pictureSrc: "https://placehold.co/80x80/svg?text=Client",
        type: "Car", // Default type since we don't have fuel info
        brand: "Unknown", // Default brand since backend doesn't provide it
        model: vehicle.model,
        licenseplate: vehicle.chassisNumber, // Use chassis number as license plate for now
        registrationNumber: vehicle.chassisNumber, // Use chassis number as registration
        chassisNumber: vehicle.chassisNumber,
        mileage: vehicle.mileage,
        fuel: "Unknown", // Default fuel type
        year: "Unknown", // Default year
      };
    });

    console.log("fetchVehicles: Transformed vehicles:", transformedVehicles.length);
    return transformedVehicles;
  } catch (error) {
    console.error("Error in fetchVehicles:", error);
    console.log("fetchVehicles: No vehicles available from backend");
    return []; // Return empty array if backend fails
  }
};

// Helper function to derive vehicle type from fuel type
const getVehicleType = (fuel: string): string => {
  const fuelLower = fuel.toLowerCase();
  if (fuelLower.includes('diesel')) return 'Truck';
  if (fuelLower.includes('hybrid')) return 'Hybrid';
  if (fuelLower.includes('electric')) return 'Electric';
  return 'Car'; // Default type
};

// Fetch vehicles for a specific customer
export const fetchCustomerVehicles = async (customerId: number): Promise<VehicleResponse[]> => {
  try {
    const response = await axiosInstance.get(`/Customers/${customerId}/vehicles`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching vehicles for customer ${customerId}:`, error);
    throw error;
  }
};

// Fetch a specific vehicle
export const fetchVehicleById = async (customerId: number, vehicleId: number): Promise<VehicleResponse | null> => {
  try {
    const response = await axiosInstance.get(`/Customers/${customerId}/vehicles/${vehicleId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching vehicle ${vehicleId} for customer ${customerId}:`, error);
    return null;
  }
};

// Register a new vehicle for a customer
export const registerVehicle = async (customerId: number, vehicleData: VehicleRegistrationDto): Promise<VehicleResponse> => {
  try {
    const response = await axiosInstance.post(`/Customers/${customerId}/vehicles`, vehicleData);
    return response.data;
  } catch (error) {
    console.error(`Error registering vehicle for customer ${customerId}:`, error);
    throw error;
  }
};

// Update a vehicle
export const updateVehicle = async (customerId: number, vehicleId: number, vehicleData: VehicleRegistrationDto): Promise<boolean> => {
  try {
    await axiosInstance.put(`/Customers/${customerId}/vehicles/${vehicleId}`, vehicleData);
    return true;
  } catch (error) {
    console.error(`Error updating vehicle ${vehicleId} for customer ${customerId}:`, error);
    throw error;
  }
};

// Delete a vehicle
export const deleteVehicle = async (customerId: number, vehicleId: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/Customers/${customerId}/vehicles/${vehicleId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting vehicle ${vehicleId} for customer ${customerId}:`, error);
    throw error;
  }
};

// Fetch all service centers
export const fetchServiceCenters = async (): Promise<ServiceCenter[]> => {
  try {
    console.log("Fetching service centers from API...");
    const response = await axiosInstance.get("/ServiceCenters");
    console.log("API Response:", response.data);
    
    // Transform backend data to frontend format
    const transformedData = response.data.map((sc: ServiceCenterDTO) => ({
      id: sc.station_id?.toString() || "",
      Station_id: sc.station_id,
      serviceCenterName: sc.station_name || "",
      Station_name: sc.station_name,
      email: sc.email || "",
      Email: sc.email,
      address: sc.address || "",
      Address: sc.address,
      telephoneNumber: sc.telephone || "",
      Telephone: sc.telephone,
      ownersName: sc.ownerName || "",
      OwnerName: sc.ownerName,
      vatNumber: sc.vatNumber || "",
      VATNumber: sc.vatNumber,
      registrationNumber: sc.registerationNumber || "",
      RegisterationNumber: sc.registerationNumber,
      Station_status: sc.station_status,
      Latitude: sc.Latitude,
      Longitude: sc.Longitude,
      DefaultDailyAppointmentLimit: sc.DefaultDailyAppointmentLimit,
      commissionRate: "",
      availableServices: [],
      photoUrl: "",
      registrationCopyUrl: "",
    }));
    
    console.log("Transformed data:", transformedData);
    return transformedData;
  } catch (error) {
    console.error("Error in fetchServiceCenters:", error);
    console.log("Falling back to mock data...");
    // Fallback to mock data if API fails
    const mockData = mockServiceCenters.map((sc) => ({
      ...sc,
      id: sc.id,
      serviceCenterName: sc.serviceCenterName,
      email: sc.email,
      telephoneNumber: sc.telephoneNumber,
      address: sc.address,
    }));
    console.log("Using mock data:", mockData);
    return mockData;
  }
};

// Backend customer response interface
interface CustomerResponse {
  customerId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  loyaltyPoints: number;
  address?: string;
  nic?: string;
}

// Fetch all clients
export const fetchClients = async (): Promise<Client[]> => {
  try {
    const response = await axiosInstance.get("/Customers");
    
    // Transform the backend data to match frontend expectations
    return response.data.map((customer: CustomerResponse) => ({
      customerId: customer.customerId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      loyaltyPoints: customer.loyaltyPoints,
      address: customer.address || "",
      nic: customer.nic || "",
      // Legacy fields for backward compatibility
      id: `client-${customer.customerId}`,
      client: `${customer.firstName} ${customer.lastName}`,
      phoneno: customer.phoneNumber,
      points: customer.loyaltyPoints,
      profilePicture: "https://placehold.co/80x80/svg?text=Client",
    }));
  } catch (error) {
    console.error("Error in fetchClients:", error);
    // Return empty array if API call fails
    return [];
  }
};

// Fetch a single client by ID
export const fetchClientById = async (id: string): Promise<Client | null> => {
  try {
    const numericId = id.startsWith('client-') ? parseInt(id.replace('client-', '')) : parseInt(id);
    const response = await axiosInstance.get(`/Customers/${numericId}`);
    
    const customer: CustomerResponse = response.data;
    
    return {
      customerId: customer.customerId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      loyaltyPoints: customer.loyaltyPoints,
      address: customer.address || "",
      nic: customer.nic || "",
      // Legacy fields for backward compatibility
      id: `client-${customer.customerId}`,
      client: `${customer.firstName} ${customer.lastName}`,
      phoneno: customer.phoneNumber,
      points: customer.loyaltyPoints,
      profilePicture: "https://placehold.co/80x80/svg?text=Client",
    };
  } catch (error) {
    console.error("Error in fetchClientById:", error);
    return null;
  }
};

// Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await axiosInstance.get("Admin/all-users");
    return response.data;
  } catch (error) {
    console.error("Error in fetchUsers:", error);
    throw error;
  }
};

// Fetch current user details
export const fetchCurrentUser = async (): Promise<{ firstName: string; lastName: string; email: string; role: string } | null> => {
  try {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    if (!userId) {
      console.error("No userId found in localStorage");
      return null;
    }

    const response = await axiosInstance.get(`/Admin/${userId}`);
    return {
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      email: response.data.email,
      role: response.data.role
    };
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

// Fetch a single service center by ID
export const fetchServiceCenterById = async (id: string): Promise<ServiceCenter | null> => {
  try {
    const response = await axiosInstance.get(`/ServiceCenters/${id}`);
    const sc = response.data;
    
    // Transform backend data to frontend format
    return {
      id: sc.station_id?.toString() || "",
      Station_id: sc.station_id,
      serviceCenterName: sc.station_name || "",
      Station_name: sc.station_name,
      email: sc.email || "",
      Email: sc.email,
      address: sc.address || "",
      Address: sc.address,
      telephoneNumber: sc.telephone || "",
      Telephone: sc.telephone,
      ownersName: sc.ownerName || "",
      OwnerName: sc.ownerName,
      vatNumber: sc.vatNumber || "",
      VATNumber: sc.vatNumber,
      registrationNumber: sc.registerationNumber || "",
      RegisterationNumber: sc.registerationNumber,
      Station_status: sc.station_status,
      commissionRate: "",
      availableServices: [],
      photoUrl: "",
      registrationCopyUrl: "",
    };
  } catch (error) {
    console.error("Error in fetchServiceCenterById:", error);
    // Fallback to mock data if API fails
    const serviceCenter = mockServiceCenters.find((sc) => sc.id === id);
    return serviceCenter || null;
  }
};

// Fetch dashboard stats
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    console.log("fetchDashboardStats: Starting to fetch dashboard stats...");
    // Get real counts from the backend
    const [clients, vehicles, serviceCenters] = await Promise.all([
      fetchClients(),
      fetchVehicles(),
      fetchServiceCenters(),
    ]);
    
    const stats = {
      customers: clients.length,
      vehicles: vehicles.length,
      serviceCenters: serviceCenters.length,
    };
    
    console.log("fetchDashboardStats: Real stats calculated:", stats);
    return stats;
  } catch (error) {
    console.error("Error in fetchDashboardStats:", error);
    // Return zeros if backend fails
    const emptyStats = {
      customers: 0,
      vehicles: 0,
      serviceCenters: 0,
    };
    console.log("fetchDashboardStats: Using empty stats due to backend failure:", emptyStats);
    return emptyStats;
  }
};

// Delete a service center
export const deleteServiceCenter = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/ServiceCenters/${id}`);
  } catch (error) {
    console.error("Error in deleteServiceCenter:", error);
    throw error;
  }
};

// Update a service center
export const updateServiceCenter = async (id: string, data: Omit<ServiceCenter, "id">): Promise<void> => {
  try {
    const updateData: UpdateServiceCenterDTO = {
      ownerName: data.ownersName || data.OwnerName,
      vatNumber: data.vatNumber || data.VATNumber,
      registerationNumber: data.registrationNumber || data.RegisterationNumber,
      station_name: data.serviceCenterName || data.Station_name,
      email: data.email || data.Email,
      telephone: data.telephoneNumber || data.Telephone,
      address: data.address || data.Address,
      station_status: data.Station_status || "Active",
    };
    
    await axiosInstance.put(`/ServiceCenters/${id}`, updateData);
  } catch (error) {
    console.error("Error in updateServiceCenter:", error);
    throw error;
  }
};

// Create a new service center
export const createServiceCenter = async (data: Omit<ServiceCenter, "id">): Promise<ServiceCenter> => {
  try {
    const createData: CreateServiceCenterDTO = {
      ownerName: data.ownersName || data.OwnerName || "",
      vatNumber: data.vatNumber || data.VATNumber || "",
      registerationNumber: data.registrationNumber || data.RegisterationNumber || "",
      station_name: data.serviceCenterName || data.Station_name || "",
      email: data.email || data.Email || "",
      telephone: data.telephoneNumber || data.Telephone || "",
      address: data.address || data.Address || "",
      station_status: data.Station_status || "Active",
      Latitude: 0, // Default latitude
      Longitude: 0, // Default longitude
    };
    
    const response = await axiosInstance.post("/ServiceCenters", createData);
    const sc = response.data;
    
    // Transform backend response to frontend format
    return {
      id: sc.station_id?.toString() || "",
      Station_id: sc.station_id,
      serviceCenterName: sc.station_name || "",
      Station_name: sc.station_name,
      email: sc.email || "",
      Email: sc.email,
      address: sc.address || "",
      Address: sc.address,
      telephoneNumber: sc.telephone || "",
      Telephone: sc.telephone,
      ownersName: sc.ownerName || "",
      OwnerName: sc.ownerName,
      vatNumber: sc.vatNumber || "",
      VATNumber: sc.vatNumber,
      registrationNumber: sc.registerationNumber || "",
      RegisterationNumber: sc.registerationNumber,
      Station_status: sc.station_status,
      commissionRate: "",
      availableServices: [],
      photoUrl: "",
      registrationCopyUrl: "",
    };
  } catch (error) {
    console.error("Error in createServiceCenter:", error);
    throw error;
  }
};

// Create a service center with package and services
export const createServiceCenterWithServices = async (data: CreateServiceCenterWithServicesDTO): Promise<ServiceCenter> => {
  try {
    // First create the service center
    const createData: CreateServiceCenterDTO = {
      ownerName: data.ownerName,
      vatNumber: data.vatNumber,
      registerationNumber: data.registerationNumber,
      station_name: data.station_name,
      email: data.email,
      telephone: data.telephone,
      address: data.address,
      station_status: data.station_status,
      Latitude: data.lat, // Changed to match backend
      Longitude: data.lng, // Changed to match backend
      DefaultDailyAppointmentLimit: data.defaultDailyAppointmentLimit // Add appointment limit
    };
    
    const response = await axiosInstance.post("/ServiceCenters", createData);
    const serviceCenter = response.data;
    const stationId = serviceCenter.station_id;
    
    // Then add the selected services with pricing
    const selectedServices = data.services.filter(service => service.isSelected);
    
    for (const service of selectedServices) {
      await axiosInstance.post(`/ServiceCenters/${stationId}/Services`, {
        station_id: stationId,
        serviceId: service.serviceId,
        packageId: data.packageId,
        customPrice: service.basePrice,
        serviceCenterBasePrice: service.basePrice,
        serviceCenterLoyaltyPoints: 10,
        isAvailable: true,
        notes: `Base price: ${service.basePrice}`
      });
    }
    
    // Transform backend response to frontend format
    return {
      id: serviceCenter.station_id?.toString() || "",
      Station_id: serviceCenter.station_id,
      serviceCenterName: serviceCenter.station_name || "",
      Station_name: serviceCenter.station_name,
      email: serviceCenter.email || "",
      Email: serviceCenter.email,
      address: serviceCenter.address || "",
      Address: serviceCenter.address,
      telephoneNumber: serviceCenter.telephone || "",
      Telephone: serviceCenter.telephone,
      ownersName: serviceCenter.ownerName || "",
      OwnerName: serviceCenter.ownerName,
      vatNumber: serviceCenter.vatNumber || "",
      VATNumber: serviceCenter.vatNumber,
      registrationNumber: serviceCenter.registerationNumber || "",
      RegisterationNumber: serviceCenter.registerationNumber,
      Station_status: serviceCenter.station_status,
      commissionRate: "",
      availableServices: [],
      photoUrl: "",
      registrationCopyUrl: "",
    };
  } catch (error) {
    console.error("Error in createServiceCenterWithServices:", error);
    throw error;
  }
};

// Fetch service centers by status
export const fetchServiceCentersByStatus = async (status: string): Promise<ServiceCenter[]> => {
  try {
    const response = await axiosInstance.get(`/ServiceCenters/status/${status}`);
    
    return response.data.map((sc: ServiceCenterDTO) => ({
      id: sc.station_id?.toString() || "",
      Station_id: sc.station_id,
      serviceCenterName: sc.station_name || "",
      Station_name: sc.station_name,
      email: sc.email || "",
      Email: sc.email,
      address: sc.address || "",
      Address: sc.address,
      telephoneNumber: sc.telephone || "",
      Telephone: sc.telephone,
      ownersName: sc.ownerName || "",
      OwnerName: sc.ownerName,
      vatNumber: sc.vatNumber || "",
      VATNumber: sc.vatNumber,
      registrationNumber: sc.registerationNumber || "",
      RegisterationNumber: sc.registerationNumber,
      Station_status: sc.station_status,
      commissionRate: "",
      availableServices: [],
      photoUrl: "",
      registrationCopyUrl: "",
    }));
  } catch (error) {
    console.error("Error in fetchServiceCentersByStatus:", error);
    throw error;
  }
};

// Update service center status
export const updateServiceCenterStatus = async (id: string, status: string): Promise<void> => {
  try {
    await axiosInstance.patch(`/ServiceCenters/${id}/status`, JSON.stringify(status), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error in updateServiceCenterStatus:", error);
    throw error;
  }
};

// Fetch services for a specific service center
export const fetchServiceCenterServices = async (stationId: string): Promise<ServiceCenterServiceDTO[]> => {
  try {
    const response = await axiosInstance.get(`/ServiceCenters/${stationId}/Services`);
    return response.data;
  } catch (error) {
    console.error("Error in fetchServiceCenterServices:", error);
    throw error;
  }
};

// Fetch package information for a service center
export const fetchServiceCenterPackage = async (stationId: string): Promise<Package | null> => {
  try {
    const response = await axiosInstance.get(`/ServiceCenters/${stationId}/Package`);
    return response.data;
  } catch (error) {
    // Only log error if it's not a 404 (endpoint doesn't exist)
    const axiosError = error as { response?: { status?: number } };
    if (axiosError.response?.status !== 404) {
      console.error("Error fetching service center package:", error);
    }
    return null;
  }
};

// Add a service to a service center
export const addServiceToServiceCenter = async (
  stationId: string, 
  serviceData: CreateServiceCenterServiceDTO
): Promise<ServiceCenterServiceDTO> => {
  try {
    const response = await axiosInstance.post(`/ServiceCenters/${stationId}/Services`, serviceData);
    return response.data;
  } catch (error) {
    console.error("Error in addServiceToServiceCenter:", error);
    throw error;
  }
};

// Remove a service from a service center
export const removeServiceFromServiceCenter = async (stationId: string, serviceId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/ServiceCenters/${stationId}/Services/${serviceId}`);
  } catch (error) {
    console.error("Error in removeServiceFromServiceCenter:", error);
    throw error;
  }
};

// Update a service center service
export const updateServiceCenterService = async (
  stationId: string, 
  serviceId: string, 
  updateData: { customPrice: number; loyaltyPoints: number; isAvailable?: boolean }
): Promise<ServiceCenterServiceDTO> => {
  try {
    const response = await axiosInstance.put(`/ServiceCenters/${stationId}/Services/${serviceId}`, {
      customPrice: updateData.customPrice,
      serviceCenterLoyaltyPoints: updateData.loyaltyPoints,
      ...(updateData.isAvailable !== undefined && { isAvailable: updateData.isAvailable }),
    });
    return response.data;
  } catch (error) {
    console.error("Error in updateServiceCenterService:", error);
    throw error;
  }
};

// Toggle service availability for a service center
export const toggleServiceCenterServiceAvailability = async (
  stationId: string, 
  serviceCenterServiceId: string
): Promise<ServiceCenterServiceDTO[]> => {
  try {
    console.log(`Toggling service center service ID: ${serviceCenterServiceId}`);
    console.log(`Making PATCH request to: /ServiceCenterServices/${serviceCenterServiceId}/toggle-availability`);

    // Use the toggle endpoint which is simpler and more reliable
    await axiosInstance.patch(`/ServiceCenterServices/${serviceCenterServiceId}/toggle-availability`);
    
    console.log("Toggle request successful, fetching updated services");
    
    // Fetch the updated list after toggling
    const updatedServices = await fetchServiceCenterServices(stationId);
    return updatedServices;
  } catch (error) {
    console.error("Error in toggleServiceCenterServiceAvailability:", error);
    throw error;
  }
};

// Service Availability APIs
export const addServiceAvailability = async (serviceAvailability: ServiceAvailabilityDTO): Promise<ServiceAvailabilityDTO> => {
  try {
    const response = await axiosInstance.post('/ServiceAvailability', serviceAvailability);
    return response.data;
  } catch (error) {
    console.error("Error in addServiceAvailability:", error);
    throw error;
  }
};

export const getServiceAvailabilities = async (
  serviceCenterId: number,
  weekNumber: number
): Promise<ServiceAvailabilityDTO[]> => {
  try {
    const response = await axiosInstance.get(`/ServiceAvailability/${serviceCenterId}`, {
      params: { weekNumber }
    });
    return response.data;
  } catch (error) {
    console.error("Error in getServiceAvailabilities:", error);
    throw error;
  }
};

export const getServiceAvailability = async (
  serviceCenterId: number,
  serviceId: number,
  weekNumber: number,
  day?: string
): Promise<ServiceAvailabilityDTO[]> => {
  try {
    const response = await axiosInstance.get(
      `/ServiceAvailability/${serviceCenterId}/${serviceId}`,
      { params: { weekNumber, day } }
    );
    return response.data;
  } catch (error) {
    console.error("Error in getServiceAvailability:", error);
    throw error;
  }
};

export const updateServiceAvailability = async (
  id: number,
  updateData: UpdateServiceAvailabilityDTO
): Promise<ServiceAvailabilityDTO> => {
  try {
    const response = await axiosInstance.put(`/ServiceAvailability/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error in updateServiceAvailability:", error);
    throw error;
  }
};

export const deleteServiceAvailability = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/ServiceAvailability/${id}`);
  } catch (error) {
    console.error("Error in deleteServiceAvailability:", error);
    throw error;
  }
};

export const deleteServiceAvailabilities = async (ids: number[]): Promise<void> => {
  try {
    await axiosInstance.delete('/ServiceAvailability/bulk', { data: ids });
  } catch (error) {
    console.error("Error in deleteServiceAvailabilities:", error);
    throw error;
  }
};

// Update customer data
export const updateCustomer = async (customerId: number, customerData: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  nic: string;
}): Promise<boolean> => {
  try {
    // Note: You'll need to add a PUT endpoint in your backend for updating customers
    // For now, this will call the endpoint when it's available
    await axiosInstance.put(`/Customers/${customerId}`, customerData);
    return true;
  } catch (error) {
    console.error("Error in updateCustomer:", error);
    throw error;
  }
};

// Create new customer
export const createCustomer = async (customerData: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  nic: string;
}): Promise<number> => {
  try {
    const response = await axiosInstance.post('/Customers', customerData);
    return response.data.customerId;
  } catch (error) {
    console.error("Error in createCustomer:", error);
    throw error;
  }
};

// Delete customer
export const deleteCustomer = async (customerId: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/Customers/${customerId}`);
    return true;
  } catch (error) {
    console.error("Error in deleteCustomer:", error);
    throw error;
  }
};

// ========== Vehicle Service History API Functions ==========

// Interface for Service History DTO (matching backend)
export interface ServiceHistoryDTO {
  serviceHistoryId: number;
  vehicleId: number;
  serviceType: string;
  description: string;
  serviceCenterId?: number;
  servicedByUserId?: number;
  serviceCenterName?: string;
  servicedByUserName?: string;
  serviceDate: string;
  cost: number;
  mileage?: number;
  isVerified: boolean;
  externalServiceCenterName?: string;
  receiptDocumentPath?: string;
}

// Interface for adding new service history
export interface AddServiceHistoryDTO {
  vehicleId: number;
  serviceType: string;
  description: string;
  serviceCenterId?: number;
  servicedByUserId?: number;
  serviceDate: string;
  cost: number;
  mileage?: number;
  externalServiceCenterName?: string;
  receiptDocument?: string; // Base64 encoded PDF
}

// Interface for updating service history
export interface UpdateServiceHistoryDTO {
  serviceHistoryId: number;
  serviceType: string;
  description: string;
  serviceCenterId?: number;
  servicedByUserId?: number;
  serviceDate: string;
  cost: number;
  mileage?: number;
  externalServiceCenterName?: string;
  receiptDocument?: string; // Base64 encoded PDF
}

// Get service history for a specific vehicle
export const fetchVehicleServiceHistory = async (vehicleId: number): Promise<ServiceHistoryDTO[]> => {
  try {
    const response = await axiosInstance.get(`/VehicleServiceHistory/Vehicle/${vehicleId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching vehicle service history:", error);
    
    // Fallback data for development/testing
    const fallbackServiceHistory: ServiceHistoryDTO[] = [
      {
        serviceHistoryId: 1,
        vehicleId: vehicleId,
        serviceType: "Oil Change",
        description: "Regular oil change and filter replacement",
        serviceCenterId: 1,
        serviceCenterName: "AutoCare Plus",
        serviceDate: "2024-01-15",
        cost: 50.00,
        mileage: 15000,
        isVerified: true,
        servicedByUserName: "John Doe"
      },
      {
        serviceHistoryId: 2,
        vehicleId: vehicleId,
        serviceType: "Brake Service",
        description: "Brake pad replacement and brake fluid change",
        serviceCenterId: 2,
        serviceCenterName: "QuickFix Motors",
        serviceDate: "2024-02-20",
        cost: 150.00,
        mileage: 16500,
        isVerified: true,
        servicedByUserName: "Jane Smith"
      },
      {
        serviceHistoryId: 3,
        vehicleId: vehicleId,
        serviceType: "Engine Diagnostic",
        description: "Complete engine diagnostic and tune-up",
        externalServiceCenterName: "Local Garage",
        serviceDate: "2024-03-10",
        cost: 200.00,
        mileage: 17200,
        isVerified: false
      }
    ];
    
    return fallbackServiceHistory;
  }
};

// Get specific service history record
export const fetchServiceHistory = async (vehicleId: number, serviceHistoryId: number): Promise<ServiceHistoryDTO | null> => {
  try {
    const response = await axiosInstance.get(`/VehicleServiceHistory/${vehicleId}/${serviceHistoryId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching service history record:", error);
    return null;
  }
};

// Add new service history record
export const addServiceHistory = async (vehicleId: number, serviceData: Omit<AddServiceHistoryDTO, 'vehicleId'>): Promise<ServiceHistoryDTO> => {
  try {
    const response = await axiosInstance.post(`/VehicleServiceHistory/${vehicleId}`, {
      ...serviceData,
      vehicleId
    });
    return response.data;
  } catch (error) {
    console.error("Error adding service history:", error);
    throw error;
  }
};

// Update service history record
export const updateServiceHistory = async (vehicleId: number, serviceHistoryId: number, serviceData: UpdateServiceHistoryDTO): Promise<boolean> => {
  try {
    await axiosInstance.put(`/VehicleServiceHistory/${vehicleId}/${serviceHistoryId}`, serviceData);
    return true;
  } catch (error) {
    console.error("Error updating service history:", error);
    throw error;
  }
};

// Delete service history record
export const deleteServiceHistory = async (vehicleId: number, serviceHistoryId: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/VehicleServiceHistory/${vehicleId}/${serviceHistoryId}`);
    return true;
  } catch (error) {
    console.error("Error deleting service history:", error);
    throw error;
  }
};

// ========== System Services Management API Functions ==========

// Fetch all system services
export const fetchSystemServices = async (): Promise<SystemService[]> => {
  try {
    console.log("Attempting to fetch system services from:", `${axiosInstance.defaults.baseURL}/Services`);
    const response = await axiosInstance.get('/Services');
    console.log("Successfully fetched system services from backend:", response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as { 
      response?: { 
        status?: number; 
        statusText?: string;
        data?: unknown;
        config?: { url?: string };
      } 
    };
    
    // If it's a 404, the endpoint doesn't exist - this is expected
    if (axiosError.response?.status === 404) {
      console.log("Services endpoint not found (expected - backend endpoint not implemented yet), using fallback data");
    } else {
      console.error("Error fetching system services:", {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        url: axiosError.response?.config?.url
      });
    }
    
    // Fallback data for development/testing
    const fallbackServices: SystemService[] = [
      {
        serviceId: 1,
        serviceName: "Oil Change",
        description: "Complete oil change with filter replacement",
        category: "Maintenance",
        isActive: true,
        basePrice: 50.00,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z"
      },
      {
        serviceId: 2,
        serviceName: "Tire Replacement",
        description: "Replace worn tires with new ones",
        category: "Tires",
        isActive: true,
        basePrice: 200.00,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z"
      },
      {
        serviceId: 3,
        serviceName: "Brake Service",
        description: "Brake pad replacement and brake fluid change",
        category: "Brakes",
        isActive: true,
        basePrice: 150.00,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z"
      },
      {
        serviceId: 4,
        serviceName: "Engine Repair",
        description: "Diagnostic and repair of engine issues",
        category: "Engine",
        isActive: true,
        basePrice: 300.00,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z"
      },
      {
        serviceId: 5,
        serviceName: "Full Inspection",
        description: "Comprehensive vehicle inspection",
        category: "Inspection",
        isActive: true,
        basePrice: 100.00,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z"
      }
    ];
    console.log("Using fallback services data for development:", fallbackServices);
    return fallbackServices;
  }
};

// Create a new system service
export const createSystemService = async (serviceData: CreateSystemServiceDTO): Promise<SystemService> => {
  try {
    const response = await axiosInstance.post('/Services', serviceData);
    return response.data;
  } catch (error) {
    console.error("Error creating system service:", error);
    throw error;
  }
};

// Update a system service
export const updateSystemService = async (serviceId: number, serviceData: UpdateSystemServiceDTO): Promise<SystemService> => {
  try {
    const response = await axiosInstance.put(`/Services/${serviceId}`, serviceData);
    return response.data;
  } catch (error) {
    console.error("Error updating system service:", error);
    throw error;
  }
};

// Delete a system service
export const deleteSystemService = async (serviceId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/Services/${serviceId}`);
  } catch (error) {
    console.error("Error deleting system service:", error);
    throw error;
  }
};

// Toggle service active status
export const toggleSystemServiceStatus = async (serviceId: number, isActive: boolean): Promise<void> => {
  try {
    await axiosInstance.patch(`/Services/${serviceId}/status`, { isActive });
  } catch (error) {
    console.error("Error toggling system service status:", error);
    throw error;
  }
};

// ========== Packages Management API Functions ==========

// Fetch all packages
export const fetchPackages = async (): Promise<Package[]> => {
  try {
    const response = await axiosInstance.get('/Packages');
    return response.data;
  } catch (error) {
    console.error("Error fetching packages:", error);
    // Fallback data for development/testing
    const fallbackPackages: Package[] = [
      {
        packageId: 1,
        packageName: "Basic Package",
        percentage: 10,
        description: "Basic service package with 10% loyalty percentage",
        isActive: true
      },
      {
        packageId: 2,
        packageName: "Premium Package",
        percentage: 20,
        description: "Premium service package with 20% loyalty percentage",
        isActive: true
      },
      {
        packageId: 3,
        packageName: "Gold Package",
        percentage: 30,
        description: "Gold service package with 30% loyalty percentage",
        isActive: true
      }
    ];
    return fallbackPackages;
  }
};

// Fetch a specific package
export const fetchPackage = async (id: number): Promise<Package> => {
  try {
    const response = await axiosInstance.get(`/Packages/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching package:", error);
    throw error;
  }
};

// Fetch active packages only
export const fetchActivePackages = async (): Promise<Package[]> => {
  try {
    const response = await axiosInstance.get('/Packages/Active');
    return response.data;
  } catch (error) {
    console.error("Error fetching active packages:", error);
    throw error;
  }
};

// Create a new package
export const createPackage = async (packageData: CreatePackageDTO): Promise<Package> => {
  try {
    const response = await axiosInstance.post('/Packages', packageData);
    return response.data;
  } catch (error) {
    console.error("Error creating package:", error);
    throw error;
  }
};

// Update a package
export const updatePackage = async (id: number, packageData: UpdatePackageDTO): Promise<void> => {
  try {
    await axiosInstance.put(`/Packages/${id}`, packageData);
  } catch (error) {
    console.error("Error updating package:", error);
    throw error;
  }
};

// Delete a package
export const deletePackage = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/Packages/${id}`);
  } catch (error) {
    console.error("Error deleting package:", error);
    throw error;
  }
};

// ========== Closure Schedule Management API Functions ==========

// Add a new closure schedule
export const addClosureSchedule = async (closureData: CreateClosureScheduleDTO): Promise<ClosureSchedule> => {
  try {
    const response = await axiosInstance.post('/ClosureSchedule', closureData);
    return response.data;
  } catch (error) {
    console.error("Error adding closure schedule:", error);
    throw error;
  }
};

// Get closures for a specific service center and week
export const getClosures = async (serviceCenterId: number, weekNumber: number): Promise<ClosureSchedule[]> => {
  try {
    const response = await axiosInstance.get(`/ClosureSchedule/${serviceCenterId}?weekNumber=${weekNumber}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching closures:", error);
    // Return empty array if no closures found or error occurs
    return [];
  }
};

// Update a closure schedule
export const updateClosureSchedule = async (id: number, updateData: UpdateClosureScheduleDTO): Promise<ClosureSchedule> => {
  try {
    const response = await axiosInstance.put(`/ClosureSchedule/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating closure schedule:", error);
    throw error;
  }
};

// Delete a closure schedule
export const deleteClosureSchedule = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/ClosureSchedule/${id}`);
  } catch (error) {
    console.error("Error deleting closure schedule:", error);
    throw error;
  }
};

// ========== Public Customer-Facing API Functions ==========

// Check if a service center is available on a specific date (for customers)
export const checkServiceCenterAvailability = async (
  serviceCenterId: number, 
  date: string
): Promise<{ isAvailable: boolean; reason?: string }> => {
  try {
    // Convert date to week number and day
    const targetDate = new Date(date);
    const weekNumber = getWeekNumber(targetDate);
    const dayOfWeek = getDayOfWeek(targetDate);
    
    // Get closures for that week
    const closures = await getClosures(serviceCenterId, weekNumber);
    
    // Check if the specific day is closed
    const isClosed = closures.some(closure => closure.day === dayOfWeek);
    
    return {
      isAvailable: !isClosed,
      reason: isClosed ? 'Service center is closed on this day' : undefined
    };
  } catch (error) {
    console.error("Error checking service center availability:", error);
    // Default to available if we can't check
    return { isAvailable: true };
  }
};

// Check current availability for all service centers
export const checkAllServiceCentersAvailability = async (): Promise<Map<string, { isAvailable: boolean; reason?: string }>> => {
  try {
    const serviceCenters = await fetchServiceCenters();
    const availabilityMap = new Map<string, { isAvailable: boolean; reason?: string }>();
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Check availability for each service center
    for (const serviceCenter of serviceCenters) {
      const serviceCenterId = serviceCenter.Station_id || parseInt(serviceCenter.id);
      if (serviceCenterId) {
        try {
          const availability = await checkServiceCenterAvailability(serviceCenterId, currentDate);
          availabilityMap.set(serviceCenter.id, availability);
        } catch (error) {
          console.error(`Error checking availability for service center ${serviceCenter.id}:`, error);
          // Default to available if we can't check
          availabilityMap.set(serviceCenter.id, { isAvailable: true });
        }
      }
    }
    
    return availabilityMap;
  } catch (error) {
    console.error("Error checking all service centers availability:", error);
    return new Map();
  }
};

// Get all closures for a service center (for customer display)
export const getServiceCenterClosures = async (serviceCenterId: number): Promise<ClosureSchedule[]> => {
  try {
    // Get closures for current week and next few weeks
    const currentWeek = getWeekNumber(new Date());
    const closures: ClosureSchedule[] = [];
    
    // Get closures for current week and next 4 weeks
    for (let week = currentWeek; week <= currentWeek + 4; week++) {
      try {
        const weekClosures = await getClosures(serviceCenterId, week);
        closures.push(...weekClosures);
      } catch (error) {
        console.warn(`Failed to fetch closures for week ${week}:`, error);
        // Continue with other weeks
      }
    }
    
    return closures;
  } catch (error) {
    console.error("Error getting service center closures:", error);
    return [];
  }
};

// Helper functions for date calculations
const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

const getDayOfWeek = (date: Date): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
};

// ===============================
// FEEDBACK API FUNCTIONS
// ===============================

// Get all feedbacks with optional filters
export const getAllFeedbacks = async (filters?: FeedbackFilters): Promise<FeedbackDTO[]> => {
  try {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters?.serviceCenterId) params.append('serviceCenterId', filters.serviceCenterId.toString());
    if (filters?.minRating) params.append('minRating', filters.minRating.toString());
    if (filters?.maxRating) params.append('maxRating', filters.maxRating.toString());

    const queryString = params.toString();
    const url = queryString ? `/Feedback?${queryString}` : '/Feedback';
    
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    throw error;
  }
};

// Get feedback by ID
export const getFeedbackById = async (id: number): Promise<FeedbackDTO> => {
  try {
    const response = await axiosInstance.get(`/Feedback/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching feedback:", error);
    throw error;
  }
};

// Get customer feedbacks
export const getCustomerFeedbacks = async (customerId: number): Promise<FeedbackDTO[]> => {
  try {
    const response = await axiosInstance.get(`/Feedback/Customer/${customerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching customer feedbacks:", error);
    throw error;
  }
};

// Get service center feedbacks
export const getServiceCenterFeedbacks = async (serviceCenterId: number): Promise<FeedbackDTO[]> => {
  try {
    const response = await axiosInstance.get(`/Feedback/ServiceCenter/${serviceCenterId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching service center feedbacks:", error);
    throw error;
  }
};

// Get feedback statistics
export const getFeedbackStats = async (serviceCenterId?: number): Promise<FeedbackStatsDTO> => {
  try {
    const url = serviceCenterId 
      ? `/Feedback/Stats?serviceCenterId=${serviceCenterId}` 
      : '/Feedback/Stats';
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching feedback stats:", error);
    throw error;
  }
};

// Create new feedback (for mobile app)
export const createFeedback = async (feedback: CreateFeedbackDTO): Promise<FeedbackDTO> => {
  try {
    const response = await axiosInstance.post('/Feedback', feedback);
    return response.data;
  } catch (error) {
    console.error("Error creating feedback:", error);
    throw error;
  }
};

// Update feedback
export const updateFeedback = async (id: number, feedback: UpdateFeedbackDTO): Promise<void> => {
  try {
    await axiosInstance.put(`/Feedback/${id}`, feedback);
  } catch (error) {
    console.error("Error updating feedback:", error);
    throw error;
  }
};

// Delete feedback
export const deleteFeedback = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/Feedback/${id}`);
  } catch (error) {
    console.error("Error deleting feedback:", error);
    throw error;
  }
};

export const updateAppointmentStatus = async (
  appointmentId: number,
  status: string
): Promise<void> => {
  try {
    await axiosInstance.put(`/Appointment/${appointmentId}/status`, { status });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    throw error;
  }
};

export interface AppointmentSummary {
  appointmentId: number;
  ownerName: string;
  appointmentDate: string;
}


export const fetchAppointmentsForStation = async (stationId: string | number): Promise<AppointmentSummary[]> => {
  try {
    const response = await axiosInstance.get(`/Appointment/station/${stationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments for station:', error);
    throw error;
  }
};

export type AppointmentDetail = {
  appointmentId: number;
  licensePlate: string;
  vehicleType: string;
  ownerName: string;
  appointmentDate: string;
  services: string[];
  vehicleId: number;
  serviceCenterId: number;
  serviceCenterName?: string;
  status?: string; // Add status field to track appointment status
  appointmentPrice?: number; // Add appointment price field
};

export const fetchAdminAppointmentVehicleDetail = async (
  stationId: number | string,
  customerId: number | string,
  vehicleId: number | string,
  appointmentId: number | string
): Promise<AppointmentDetail> => {
  try {
    const response = await axiosInstance.get(
      `/Appointment/station/${stationId}/customer/${customerId}/vehicle/${vehicleId}/details/${appointmentId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching admin appointment vehicle detail:', error);
    throw error;
  }
};

// Fetch appointment detail by station and appointment ID
export const fetchAppointmentDetail = async (
  stationId: number | string,
  appointmentId: number | string
): Promise<AppointmentDetail> => {
  try {
    // First, try the simple endpoint
    const response = await axiosInstance.get(
      `/Appointment/station/${stationId}/details/${appointmentId}`
    );
    return response.data;
  } catch (error) {

    
    try {
      // If the simple endpoint fails, try to get all appointments for the station
      // and find the specific appointment
      const allAppointments = await fetchAppointmentsForStation(stationId);
      const targetAppointment = allAppointments.find(
        (apt) => apt.appointmentId.toString() === appointmentId.toString()
      );
      
      if (!targetAppointment) {
        throw new Error('Appointment not found');
      }
      
      // For now, return a basic structure with the information we have
      // This is a temporary solution until the backend endpoint is fixed
      const basicAppointmentDetail: AppointmentDetail = {
        appointmentId: targetAppointment.appointmentId,
        licensePlate: "N/A", // Will need to be fetched from backend
        vehicleType: "N/A", // Will need to be fetched from backend
        ownerName: targetAppointment.ownerName,
        appointmentDate: targetAppointment.appointmentDate,
        services: [], // Will need to be fetched from backend
        vehicleId: 0, // Will need to be fetched from backend
        serviceCenterId: parseInt(stationId.toString()),
        serviceCenterName: "N/A", // Will need to be fetched from backend
        status: "Pending", // Default status
        appointmentPrice: 0, // Will need to be calculated from backend services
      };
      

      return basicAppointmentDetail;
      
    } catch (fallbackError) {
      console.error('Error fetching appointment detail:', error);
      console.error('Fallback approach also failed:', fallbackError);
      throw error;
    }
  }
};

// Complete an appointment (mark as completed)
export const completeAppointment = async (appointmentId: number): Promise<void> => {
  try {
    await axiosInstance.post(`/Appointment/${appointmentId}/complete`);
  } catch (error) {
    console.error("Error completing appointment:", error);
    throw error;
  }
};

