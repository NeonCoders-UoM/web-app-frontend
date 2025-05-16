import { ServiceCenter, DashboardStats, Client, User, Vehicle } from "@/types";

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

const mockClients: Client[] = [
  {
    id: "#CLI-0001",
    client: "Devon Lane",
    profilePicture: "/placeholder.svg?height=40&width=40",
    email: "mariarodriguez@gmail.com",
    phoneno: "+1 (961) 523-4453",
    address: "456 Ocean Avenue, Miami, FL 12345",
    nic: "2000345682",
    points: 13654,
    tiers: [
      { name: "Bronze", threshold: 5000 },
      { name: "Silver", threshold: 10000 },
      { name: "Gold", threshold: 20000 },
    ],
    vehicles: [
      {
        id: 1,
        type: "Honda",
        brand: "Amaze",
        model: "VX I-DTEC",
        year: "2007",
        fuelType: "Petrol",
        licensePlate: "KW - 4324",
        transmission: "Manual",
        vin: "JH4DA9350LS001234",
      },
      {
        id: 2,
        type: "Toyota",
        brand: "Corolla",
        model: "XLi",
        year: "2015",
        fuelType: "Petrol",
        licensePlate: "KW - 7890",
        transmission: "Automatic",
        vin: "JT2BF22K1W0123456",
      },
      {
        id: 3,
        type: "Nissan",
        brand: "Altima",
        model: "SV",
        year: "2018",
        fuelType: "Petrol",
        licensePlate: "KW - 1234",
        transmission: "CVT",
        vin: "1N4AL3AP8JC231456",
      },
    ],
    serviceHistory: [
      {
        id: "#20240001",
        title: "Engine Repair",
        price: 1200,
        originalPrice: 1500,
        type: "Product",
        date: "2024-10-23",
        serviceCenter: "AutoCare Hub",
        status: "Completed",
        image: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "#20240002",
        title: "Battery Replacement",
        price: 300,
        originalPrice: 300,
        type: "Emergency",
        date: "2024-10-19",
        serviceCenter: "NextGen Motors",
        status: "Pending",
        image: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "#20240003",
        title: "Oil Change",
        price: 80,
        originalPrice: 100,
        type: "Maintenance",
        date: "2024-09-15",
        serviceCenter: "Speed Motors",
        status: "Completed",
        image: "/placeholder.svg?height=40&width=40",
      },
    ],
    appointments: [
      {
        appointmentId: "SAPT-0005",
        owner: "Devon Lane",
        licensePlate: "KW - 4324",
        date: "Dec 23, 2024",
        vehicle: "Honda Amaze VX I-DTEC (2007)",
        services: ["Oil Change", "Brake Inspection", "Tire Rotation"],
        serviceCenter: "Speed Motors, Colombo",
      },
      {
        appointmentId: "SAPT-0007",
        owner: "Devon Lane",
        licensePlate: "KW - 7890",
        date: "Dec 25, 2024",
        vehicle: "Toyota Corolla XLi (2015)",
        services: ["Full Service", "AC Repair"],
        serviceCenter: "AutoCare Hub, Dehiwala",
      },
    ],
  },
  {
    id: "#CLI-0002",
    client: "Kathryn Murphy",
    profilePicture: "/placeholder.svg?height=40&width=40",
    email: "juan.rodriguez@gmail.com",
    phoneno: "+1 (961) 523-4453",
    address: "234 Oak Street, Flat 7",
    nic: "2000345683",
    points: 12500,
    tiers: [
      { name: "Bronze", threshold: 5000 },
      { name: "Silver", threshold: 10000 },
      { name: "Gold", threshold: 20000 },
    ],
    vehicles: [
      {
        id: 1,
        type: "Honda",
        brand: "Amaze",
        model: "VX I-DTEC",
        year: "2007",
        fuelType: "Petrol",
        licensePlate: "KW - 4324",
        transmission: "Manual",
        vin: "JH4DA9350LS001234",
      },
      {
        id: 2,
        type: "Toyota",
        brand: "Corolla",
        model: "XLi",
        year: "2015",
        fuelType: "Petrol",
        licensePlate: "KW - 7890",
        transmission: "Automatic",
        vin: "JT2BF22K1W0123456",
      },
      {
        id: 3,
        type: "Nissan",
        brand: "Altima",
        model: "SV",
        year: "2018",
        fuelType: "Petrol",
        licensePlate: "KW - 1234",
        transmission: "CVT",
        vin: "1N4AL3AP8JC231456",
      },
    ],
    serviceHistory: [
      {
        id: "#20240004",
        title: "Tire Replacement",
        price: 400,
        originalPrice: 500,
        type: "Maintenance",
        date: "2024-10-20",
        serviceCenter: "AutoFix Hub",
        status: "Completed",
        image: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "#20240005",
        title: "Brake Service",
        price: 600,
        originalPrice: 700,
        type: "Product",
        date: "2024-10-18",
        serviceCenter: "Rapid Repairs",
        status: "Completed",
        image: "/placeholder.svg?height=40&width=40",
      },
    ],
    appointments: [
      {
        appointmentId: "SAPT-0008",
        owner: "Kathryn Murphy",
        licensePlate: "KW - 4324",
        date: "Dec 26, 2024",
        vehicle: "Honda Amaze VX I-DTEC (2007)",
        services: ["Oil Change", "Tire Rotation"],
        serviceCenter: "Speed Motors, Colombo",
      },
    ],
  },
  {
    id: "#CLI-0003",
    client: "Eleanor Pena",
    profilePicture: "/placeholder.svg?height=40&width=40",
    email: "mariarodriguez@gmail.com",
    phoneno: "+1 (961) 523-4453",
    address: "234 Oak Street, Flat 7",
    nic: "2000345684",
    points: 18000,
    tiers: [
      { name: "Bronze", threshold: 5000 },
      { name: "Silver", threshold: 10000 },
      { name: "Gold", threshold: 20000 },
    ],
    vehicles: [
      {
        id: 1,
        type: "Honda",
        brand: "Amaze",
        model: "VX I-DTEC",
        year: "2007",
        fuelType: "Petrol",
        licensePlate: "KW - 4324",
        transmission: "Manual",
        vin: "JH4DA9350LS001234",
      },
      {
        id: 2,
        type: "Toyota",
        brand: "Corolla",
        model: "XLi",
        year: "2015",
        fuelType: "Petrol",
        licensePlate: "KW - 7890",
        transmission: "Automatic",
        vin: "JT2BF22K1W0123456",
      },
      {
        id: 3,
        type: "Nissan",
        brand: "Altima",
        model: "SV",
        year: "2018",
        fuelType: "Petrol",
        licensePlate: "KW - 1234",
        transmission: "CVT",
        vin: "1N4AL3AP8JC231456",
      },
    ],
    serviceHistory: [
      {
        id: "#20240006",
        title: "AC Repair",
        price: 500,
        originalPrice: 600,
        type: "Emergency",
        date: "2024-10-22",
        serviceCenter: "NextGen Motors",
        status: "Pending",
        image: "/placeholder.svg?height=40&width=40",
      },
    ],
    appointments: [
      {
        appointmentId: "SAPT-0009",
        owner: "Eleanor Pena",
        licensePlate: "KW - 7890",
        date: "Dec 27, 2024",
        vehicle: "Toyota Corolla XLi (2015)",
        services: ["Full Service"],
        serviceCenter: "AutoCare Hub, Dehiwala",
      },
    ],
  },
  {
    id: "#CLI-0004",
    client: "Kathryn Murphy",
    profilePicture: "/placeholder.svg?height=40&width=40",
    email: "juan.rodriguez@gmail.com",
    phoneno: "+1 (961) 523-4453",
    address: "456 Ocean Avenue, Miami, FL 12345",
    nic: "2000345685",
    points: 9500,
    tiers: [
      { name: "Bronze", threshold: 5000 },
      { name: "Silver", threshold: 10000 },
      { name: "Gold", threshold: 20000 },
    ],
    vehicles: [
      {
        id: 1,
        type: "Honda",
        brand: "Am cardiologistsaze",
        model: "VX I-DTEC",
        year: "2007",
        fuelType: "Petrol",
        licensePlate: "KW - 4324",
        transmission: "Manual",
        vin: "JH4DA9350LS001234",
      },
    ],
    serviceHistory: [
      {
        id: "#20240007",
        title: "Oil Change",
        price: 80,
        originalPrice: 100,
        type: "Maintenance",
        date: "2024-10-21",
        serviceCenter: "Speed Motors",
        status: "Completed",
        image: "/placeholder.svg?height=40&width=40",
      },
    ],
    appointments: [],
  },
  {
    id: "#CLI-0005",
    client: "Devon Lane",
    profilePicture: "/placeholder.svg?height=40&width=40",
    email: "mariarodriguez@gmail.com",
    phoneno: "+1 (961) 523-4453",
    address: "234 Oak Street, Flat 7",
    nic: "2000345686",
    points: 11000,
    tiers: [
      { name: "Bronze", threshold: 5000 },
      { name: "Silver", threshold: 10000 },
      { name: "Gold", threshold: 20000 },
    ],
    vehicles: [
      {
        id: 1,
        type: "Toyota",
        brand: "Corolla",
        model: "XLi",
        year: "2015",
        fuelType: "Petrol",
        licensePlate: "KW - 7890",
        transmission: "Automatic",
        vin: "JT2BF22K1W0123456",
      },
    ],
    serviceHistory: [],
    appointments: [],
  },
  {
    id: "#CLI-0006",
    client: "Eleanor Pena",
    profilePicture: "/placeholder.svg?height=40&width=40",
    email: "mariarodriguez@gmail.com",
    phoneno: "+1 (961) 523-4453",
    address: "234 Oak Street, Flat 7",
    nic: "2000345687",
    points: 22000,
    tiers: [
      { name: "Bronze", threshold: 5000 },
      { name: "Silver", threshold: 10000 },
      { name: "Gold", threshold: 20000 },
    ],
    vehicles: [
      {
        id: 1,
        type: "Nissan",
        brand: "Altima",
        model: "SV",
        year: "2018",
        fuelType: "Petrol",
        licensePlate: "KW - 1234",
        transmission: "CVT",
        vin: "1N4AL3AP8JC231456",
      },
    ],
    serviceHistory: [],
    appointments: [],
  },
  {
    id: "#CLI-0007",
    client: "Devon Lane",
    profilePicture: "/placeholder.svg?height=40&width=40",
    email: "juan.rodriguez@gmail.com",
    phoneno: "+1 (961) 523-4453",
    address: "456 Ocean Avenue, Miami, FL 12345",
    nic: "2000345688",
    points: 8500,
    tiers: [
      { name: "Bronze", threshold: 5000 },
      { name: "Silver", threshold: 10000 },
      { name: "Gold", threshold: 20000 },
    ],
    vehicles: [
      {
        id: 1,
        type: "Honda",
        brand: "Amaze",
        model: "VX I-DTEC",
        year: "2007",
        fuelType: "Petrol",
        licensePlate: "KW - 4324",
        transmission: "Manual",
        vin: "JH4DA9350LS001234",
      },
    ],
    serviceHistory: [],
    appointments: [],
  },
];

const mockUsers: User[] = [
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

const dashboardData: DashboardStats = {
  customers: 40689,
  vehicles: 10293,
  serviceCenters: mockServiceCenters.length,
};

// Fetch all vehicles
export const fetchVehicles = async (): Promise<{
  id: string;
  client: string;
  pictureSrc: string;
  type: string;
  brand: string;
  model: string;
  licenseplate: string;
}[]> => {
  try {
    const clients = await fetchClients();
    const vehicles = clients.flatMap((client, index) =>
      (client.vehicles || []).map((vehicle: Vehicle) => ({
        id: `#${(index * 1000 + vehicle.id).toString().padStart(4, "0")}`,
        client: client.client,
        pictureSrc: client.profilePicture,
        type: vehicle.type,
        brand: vehicle.brand,
        model: vehicle.model,
        licenseplate: vehicle.licensePlate,
      }))
    );
    return vehicles;
  } catch (error) {
    console.error("Error in fetchVehicles:", error);
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

// Fetch all clients
export const fetchClients = async (): Promise<Client[]> => {
  try {
    return mockClients;
  } catch (error) {
    console.error("Error in fetchClients:", error);
    throw error;
  }
};

// Fetch a single client by ID
export const fetchClientById = async (id: string): Promise<Client | null> => {
  try {
    const client = mockClients.find((c) => c.id === id);
    return client || null;
  } catch (error) {
    console.error("Error in fetchClientById:", error);
    throw error;
  }
};

// Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
  try {
    return mockUsers;
  } catch (error) {
    console.error("Error in fetchUsers:", error);
    throw error;
  }
};

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
    return dashboardData;
  } catch (error) {
    console.error("Error in fetchDashboardStats:", error);
    throw error;
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