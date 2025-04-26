
export interface ServiceCenter {
  id: string;
  serviceCenterName: string;
  email: string;
  address: string;
  telephoneNumber: string;
  ownersName: string;
  vatNumber: string;
  registrationNumber: string;
  commissionDate: string;
  availableServices: string[];
  serviceHours: { start: string; end: string };
}
  
  export interface Client {
    id: string;
    client: string;
    profilePicture: string;
    email: string;
    phoneno: string;
    address: string;
  }
  
  export interface User {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    userrole: string;
    profilePicture: string;
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