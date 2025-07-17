import { ServiceCenter, DashboardStats, Client, User, Vehicle } from "@/types";
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

// Fallback client data for development/testing when backend is not available
const fallbackClients: Client[] = [
  {
    customerId: 1,
    firstName: "Devon",
    lastName: "Lane",
    email: "devon.lane@gmail.com",
    phoneNumber: "+1 (961) 523-4453",
    address: "456 Ocean Avenue, Miami, FL 12345",
    nic: "2000345682",
    loyaltyPoints: 13654,
    // Legacy fields for backward compatibility
    id: "client-1",
    client: "Devon Lane",
    phoneno: "+1 (961) 523-4453",
    points: 13654,
    profilePicture: "https://placehold.co/80x80/svg?text=Client",
    tiers: [
      { name: "Bronze", threshold: 5000 },
      { name: "Silver", threshold: 10000 },
      { name: "Gold", threshold: 20000 },
    ],
    vehicles: [],
    serviceHistory: [],
    appointments: [],
  },
  {
    customerId: 2,
    firstName: "Kathryn",
    lastName: "Murphy",
    email: "kathryn.murphy@gmail.com",
    phoneNumber: "+1 (961) 523-4454",
    address: "234 Oak Street, Flat 7",
    nic: "2000345683",
    loyaltyPoints: 12500,
    // Legacy fields for backward compatibility
    id: "client-2",
    client: "Kathryn Murphy",
    phoneno: "+1 (961) 523-4454",
    points: 12500,
    profilePicture: "https://placehold.co/80x80/svg?text=Client",
    tiers: [
      { name: "Bronze", threshold: 5000 },
      { name: "Silver", threshold: 10000 },
      { name: "Gold", threshold: 20000 },
    ],
    vehicles: [],
    serviceHistory: [],
    appointments: [],
  },
  {
    customerId: 3,
    firstName: "Eleanor",
    lastName: "Pena",
    email: "eleanor.pena@gmail.com",
    phoneNumber: "+1 (961) 523-4455",
    address: "234 Oak Street, Flat 7",
    nic: "2000345684",
    loyaltyPoints: 18000,
    // Legacy fields for backward compatibility
    id: "client-3",
    client: "Eleanor Pena",
    phoneno: "+1 (961) 523-4455",
    points: 18000,
    profilePicture: "https://placehold.co/80x80/svg?text=Client",
    tiers: [
      { name: "Bronze", threshold: 5000 },
      { name: "Silver", threshold: 10000 },
      { name: "Gold", threshold: 20000 },
    ],
    vehicles: [],
    serviceHistory: [],
    appointments: [],
  },
];

// ========== Vehicle API Functions ==========

// Backend vehicle response interface (matching your CustomersController)
interface VehicleResponse {
  vehicleId: number;
  registrationNumber: string;
  brand: string;
  model: string;
  chassisNumber: string;
  mileage?: number;
  fuel: string;
  year: string;
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

// Fetch all vehicles from all customers
export const fetchVehicles = async (): Promise<VehicleDisplay[]> => {
  try {
    // First fetch all customers
    const customers = await fetchClients();
    const allVehicles: VehicleDisplay[] = [];

    // For each customer, fetch their vehicles
    for (const customer of customers) {
      try {
        const response = await axiosInstance.get(`/Customers/${customer.customerId}/vehicles`);
        const customerVehicles: VehicleResponse[] = response.data;

        // Transform each vehicle to display format
        const transformedVehicles = customerVehicles.map((vehicle) => ({
          id: `#${vehicle.vehicleId.toString().padStart(4, "0")}`,
          vehicleId: vehicle.vehicleId,
          customerId: customer.customerId,
          client: customer.client || `${customer.firstName} ${customer.lastName}`,
          clientEmail: customer.email,
          pictureSrc: customer.profilePicture || "https://placehold.co/80x80/svg?text=Client",
          type: getVehicleType(vehicle.fuel), // Derive type from fuel
          brand: vehicle.brand,
          model: vehicle.model,
          licenseplate: vehicle.registrationNumber,
          registrationNumber: vehicle.registrationNumber,
          chassisNumber: vehicle.chassisNumber,
          mileage: vehicle.mileage,
          fuel: vehicle.fuel,
          year: vehicle.year,
        }));

        allVehicles.push(...transformedVehicles);
      } catch (error) {
        console.warn(`Failed to fetch vehicles for customer ${customer.customerId}:`, error);
        // Continue with other customers even if one fails
      }
    }

    return allVehicles;
  } catch (error) {
    console.error("Error in fetchVehicles:", error);
    
    // Fallback data for development/testing
    const fallbackVehicles: VehicleDisplay[] = [
      {
        id: "#0001",
        vehicleId: 1,
        customerId: 1,
        client: "Devon Lane",
        clientEmail: "devon.lane@gmail.com",
        pictureSrc: "https://placehold.co/80x80/svg?text=Client",
        type: "Sedan",
        brand: "Toyota",
        model: "Camry",
        licenseplate: "ABC-1234",
        registrationNumber: "ABC-1234",
        chassisNumber: "1HGCM82633A123456",
        mileage: 45000,
        fuel: "Petrol",
        year: "2020",
      },
      {
        id: "#0002",
        vehicleId: 2,
        customerId: 2,
        client: "Kathryn Murphy",
        clientEmail: "kathryn.murphy@gmail.com",
        pictureSrc: "https://placehold.co/80x80/svg?text=Client",
        type: "SUV",
        brand: "Honda",
        model: "CR-V",
        licenseplate: "XYZ-5678",
        registrationNumber: "XYZ-5678",
        chassisNumber: "2HGCM82633A654321",
        mileage: 32000,
        fuel: "Hybrid",
        year: "2021",
      }
    ];
    
    return fallbackVehicles;
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
    return mockServiceCenters.map((sc) => ({
      ...sc,
      id: sc.id,
      serviceCenterName: sc.serviceCenterName,
      email: sc.email,
      address: sc.address,
      telephoneNumber: sc.telephoneNumber,
      ownersName: sc.ownersName || "",
      vatNumber: sc.vatNumber || "",
      registrationNumber: sc.registrationNumber || "",
      commissionRate: sc.commissionRate || "",
      availableServices: sc.availableServices || [],
      photoUrl: sc.photoUrl || "",
      registrationCopyUrl: sc.registrationCopyUrl || "",
    }));
  } catch (error) {
    console.error("Error in fetchServiceCenters:", error);
    throw error;
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
    // Fallback to static client data if API call fails
    return fallbackClients;
  }
};

// Fetch a single client by ID
export const fetchClientById = async (id: string): Promise<Client | null> => {
  try {
    // Extract numeric ID from client-X format
    const numericId = id.startsWith('client-') ? id.replace('client-', '') : id;
    
    const response = await axiosInstance.get(`/Customers/${numericId}`);
    const customer = response.data;
    
    // Fetch customer's vehicles
    let vehicles: Vehicle[] = [];
    try {
      const vehiclesResponse = await axiosInstance.get(`/Customers/${numericId}/vehicles`);
      vehicles = vehiclesResponse.data.map((vehicle: VehicleResponse) => ({
        id: vehicle.vehicleId,
        vehicleId: vehicle.vehicleId,
        customerId: parseInt(numericId),
        type: getVehicleType(vehicle.fuel),
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        fuel: vehicle.fuel,
        fuelType: vehicle.fuel, // For backward compatibility
        licensePlate: vehicle.registrationNumber,
        registrationNumber: vehicle.registrationNumber,
        transmission: "Manual", // Default value as backend doesn't have this
        vin: vehicle.chassisNumber, // Use chassis number as VIN
        chassisNumber: vehicle.chassisNumber,
        mileage: vehicle.mileage,
      }));
    } catch (vehicleError) {
      console.warn(`Failed to fetch vehicles for customer ${numericId}:`, vehicleError);
      // Continue without vehicles if fetch fails
    }
    
    // Transform the backend data to match frontend expectations
    return {
      customerId: customer.customerId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      address: customer.address,
      nic: customer.nic,
      loyaltyPoints: customer.loyaltyPoints,
      // Legacy fields for backward compatibility
      id: `client-${customer.customerId}`,
      client: `${customer.firstName} ${customer.lastName}`,
      phoneno: customer.phoneNumber,
      points: customer.loyaltyPoints,
      profilePicture: "https://placehold.co/80x80/svg?text=Client",
      vehicles: vehicles,
      // Default empty arrays for other fields
      tiers: [
        { name: "Bronze", threshold: 5000 },
        { name: "Silver", threshold: 10000 },
        { name: "Gold", threshold: 20000 },
      ],
      serviceHistory: [], // Will be loaded separately by service history component
      appointments: [], // Will be loaded separately if needed
    };
  } catch (error) {
    console.error("Error in fetchClientById, using fallback data:", error);
    // Fallback to static data if API call fails
    const numericId = id.startsWith('client-') ? parseInt(id.replace('client-', '')) : parseInt(id);
    return fallbackClients.find(client => client.customerId === numericId) || null;
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
// /utils/api.ts

// Fetch a single service center by ID
export const fetchServiceCenterById = async (id: string): Promise<ServiceCenter | null> => {
  try {
    const serviceCenter = mockServiceCenters.find((sc) => sc.id === id);
    return serviceCenter || null;
  } catch (error) {
    console.error("Error in fetchServiceCenterById:", error);
    throw error;
  }
};

// Fetch dashboard stats
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Get real counts from the backend
    const [clients, vehicles] = await Promise.all([
      fetchClients(),
      fetchVehicles(),
    ]);
    
    return {
      customers: clients.length,
      vehicles: vehicles.length,
      serviceCenters: mockServiceCenters.length,
    };
  } catch (error) {
    console.error("Error in fetchDashboardStats:", error);
    // Fallback to static data if API calls fail
    return {
      customers: 0,
      vehicles: 0,
      serviceCenters: mockServiceCenters.length,
    };
  }
};

// Delete a service center
export const deleteServiceCenter = async (id: string): Promise<void> => {
  try {
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

// Update a service center
export const updateServiceCenter = async (id: string, data: Omit<ServiceCenter, "id">): Promise<void> => {
  try {
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

// Create a new service center
export const createServiceCenter = async (data: Omit<ServiceCenter, "id">): Promise<ServiceCenter> => {
  try {
    const newId = (mockServiceCenters.length + 1).toString();
    const newServiceCenter: ServiceCenter = { id: newId, ...data };
    mockServiceCenters.push(newServiceCenter);
    return newServiceCenter;
  } catch (error) {
    console.error("Error in createServiceCenter:", error);
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