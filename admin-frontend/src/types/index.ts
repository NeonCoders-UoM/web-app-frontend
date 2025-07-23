export interface ServiceAvailabilityDTO {
  id?: number;
  serviceCenterId: number;
  serviceId: number;
  weekNumber: number;
  day: string;
  isAvailable: boolean;
}

export interface UpdateServiceAvailabilityDTO {
  id?: number;
  serviceCenterId: number;
  serviceId: number;
  weekNumber: number;
  day: string;
  isAvailable: boolean;
}

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

export interface ServiceCenterServiceSelection {
  serviceId: number;
  serviceName: string;
  basePrice: number;
  isSelected: boolean;
}

export interface CreateServiceCenterWithServicesDTO {
  // Service Center basic info
  ownerName: string;
  vatNumber: string;
  registerationNumber: string;
  station_name: string;
  email: string;
  telephone: string;
  address: string;
  station_status: string;
  // Package selection
  packageId: number;
  // Services with pricing
  services: ServiceCenterServiceSelection[];
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
  serviceCenterServiceId: number;
  station_id: number;
  serviceId: number;
  packageId: number;
  customPrice: number;
  serviceCenterBasePrice: number;
  serviceCenterLoyaltyPoints: number;
  isAvailable: boolean;
  notes: string;
  serviceName: string;
  serviceDescription: string;
  serviceBasePrice: number;
  category: string;
  stationName: string;
  packageName: string;
  packagePercentage: number;
  packageDescription: string;
}

export interface CreateServiceCenterServiceDTO {
  station_id: number;
  serviceId: number;
  packageId: number;
  customPrice: number;
  serviceCenterBasePrice: number;
  serviceCenterLoyaltyPoints: number;
  isAvailable: boolean;
  notes: string;
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

// New interfaces for system-level service management
export interface SystemService {
  serviceId: number;
  serviceName: string;
  description: string;
  category: string;
  isActive: boolean;
  basePrice: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Package {
  packageId: number;
  packageName: string;
  percentage: number;
  description: string;
  isActive: boolean;
}

export interface CreatePackageDTO {
  packageName: string;
  percentage: number;
  description: string;
  isActive: boolean;
}

export interface UpdatePackageDTO {
  packageName?: string;
  percentage?: number;
  description?: string;
  isActive?: boolean;
}

export interface CreateSystemServiceDTO {
  serviceName: string;
  description: string;
  category: string;
  basePrice: number;
}

export interface UpdateSystemServiceDTO {
  serviceName?: string;
  description?: string;
  category?: string;
  isActive?: boolean;
}

export type UserRole = "admin" | "super-admin" | "service-center-admin" | "cashier" | "data-operator";

export interface DashboardStats {
  customers: number;
  vehicles: number;
  serviceCenters: number;
}

// Closure Schedule Types
export interface ClosureSchedule {
  id: number;
  serviceCenterId: number;
  weekNumber: number;
  day: string;
}

export interface CreateClosureScheduleDTO {
  serviceCenterId: number;
  weekNumber: number;
  day: string;
}

export interface UpdateClosureScheduleDTO {
  serviceCenterId: number;
  weekNumber: number;
  day: string;
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
  fetchSystemServices,
  createSystemService,
  updateSystemService,
  deleteSystemService,
  toggleSystemServiceStatus,
  addClosureSchedule,
  getClosures,
  updateClosureSchedule,
  deleteClosureSchedule,
  checkServiceCenterAvailability,
  getServiceCenterClosures,
} from "@/utils/api";

// Feedback related types
export interface FeedbackDTO {
  feedbackId: number;
  customerId: number;
  serviceCenterId: number;
  vehicleId: number;
  rating: number;
  comments: string;
  serviceDate: Date | null;
  feedbackDate: Date;
  customerName: string;
  serviceCenterName: string;
  vehicleRegistrationNumber: string;
}

export interface CreateFeedbackDTO {
  customerId: number;
  serviceCenterId: number;
  vehicleId: number;
  rating: number;
  comments: string;
  serviceDate: Date;
}

export interface UpdateFeedbackDTO {
  rating?: number;
  comments?: string;
  serviceDate?: Date | null;
}

export interface FeedbackStatsDTO {
  averageRating: number;
  totalFeedbacks: number;
  ratingCounts: { [key: number]: number };
}

export interface FeedbackFilters {
  page?: number;
  pageSize?: number;
  serviceCenterId?: number;
  minRating?: number;
  maxRating?: number;
}