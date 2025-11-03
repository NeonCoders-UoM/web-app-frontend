# Services Integration Guide

## Current Status

The services functionality is currently working with **fallback data** because the backend `/Services` endpoint is not yet implemented.

## What's Working

✅ **Services Page**: The `/services` page loads and displays a list of services  
✅ **Fallback Data**: When the backend endpoint is unavailable, the page shows sample services  
✅ **UI Components**: All service management UI components are functional  
✅ **Error Handling**: Graceful fallback when backend is unavailable  
✅ **Service Center Services**: Service center specific services are properly integrated with backend

## What's Missing

❌ **Backend Endpoint**: The `/Services` endpoint doesn't exist in your backend  
❌ **Real Data**: Currently using mock data instead of database data  
❌ **CRUD Operations**: Create, update, delete operations will fail until backend is implemented

## Current Implementation

### Frontend API Function

```typescript
// src/utils/api.ts - fetchSystemServices()
export const fetchSystemServices = async (): Promise<SystemService[]> => {
  try {
    const response = await axiosInstance.get("/Services");
    return response.data;
  } catch (error) {
    // Falls back to mock data when endpoint is not available
    return fallbackServices;
  }
};
```

### Fallback Data

The function provides these sample services when the backend is unavailable:

1. **Oil Change** - Complete oil change with filter replacement
2. **Tire Replacement** - Replace worn tires with new ones
3. **Brake Service** - Brake pad replacement and brake fluid change
4. **Engine Repair** - Diagnostic and repair of engine issues
5. **Full Inspection** - Comprehensive vehicle inspection

## Service Center Services Integration

### Backend JSON Structure

The service center services now match your backend structure:

```json
{
  "serviceCenterServiceId": 0,
  "station_id": 0,
  "serviceId": 0,
  "packageId": 0,
  "customPrice": 0,
  "serviceCenterBasePrice": 0,
  "serviceCenterLoyaltyPoints": 0,
  "isAvailable": true,
  "notes": "string",
  "serviceName": "string",
  "serviceDescription": "string",
  "serviceBasePrice": 0,
  "category": "string",
  "stationName": "string",
  "packageName": "string",
  "packagePercentage": 0,
  "packageDescription": "string"
}
```

### Updated Frontend Interface

```typescript
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
```

### Service Center Services Page

The `/service-centers/[id]/view/services` page now:

- ✅ Fetches real data from `/ServiceCenters/{id}/Services` endpoint
- ✅ Displays service information with proper field mapping
- ✅ Shows package information when available
- ✅ Handles fallback data gracefully when backend is unavailable

## Backend Requirements

To fully implement services functionality, you need to add these endpoints to your backend:

### Required Endpoints

1. **GET /api/Services** - Get all system services
2. **GET /api/Services/{id}** - Get specific service
3. **POST /api/Services** - Create new service
4. **PUT /api/Services/{id}** - Update service
5. **DELETE /api/Services/{id}** - Delete service
6. **PATCH /api/Services/{id}/status** - Toggle service active status

### Service Center Services Endpoints (Already Working)

1. **GET /api/ServiceCenters/{id}/Services** - Get services for a service center ✅
2. **POST /api/ServiceCenters/{id}/Services** - Add service to service center ✅
3. **DELETE /api/ServiceCenters/{id}/Services/{serviceId}** - Remove service from service center ✅

### Backend Model Structure

```csharp
public class SystemService
{
    public int ServiceId { get; set; }
    public string ServiceName { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class ServiceCenterService
{
    public int ServiceCenterServiceId { get; set; }
    public int Station_id { get; set; }
    public int ServiceId { get; set; }
    public int PackageId { get; set; }
    public decimal CustomPrice { get; set; }
    public decimal ServiceCenterBasePrice { get; set; }
    public int ServiceCenterLoyaltyPoints { get; set; }
    public bool IsAvailable { get; set; }
    public string Notes { get; set; }
    public string ServiceName { get; set; }
    public string ServiceDescription { get; set; }
    public decimal ServiceBasePrice { get; set; }
    public string Category { get; set; }
    public string StationName { get; set; }
    public string PackageName { get; set; }
    public int PackagePercentage { get; set; }
    public string PackageDescription { get; set; }
}
```

### Controller Example

```csharp
[ApiController]
[Route("api/[controller]")]
public class ServicesController : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SystemService>>> GetServices()
    {
        // Return all active services
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SystemService>> GetService(int id)
    {
        // Return specific service
    }

    [HttpPost]
    public async Task<ActionResult<SystemService>> CreateService(CreateSystemServiceDto dto)
    {
        // Create new service
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateService(int id, UpdateSystemServiceDto dto)
    {
        // Update service
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteService(int id)
    {
        // Delete service
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> ToggleStatus(int id, [FromBody] bool isActive)
    {
        // Toggle service active status
    }
}
```

## Testing

### Current Testing (Fallback Mode)

1. Start the frontend: `npm run dev`
2. Navigate to `/services`
3. You should see the services list with fallback data
4. Check browser console for "Using fallback services data" message

### Service Center Services Testing

1. Navigate to `/service-centers/[id]/view/services`
2. You should see real service center services from your backend
3. The data should match the JSON structure you provided

### Future Testing (With Backend)

1. Implement the backend endpoints
2. Start both frontend and backend
3. Navigate to `/services`
4. You should see real data from your database
5. Test CRUD operations (create, edit, delete services)

## Console Messages

When the services page loads, you'll see these console messages:

- **With Backend**: "Successfully fetched system services from backend: [...]"
- **Without Backend**: "Services endpoint not found (expected - backend endpoint not implemented yet), using fallback data"

## Next Steps

1. **Implement Backend**: Add the ServicesController with all required endpoints
2. **Test Integration**: Verify that real data loads from the database
3. **Add Features**: Implement service creation, editing, and deletion forms
4. **Enhance UI**: Add filtering, searching, and pagination for services

## Related Files

- `src/app/(authorized)/services/page.tsx` - Services management page
- `src/app/(authorized)/service-centers/[id]/view/services/page.tsx` - Service center services page
- `src/utils/api.ts` - API functions for services
- `src/types/index.ts` - TypeScript interfaces for services
- `src/components/...` - Service-related UI components
