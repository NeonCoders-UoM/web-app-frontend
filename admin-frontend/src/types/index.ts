export interface ServiceCenter {
  id: string; // For frontend compatibility
  Station_id?: number; // Backend ID
  serviceCenterName: string; // Frontend field
  Station_name?: string; // Backend field
  email: string; // Common field
  Email?: string; // Backend field
  address: string; // Frontend field
  Address?: string; // Backend field
  telephoneNumber: string; // Frontend field
  Telephone?: string; // Backend field
  ownersName?: string; // Frontend field
  OwnerName?: string; // Backend field
  vatNumber?: string; // Frontend field
  VATNumber?: string; // Backend field
  registrationNumber?: string; // Frontend field
  RegisterationNumber?: string; // Backend field (note spelling)
  commissionRate?: string; // Frontend only
  availableServices?: string[]; // Frontend only
  photoUrl?: string; // Frontend only
  registrationCopyUrl?: string; // Frontend only
  Station_status?: string; // Backend field
}

// Backend DTO interfaces
export interface ServiceCenterDTO {
  station_id: number;
  ownerName: string;
  vatNumber: string;
  registerationNumber: string;
  station_name: string;
  email: string;
  telephone: string;
  address: string;
  station_status: string;
}

export interface CreateServiceCenterDTO {
  ownerName: string;
  vatNumber: string;
  registerationNumber: string;
  station_name: string;
  email: string;
  telephone: string;
  address: string;
  station_status: string;
}

export interface UpdateServiceCenterDTO {
  ownerName?: string;
  vatNumber?: string;
  registerationNumber?: string;
  station_name?: string;
  email?: string;
  telephone?: string;
  address?: string;
  station_status?: string;
}

export interface ServiceCenterServiceDTO {
  ServiceCenterServiceId: number;
  Station_id: number;
  ServiceId: number;
  CustomPrice?: number;
  IsAvailable: boolean;
  Notes?: string;
  ServiceName: string;
  ServiceDescription: string;
  BasePrice: number;
  LoyaltyPoints: number;
  Category: string;
  StationName: string;
}

export interface CreateServiceCenterServiceDTO {
  Station_id: number;
  ServiceId: number;
  CustomPrice?: number;
  IsAvailable: boolean;
  Notes?: string;
}

export interface Tier {
  name: string;
  threshold: number;
}

export interface Vehicle {
  id: number;
  vehicleId?: number; // Backend ID
  customerId?: number; // Owner's customer ID
  type: string;
  brand: string;
  model: string;
  year: string;
  fuelType?: string;
  fuel?: string; // Backend uses 'fuel' instead of 'fuelType'
  licensePlate?: string;
  registrationNumber?: string; // Backend uses 'registrationNumber'
  transmission?: string;
  vin?: string;
  chassisNumber?: string; // Backend uses 'chassisNumber'
  mileage?: number;
}

export interface ServiceHistoryItem {
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
  // Legacy fields for backward compatibility
  id?: string;
  title?: string;
  price?: number;
  originalPrice?: number;
  type?: string;
  date?: string;
  serviceCenter?: string;
  status?: "Completed" | "Pending" | "Cancelled";
  image?: string;
}

export interface Appointment {
  appointmentId: string;
  owner: string;
  licensePlate: string;
  date: string;
  vehicle: string;
  services: string[];
  serviceCenter: string;
}

export interface Client {
  customerId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address?: string;
  nic?: string;
  loyaltyPoints?: number;
  // Legacy fields for backward compatibility
  id?: string;
  client?: string;
  profilePicture?: string;
  phoneno?: string;
  points?: number;
  tiers?: Tier[];
  vehicles?: Vehicle[];
  serviceHistory?: ServiceHistoryItem[];
  appointments?: Appointment[];
}

export interface User {
  userId: number;     // ✅ matches JSON
  firstName: string;
  lastName: string;
  email: string;
  role: string;       // ✅ not UserRoleName
}



export interface ShiftCard {
  day: string;
  status: string;
}

export interface Service {
  id: string;
  label: string;
  checked: boolean;
}

export type UserRole = "admin" | "super-admin" | "service-center-admin" | "cashier" | "data-operator";

export interface DashboardStats {
  customers: number;
  vehicles: number;
  serviceCenters: number;
}

export {
  fetchServiceCenters,
  fetchServiceCentersByStatus,
  fetchServiceCenterServices,
  addServiceToServiceCenter,
  removeServiceFromServiceCenter,
  updateServiceCenterStatus,
  fetchClients,
  fetchClientById,
  fetchUsers,
  fetchServiceCenterById,
  fetchDashboardStats,
  deleteServiceCenter,
  updateServiceCenter,
  createServiceCenter,
  fetchVehicles,
} from "@/utils/api";