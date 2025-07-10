export interface ServiceCenter {
  id: string;
  serviceCenterName: string;
  email: string;
  address: string;
  telephoneNumber: string;
  ownersName: string;
  vatNumber: string;
  registrationNumber: string;
  commissionRate: string;
  availableServices: string[];
  photoUrl?: string;
  registrationCopyUrl?: string;
}

export interface Tier {
  name: string;
  threshold: number;
}

export interface Vehicle {
  id: number;
  type: string;
  brand: string;
  model: string;
  year: string;
  fuelType: string;
  licensePlate: string;
  transmission: string;
  vin: string;
}

export interface ServiceHistoryItem {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  type: string;
  date: string;
  serviceCenter: string;
  status: "Completed" | "Pending" | "Cancelled";
  image: string;
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
  id: string;
  client: string;
  profilePicture: string;
  email: string;
  phoneno: string;
  address: string;
  nic?: string;
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