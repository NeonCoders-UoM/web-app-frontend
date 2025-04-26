// src/utils/api.ts
import { ServiceCenter, Client, User, ShiftCard, Service, DashboardStats } from "@/types";

// Simulate API delay
const simulateDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data storage (in-memory for simulation)
let serviceCentersData: ServiceCenter[] = [
  {
    id: "#SC-0001",
    serviceCenterName: "Speed Motors",
    email: "maria.rodriguez@gmail.com",
    telephoneNumber: "+1 (961) 523-4453",
    address: "456 Ocean Avenue, Miami, FL 33146",
    ownersName: "Maria Rodriguez",
    vatNumber: "VAT123456",
    registrationNumber: "REG123456",
    commissionDate: "2023-01-15",
    availableServices: "Oil Change",
    serviceHours: "9 AM - 5 PM",
  },
  {
    id: "#SC-0002",
    serviceCenterName: "AutoFix Hub",
    email: "juan.rodriguez@gmail.com",
    telephoneNumber: "+1 (961) 523-4453",
    address: "234 Oak Street, Flat 7",
    ownersName: "Juan Rodriguez",
    vatNumber: "VAT654321",
    registrationNumber: "REG654321",
    commissionDate: "2023-02-20",
    availableServices: "Tire Replacement",
    serviceHours: "8 AM - 6 PM",
  },
  {
    id: "#SC-0003",
    serviceCenterName: "Rapid Repairs",
    email: "maria.rodriguez@gmail.com",
    telephoneNumber: "+1 (961) 523-4453",
    address: "234 Oak Street, Flat 7",
    ownersName: "Maria Rodriguez",
    vatNumber: "VAT789123",
    registrationNumber: "REG789123",
    commissionDate: "2023-03-10",
    availableServices: "Brake Service",
    serviceHours: "10 AM - 4 PM",
  },
  {
    id: "#SC-0004",
    serviceCenterName: "NextGen Motors",
    email: "juan.rodriguez@gmail.com",
    telephoneNumber: "+1 (961) 523-4453",
    address: "456 Ocean Avenue, Miami, FL 33146",
    ownersName: "Juan Rodriguez",
    vatNumber: "VAT456789",
    registrationNumber: "REG456789",
    commissionDate: "2023-04-05",
    availableServices: "Engine Repair",
    serviceHours: "9 AM - 5 PM",
  },
  {
    id: "#SC-0005",
    serviceCenterName: "Prime AutoCare",
    email: "maria.rodriguez@gmail.com",
    telephoneNumber: "+1 (961) 523-4453",
    address: "234 Oak Street, Flat 7",
    ownersName: "Maria Rodriguez",
    vatNumber: "VAT987654",
    registrationNumber: "REG987654",
    commissionDate: "2023-05-12",
    availableServices: "Full Inspection",
    serviceHours: "8 AM - 6 PM",
  },
  {
    id: "#SC-0006",
    serviceCenterName: "Elite Vehicle Care",
    email: "maria.rodriguez@gmail.com",
    telephoneNumber: "+1 (961) 523-4453",
    address: "234 Oak Street, Flat 7",
    ownersName: "Maria Rodriguez",
    vatNumber: "VAT321987",
    registrationNumber: "REG321987",
    commissionDate: "2023-06-18",
    availableServices: "Oil Change",
    serviceHours: "10 AM - 4 PM",
  },
  {
    id: "#SC-0007",
    serviceCenterName: "TurboTune Auto",
    email: "juan.rodriguez@gmail.com",
    telephoneNumber: "+1 (961) 523-4453",
    address: "456 Ocean Avenue, Miami, FL 33146",
    ownersName: "Juan Rodriguez",
    vatNumber: "VAT654987",
    registrationNumber: "REG654987",
    commissionDate: "2023-07-22",
    availableServices: "Tire Replacement",
    serviceHours: "9 AM - 5 PM",
  },
];

// Dashboard Stats (Admin Dashboard)
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  await simulateDelay(1000);
  return {
    customers: 40689,
    vehicles: 10293,
    serviceCenters: serviceCentersData.length,
  };
};

// Service Centers (Admin Dashboard, Super Admin Dashboard)
export const fetchServiceCenters = async (): Promise<ServiceCenter[]> => {
  await simulateDelay(1000);
  return serviceCentersData.map((sc) => ({
    ...sc,
    // Map fields to match the table data structure (name, phone)
    name: sc.serviceCenterName,
    phone: sc.telephoneNumber,
  }));
};

// Fetch a single Service Center by ID (for Edit page)
export const fetchServiceCenterById = async (id: string): Promise<ServiceCenter> => {
  await simulateDelay(500);
  const serviceCenter = serviceCentersData.find((sc) => sc.id === id);
  if (!serviceCenter) {
    throw new Error(`Service Center with ID ${id} not found`);
  }
  return serviceCenter;
};

// Create a new Service Center
export const createServiceCenter = async (serviceCenter: Omit<ServiceCenter, "id">): Promise<ServiceCenter> => {
  await simulateDelay(500);
  const newId = `#SC-${(serviceCentersData.length + 1).toString().padStart(4, "0")}`;
  const newServiceCenter: ServiceCenter = { id: newId, ...serviceCenter };
  serviceCentersData.push(newServiceCenter);
  return newServiceCenter;
};

// Update an existing Service Center
export const updateServiceCenter = async (id: string, updatedData: Omit<ServiceCenter, "id">): Promise<ServiceCenter> => {
  await simulateDelay(500);
  const index = serviceCentersData.findIndex((sc) => sc.id === id);
  if (index === -1) {
    throw new Error(`Service Center with ID ${id} not found`);
  }
  const updatedServiceCenter: ServiceCenter = { id, ...updatedData };
  serviceCentersData[index] = updatedServiceCenter;
  return updatedServiceCenter;
};

// Delete a Service Center
export const deleteServiceCenter = async (id: string): Promise<void> => {
  await simulateDelay(500);
  serviceCentersData = serviceCentersData.filter((sc) => sc.id !== id);
};

// Clients (Clients Page)
export const fetchClients = async (): Promise<Client[]> => {
  await simulateDelay(1000);
  return [
    {
      id: "#CLI-0001",
      client: "Devon Lane",
      profilePicture: "/placeholder.svg?height=40&width=40",
      email: "mariarodriguez@gmail.com",
      phoneno: "+1 (961) 523-4453",
      address: "456 Ocean Avenue, Miami, FL 12345",
    },
    {
      id: "#CLI-0002",
      client: "Kathryn Murphy",
      profilePicture: "/placeholder.svg?height=40&width=40",
      email: "juan.rodriguez@gmail.com",
      phoneno: "+1 (961) 523-4453",
      address: "234 Oak Street, Flat 7",
    },
    {
      id: "#CLI-0003",
      client: "Eleanor Pena",
      profilePicture: "/placeholder.svg?height=40&width=40",
      email: "mariarodriguez@gmail.com",
      phoneno: "+1 (961) 523-4453",
      address: "234 Oak Street, Flat 7",
    },
    {
      id: "#CLI-0004",
      client: "Kathryn Murphy",
      profilePicture: "/placeholder.svg?height=40&width=40",
      email: "juan.rodriguez@gmail.com",
      phoneno: "+1 (961) 523-4453",
      address: "456 Ocean Avenue, Miami, FL 12345",
    },
    {
      id: "#CLI-0005",
      client: "Devon Lane",
      profilePicture: "/placeholder.svg?height=40&width=40",
      email: "mariarodriguez@gmail.com",
      phoneno: "+1 (961) 523-4453",
      address: "234 Oak Street, Flat 7",
    },
    {
      id: "#CLI-0006",
      client: "Eleanor Pena",
      profilePicture: "/placeholder.svg?height=40&width=40",
      email: "mariarodriguez@gmail.com",
      phoneno: "+1 (961) 523-4453",
      address: "234 Oak Street, Flat 7",
    },
    {
      id: "#CLI-0007",
      client: "Devon Lane",
      profilePicture: "/placeholder.svg?height=40&width=40",
      email: "juan.rodriguez@gmail.com",
      phoneno: "+1 (961) 523-4453",
      address: "456 Ocean Avenue, Miami, FL 12345",
    },
  ];
};

// Delete a Client
export const deleteClient = async (id: string): Promise<void> => {
  await simulateDelay(500);
  console.log(`Deleting client with ID: ${id}`);
};

// Users (User Management Page)
export const fetchUsers = async (): Promise<User[]> => {
  await simulateDelay(1000);
  return [
    {
      id: "EMP-0001",
      firstname: "Eleanor",
      lastname: "Pena",
      email: "eleanor.pena@gmail.com",
      userrole: "Admin",
      profilePicture: "/images/userpic.jpg",
    },
    {
      id: "EMP-0002",
      firstname: "Kathryn",
      lastname: "Murphy",
      email: "kathryn.murphy@gmail.com",
      userrole: "Service Staff",
      profilePicture: "/images/userpic.jpg",
    },
    {
      id: "EMP-0003",
      firstname: "Devon",
      lastname: "Lane",
      email: "devon.lane@gmail.com",
      userrole: "Service Staff",
      profilePicture: "/images/userpic.jpg",
    },
    {
      id: "EMP-0004",
      firstname: "Eleanor",
      lastname: "Pena",
      email: "eleanor.pena2@gmail.com",
      userrole: "Service Staff",
      profilePicture: "/images/userpic.jpg",
    },
    {
      id: "EMP-0005",
      firstname: "Devon",
      lastname: "Lane",
      email: "devon.lane2@gmail.com",
      userrole: "Data Operator",
      profilePicture: "/images/userpic.jpg",
    },
  ];
};

// Delete a User
export const deleteUser = async (id: string): Promise<void> => {
  await simulateDelay(500);
  console.log(`Deleting user with ID: ${id}`);
};

// Shift Cards (Closure Schedule Page)
export const fetchShiftCards = async (): Promise<ShiftCard[]> => {
  await simulateDelay(1000);
  return [
    { day: "Today", status: "Locked" },
    { day: "25-04-2025", status: "Locked" },
  ];
};

// Services (Closure Schedule Page)
export const fetchServices = async (): Promise<Service[]> => {
  await simulateDelay(1000);
  return [
    { id: "1", label: "Tire Rotation", checked: false },
    { id: "2", label: "Engine Check", checked: true },
    { id: "3", label: "Oil Filter Change", checked: false },
    { id: "4", label: "Wheel Alignment", checked: true },
    { id: "5", label: "Suspension Upgrades", checked: false },
  ];
};

// Add a Shift Card
export const addShiftCard = async (shiftCard: ShiftCard): Promise<ShiftCard> => {
  await simulateDelay(500);
  return shiftCard;
};