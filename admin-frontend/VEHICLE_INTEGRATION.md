# Vehicle Backend Integration Guide

## Overview

This document explains how the frontend integrates with the CustomersController backend API to display and manage vehicles that belong to customers.

## Backend Integration

### API Endpoints

The frontend now connects to these CustomersController vehicle endpoints:

1. **GET /api/Customers/{customerId}/vehicles** - Get all vehicles for a customer
2. **GET /api/Customers/{customerId}/vehicles/{vehicleId}** - Get specific vehicle
3. **POST /api/Customers/{customerId}/vehicles** - Register new vehicle for customer
4. **PUT /api/Customers/{customerId}/vehicles/{vehicleId}** - Update vehicle
5. **DELETE /api/Customers/{customerId}/vehicles/{vehicleId}** - Delete vehicle

### Frontend API Functions

Added/Updated in `src/utils/api.ts`:

- `fetchVehicles()` - Fetch all vehicles from all customers
- `fetchCustomerVehicles(customerId)` - Fetch vehicles for specific customer
- `fetchVehicleById(customerId, vehicleId)` - Fetch specific vehicle
- `registerVehicle(customerId, vehicleData)` - Register new vehicle
- `updateVehicle(customerId, vehicleId, vehicleData)` - Update vehicle
- `deleteVehicle(customerId, vehicleId)` - Delete vehicle

## Data Transformation

### Backend Vehicle Response Structure

```typescript
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
```

### Frontend Vehicle Display Structure

```typescript
interface VehicleDisplay {
  id: string; // Formatted as "#0001"
  vehicleId: number; // Backend ID
  customerId: number; // Owner's customer ID
  client: string; // Customer name
  clientEmail: string; // Customer email
  pictureSrc: string; // Customer profile picture
  type: string; // Derived from fuel type
  brand: string; // Vehicle brand
  model: string; // Vehicle model
  licenseplate: string; // Registration number
  registrationNumber: string; // Same as licenseplate
  chassisNumber: string; // Chassis number
  mileage?: number; // Current mileage
  fuel: string; // Fuel type
  year: string; // Manufacturing year
}
```

## Vehicle Type Derivation

Since the backend doesn't have a vehicle type field, the frontend derives it from the fuel type:

```typescript
const getVehicleType = (fuel: string): string => {
  const fuelLower = fuel.toLowerCase();
  if (fuelLower.includes("diesel")) return "Truck";
  if (fuelLower.includes("hybrid")) return "Hybrid";
  if (fuelLower.includes("electric")) return "Electric";
  return "Car"; // Default type
};
```

## Features Implemented

### Vehicle List Page Updates

- **Multi-Customer Vehicle Fetching**: Fetches vehicles from all customers
- **Enhanced Table Display**: Shows Year and Fuel columns
- **Real Delete Functionality**: Actually deletes vehicles from backend
- **Improved Edit Navigation**: Routes to proper vehicle edit page with customer and vehicle IDs
- **Error Handling**: Graceful handling when customer vehicle fetch fails
- **Loading States**: Shows loading during delete operations

### Vehicle Actions

1. **View**: Opens vehicle details modal
2. **Edit**: Navigates to `/vehicle/{customerId}/{vehicleId}/edit`
3. **Delete**: Confirms deletion and removes vehicle from backend

### Data Flow

1. Page loads and calls `fetchVehicles()`
2. `fetchVehicles()` first fetches all customers using `fetchClients()`
3. For each customer, it calls `/api/Customers/{customerId}/vehicles`
4. All vehicles are combined and transformed for display
5. Vehicle operations (edit/delete) use the proper customer and vehicle IDs

## Fallback Data

When the backend is unavailable, the system provides fallback vehicle data:

1. Toyota Camry (2020, Petrol) - owned by Devon Lane
2. Honda CR-V (2021, Hybrid) - owned by Kathryn Murphy

## Error Handling

### Network Errors

- If customer list fetch fails, uses fallback data
- If individual customer vehicle fetch fails, continues with other customers
- Logs warnings for failed customer vehicle fetches

### Delete Operations

- Shows confirmation dialog before deletion
- Shows loading state during deletion
- Refreshes vehicle list after successful deletion
- Shows error alert if deletion fails

## Usage Examples

### Fetching All Vehicles

```typescript
const vehicles = await fetchVehicles();
// Returns vehicles from all customers
```

### Fetching Customer Vehicles

```typescript
const customerVehicles = await fetchCustomerVehicles(123);
// Returns vehicles for customer ID 123
```

### Registering New Vehicle

```typescript
const newVehicle = await registerVehicle(123, {
  registrationNumber: "ABC-1234",
  brand: "Toyota",
  model: "Corolla",
  chassisNumber: "1HGCM82633A123456",
  mileage: 0,
  fuel: "Petrol",
  year: "2024",
});
```

### Updating Vehicle

```typescript
const success = await updateVehicle(123, 456, {
  registrationNumber: "XYZ-5678",
  brand: "Honda",
  model: "Civic",
  chassisNumber: "2HGCM82633A654321",
  mileage: 15000,
  fuel: "Hybrid",
  year: "2023",
});
```

### Deleting Vehicle

```typescript
const success = await deleteVehicle(123, 456);
// Deletes vehicle ID 456 from customer ID 123
```

## Configuration

### Environment Variables

Ensure `NEXT_PUBLIC_API_URL` is set to your backend URL:

```
NEXT_PUBLIC_API_URL=http://localhost:5039/api
```

### Authentication

The API functions use the configured axios instance with:

- Bearer token authentication (required for vehicle endpoints)
- Proper role-based authorization
- CORS credentials

## Next Steps

### Potential Enhancements

1. **Vehicle Registration Form**: Create form to register new vehicles
2. **Vehicle Edit Form**: Create form to edit vehicle details
3. **Advanced Filtering**: Filter by fuel type, year, brand, etc.
4. **Vehicle Search**: Search vehicles by registration number or customer
5. **Vehicle Export**: Export vehicle list as PDF/Excel
6. **Vehicle Images**: Add vehicle photo upload functionality
7. **Maintenance Reminders**: Integration with service history for maintenance alerts

### Backend Requirements

Ensure your backend has:

1. CustomersController properly configured with vehicle endpoints
2. Proper authorization roles configured
3. CORS enabled for frontend domain
4. Vehicle model with all required fields

## Testing

The integration includes comprehensive fallback data for testing when the backend is unavailable. The vehicle page will show sample vehicles and allow full interaction during development.

## Authorization

All vehicle endpoints require authentication with appropriate roles:

- **GET endpoints**: SuperAdmin, Admin, ServiceCenterAdmin, Cashier
- **POST/PUT/DELETE endpoints**: Appropriate admin roles

Make sure your frontend authentication system provides proper bearer tokens for these operations.
