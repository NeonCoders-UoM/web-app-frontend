// Example usage of vehicle API functions

import { 
  registerVehicle, 
  updateVehicle, 
  deleteVehicle, 
  fetchCustomerVehicles,
  VehicleRegistrationDto 
} from "@/utils/api";

// Example: Register a new vehicle for a customer
export const exampleRegisterVehicle = async (customerId: number) => {
  const vehicleData: VehicleRegistrationDto = {
    registrationNumber: "ABC-1234",
    brand: "Toyota",
    model: "Corolla",
    chassisNumber: "1HGCM82633A123456",
    mileage: 0,
    fuel: "Petrol",
    year: "2024"
  };

  try {
    const newVehicle = await registerVehicle(customerId, vehicleData);
    console.log("Vehicle registered successfully:", newVehicle);
    return newVehicle;
  } catch (error) {
    console.error("Failed to register vehicle:", error);
    throw error;
  }
};

// Example: Update a vehicle
export const exampleUpdateVehicle = async (customerId: number, vehicleId: number) => {
  const updatedData: VehicleRegistrationDto = {
    registrationNumber: "XYZ-5678",
    brand: "Honda",
    model: "Civic",
    chassisNumber: "2HGCM82633A654321",
    mileage: 15000,
    fuel: "Hybrid",
    year: "2023"
  };

  try {
    const success = await updateVehicle(customerId, vehicleId, updatedData);
    console.log("Vehicle updated successfully:", success);
    return success;
  } catch (error) {
    console.error("Failed to update vehicle:", error);
    throw error;
  }
};

// Example: Delete a vehicle with confirmation
export const exampleDeleteVehicle = async (customerId: number, vehicleId: number) => {
  const confirmed = window.confirm("Are you sure you want to delete this vehicle?");
  
  if (!confirmed) {
    return false;
  }

  try {
    const success = await deleteVehicle(customerId, vehicleId);
    console.log("Vehicle deleted successfully:", success);
    return success;
  } catch (error) {
    console.error("Failed to delete vehicle:", error);
    throw error;
  }
};

// Example: Fetch all vehicles for a customer
export const exampleFetchCustomerVehicles = async (customerId: number) => {
  try {
    const vehicles = await fetchCustomerVehicles(customerId);
    console.log("Customer vehicles:", vehicles);
    return vehicles;
  } catch (error) {
    console.error("Failed to fetch customer vehicles:", error);
    throw error;
  }
};

// Example vehicle form validation
export const validateVehicleData = (data: VehicleRegistrationDto): string[] => {
  const errors: string[] = [];

  if (!data.registrationNumber || data.registrationNumber.trim() === "") {
    errors.push("Registration number is required");
  }

  if (!data.brand || data.brand.trim() === "") {
    errors.push("Brand is required");
  }

  if (!data.model || data.model.trim() === "") {
    errors.push("Model is required");
  }

  if (!data.chassisNumber || data.chassisNumber.trim() === "") {
    errors.push("Chassis number is required");
  }

  if (!data.fuel || data.fuel.trim() === "") {
    errors.push("Fuel type is required");
  }

  if (!data.year || data.year.trim() === "") {
    errors.push("Year is required");
  } else {
    const yearNum = parseInt(data.year);
    const currentYear = new Date().getFullYear();
    if (yearNum < 1900 || yearNum > currentYear + 1) {
      errors.push("Please enter a valid year");
    }
  }

  if (data.mileage !== undefined && data.mileage < 0) {
    errors.push("Mileage cannot be negative");
  }

  return errors;
};

// Example: Format vehicle display name
export const formatVehicleDisplayName = (vehicle: { brand: string; model: string; year: string; registrationNumber: string }): string => {
  return `${vehicle.brand} ${vehicle.model} (${vehicle.year}) - ${vehicle.registrationNumber}`;
};

// Example: Get fuel type options for forms
export const getFuelTypeOptions = () => [
  { value: "Petrol", label: "Petrol" },
  { value: "Diesel", label: "Diesel" },
  { value: "Hybrid", label: "Hybrid" },
  { value: "Electric", label: "Electric" },
  { value: "CNG", label: "CNG" },
  { value: "LPG", label: "LPG" }
];
