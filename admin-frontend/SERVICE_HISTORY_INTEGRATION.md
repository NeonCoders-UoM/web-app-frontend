# Service History Integration Guide

## Overview

This document explains how the frontend integrates with the VehicleServiceHistoryController backend API to display and manage vehicle service history.

## Backend Integration

### API Endpoints

The frontend now connects to these VehicleServiceHistoryController endpoints:

1. **GET /api/VehicleServiceHistory/Vehicle/{vehicleId}** - Get all service history for a vehicle
2. **GET /api/VehicleServiceHistory/{vehicleId}/{serviceHistoryId}** - Get specific service history record
3. **POST /api/VehicleServiceHistory/{vehicleId}** - Add new service history record
4. **PUT /api/VehicleServiceHistory/{vehicleId}/{serviceHistoryId}** - Update service history record
5. **DELETE /api/VehicleServiceHistory/{vehicleId}/{serviceHistoryId}** - Delete service history record

### Frontend API Functions

Added to `src/utils/api.ts`:

- `fetchVehicleServiceHistory(vehicleId)` - Fetch service history for a vehicle
- `fetchServiceHistory(vehicleId, serviceHistoryId)` - Fetch specific service record
- `addServiceHistory(vehicleId, serviceData)` - Add new service record
- `updateServiceHistory(vehicleId, serviceHistoryId, serviceData)` - Update service record
- `deleteServiceHistory(vehicleId, serviceHistoryId)` - Delete service record

## Data Transformation

### Backend DTO Structure

```typescript
interface ServiceHistoryDTO {
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
```

### Frontend Order Structure

The service history data is transformed to match the OrdersTable component:

```typescript
{
  id: serviceHistoryId.toString(),
  title: serviceType,
  price: cost,
  originalPrice: cost,
  type: isVerified ? "Verified" : "External",
  date: formatted serviceDate,
  serviceCenter: serviceCenterName || externalServiceCenterName,
  status: "Completed",
  image: "/images/default.avif"
}
```

## Features Implemented

### Client Profile Page Updates

- **Dynamic Service History Loading**: Service history is fetched when a vehicle tab is selected
- **Vehicle-Specific History**: Each vehicle shows its own service history
- **Loading States**: Shows loading spinner while fetching data
- **Error Handling**: Graceful fallback to empty array if fetch fails
- **Real-time Updates**: Service history refreshes when switching between vehicles

### Display Features

- **Verified vs External Services**: Shows whether service was done at registered service center
- **Service Center Names**: Displays either registered service center name or external service center name
- **Cost Information**: Shows actual service cost from backend
- **Service Dates**: Properly formatted service dates
- **Service Types**: Shows the type of service performed

## Fallback Data

When the backend is unavailable, the system provides fallback service history data for testing:

1. Oil Change service
2. Brake Service
3. Engine Diagnostic (external service center)

## Usage in Components

### Client Profile Page

```typescript
// Service history is automatically fetched when:
// 1. Component mounts
// 2. Active vehicle tab changes
// 3. User switches to service history view

const [serviceHistory, setServiceHistory] = useState<ServiceHistoryDTO[]>([]);

useEffect(() => {
  if (clientData && activeView === "serviceHistory") {
    const vehicleId = clientData.vehicles[activeTab - 1].id;
    const history = await fetchVehicleServiceHistory(vehicleId);
    setServiceHistory(history);
  }
}, [clientData, activeTab, activeView]);
```

## Configuration

### Environment Variables

Ensure `NEXT_PUBLIC_API_URL` is set to your backend URL:

```
NEXT_PUBLIC_API_URL=http://localhost:5039/api
```

### Authentication

The API functions use the configured axios instance with:

- Bearer token authentication
- CORS credentials
- Proper error handling

## Next Steps

### Potential Enhancements

1. **Add Service History Form**: Create a form component to add new service records
2. **Edit Service History**: Add functionality to edit existing service records
3. **Delete Service History**: Add delete functionality with confirmation
4. **File Upload**: Implement receipt document upload for service records
5. **Service History Filtering**: Add filters by date range, service type, or service center
6. **Service History Export**: Add functionality to export service history as PDF/Excel

### Backend Requirements

Ensure your backend has:

1. VehicleServiceHistoryController properly configured
2. CORS enabled for frontend domain
3. Authentication middleware if required
4. File upload capabilities for receipt documents

## Testing

The integration includes comprehensive fallback data for testing when the backend is unavailable. This ensures the frontend remains functional during development and testing phases.
