# Closure Schedule Integration Guide

## Overview

The closure schedule system allows service centers to manage their closure dates and communicate these closures to customers. This integration connects the frontend closure schedule page with the backend ClosureScheduleController API.

## Business Purpose

**Service Center Closure Management:**

- Service centers can schedule when they will be closed
- Customers are informed about unavailability to prevent booking conflicts
- Improves customer experience by setting clear expectations
- Reduces booking conflicts and customer frustration

**Customer Impact:**

- Customers see closure dates as unavailable when booking appointments
- Clear communication about service center availability
- Prevents booking on closed dates
- Improves overall customer satisfaction

## Frontend Features

### Enhanced Week Selection

- **All Weeks Available**: Shows all 52 weeks of the current year
- **Dynamic Week Generation**: Automatically generates week labels with date ranges
- **Format**: "Week 12 (Jan 1-7)" with proper month/day formatting
- **Current Year**: Uses the current year for all week calculations

### Service Center Specific Services

- **Dynamic Service Loading**: Fetches services specific to each service center
- **Service Details**: Shows service name, category, price, and description
- **Availability Status**: Displays whether each service is available
- **Service Count**: Shows total number of available services in service center info

### Service Center Selection

- **Super Admin**: Can select from all service centers via dropdown
- **Service Center Admin**: Automatically uses their assigned service center
- **Other Roles**: Uses the first available service center as default

**Dynamic Service Center ID Handling:**

- Service center ID is always dynamic based on the selected service center
- No hardcoded fallback to service center ID 1
- Proper error states when no service centers are available
- Clear visual feedback showing the current service center ID
- Automatic closure refresh when switching service centers

### Week Management

- **All Weeks**: All 52 weeks of the current year are available for selection
- **Week Numbers**: Extracted from the week selection string (e.g., "Week 12 (Jan 1-7)" → 12)
- **Closures**: Loaded for the current service center and week
- **Dynamic Generation**: Week labels are generated programmatically with proper date formatting

### Closure Operations

1. **Adding Closures**: When a user selects days and saves, the system:

   - Validates that a service center is selected
   - Extracts week number from the selection
   - Creates closure records for each selected day using the current service center ID
   - Updates the UI with new shift cards
   - Shows success message with closure count and service center name
   - Handles errors gracefully (continues with other days if one fails)

2. **Loading Closures**: On page load, the system:

   - Fetches existing closures for the current service center and week
   - Transforms them to shift cards for display
   - Shows loading state during fetch
   - Displays empty state when no closures exist
   - Refreshes closures when service center selection changes

3. **Service Center Switching**: When switching service centers:

   - Clears existing closure display
   - Loads closures for the newly selected service center
   - Updates service center information display
   - Shows current service center ID for debugging
   - Loads service center specific services

4. **Service Loading**: When a service center is selected:

   - Fetches all services for that specific service center
   - Displays service details in a comprehensive table
   - Shows service availability status
   - Provides search functionality across service names, categories, and descriptions

5. **Customer Availability Check**: For customer-facing features:
   - Converts dates to week numbers and day names
   - Checks if specific dates are closed
   - Returns availability status with reason if closed

## Backend API Integration

### Closure Schedule Endpoints

- **POST /api/ClosureSchedule** - Create closure schedule
- **GET /api/ClosureSchedule/{serviceCenterId}/{weekNumber}** - Get closures for service center and week
- **PUT /api/ClosureSchedule/{id}** - Update closure schedule
- **DELETE /api/ClosureSchedule/{id}** - Delete closure schedule

### Service Center Services Endpoints

- **GET /api/ServiceCenters/{id}/Services** - Get services for a service center
- **POST /api/ServiceCenters/{id}/Services** - Add service to service center
- **DELETE /api/ServiceCenters/{id}/Services/{serviceId}** - Remove service from service center

### Service Centers Endpoints

- **GET /api/ServiceCenters** - Get all service centers
- **GET /api/ServiceCenters/{id}** - Get specific service center

## Frontend API Functions

### Closure Schedule Functions

```typescript
// Add a new closure schedule
export const addClosureSchedule = async (data: CreateClosureScheduleDTO): Promise<ClosureSchedule>

// Get closures for a service center and week
export const getClosures = async (serviceCenterId: number, weekNumber: number): Promise<ClosureSchedule[]>

// Update closure schedule
export const updateClosureSchedule = async (id: number, data: UpdateClosureScheduleDTO): Promise<ClosureSchedule>

// Delete closure schedule
export const deleteClosureSchedule = async (id: number): Promise<void>
```

### Service Center Functions

```typescript
// Fetch all service centers
export const fetchServiceCenters = async (): Promise<ServiceCenter[]>

// Fetch services for a specific service center
export const fetchServiceCenterServices = async (stationId: string): Promise<ServiceCenterServiceDTO[]>
```

### Customer-Facing Functions

```typescript
// Check if a service center is available on a specific date
export const checkServiceCenterAvailability = async (serviceCenterId: number, date: string): Promise<{ isAvailable: boolean; reason?: string }>

// Get closures for multiple weeks
export const getServiceCenterClosures = async (serviceCenterId: number, startWeek: number, endWeek: number): Promise<ClosureSchedule[]>
```

## Data Transformation

### Backend to Frontend

```typescript
// Service Center transformation
const transformedServiceCenter = {
  id: sc.station_id?.toString() || "",
  Station_id: sc.station_id,
  serviceCenterName: sc.station_name || "",
  // ... other fields
};

// Service Center Service transformation
const transformedService = {
  serviceCenterServiceId: service.serviceCenterServiceId,
  serviceName: service.serviceName,
  customPrice: service.customPrice,
  category: service.category,
  isAvailable: service.isAvailable,
  // ... other fields
};
```

### Frontend to Backend

```typescript
// Closure schedule creation
const closureData = {
  serviceCenterId: currentServiceCenterId,
  weekNumber: weekNumber,
  day: day,
};
```

## UI Components

### Enhanced ScheduleShopClosures

- **Props**: `onSave`, `allWeeks` (optional)
- **Features**:
  - Dynamic week selection from all 52 weeks
  - Day picker for selecting closure days
  - Save functionality with validation

### Enhanced Closure Schedule Table

- **Props**: `data` (with service details)
- **Features**:
  - Service name and description
  - Category and price display
  - Availability status with color coding
  - Search functionality across all fields
  - Pagination support

### Service Center Info Card

- **Features**:
  - Service center details (name, address, contact)
  - Service center ID for debugging
  - Status indicator
  - Available services count

## Error Handling

### Service Center Errors

- **No Service Centers**: Red error state with helpful message
- **No Service Center Selected**: Yellow warning state
- **Loading State**: Proper loading spinner
- **API Failures**: Graceful fallback with error logging

### Service Loading Errors

- **No Services**: Empty state with helpful message
- **API Failures**: Empty array fallback with error logging
- **Loading State**: Loading indicator during fetch

### Closure Errors

- **Validation**: Prevents saving without service center selection
- **API Failures**: Continues with other days if one fails
- **User Feedback**: Clear error messages for each failure

## Configuration

### Authentication

- Uses bearer token authentication
- Token retrieved from localStorage
- Automatic token refresh handling

### API Base URL

- Configured in axios instance
- Environment-specific endpoints
- Error handling for network issues

## Testing

### Manual Testing

1. **Service Center Selection**: Test switching between service centers
2. **Week Selection**: Test selecting different weeks from all 52 weeks
3. **Closure Scheduling**: Test adding closures for different weeks
4. **Service Loading**: Test service display for different service centers
5. **Error States**: Test various error conditions

### API Testing

1. **Closure Endpoints**: Test all CRUD operations
2. **Service Endpoints**: Test service center service loading
3. **Error Handling**: Test API failure scenarios
4. **Authentication**: Test token validation

## Next Steps

### Immediate

- [x] Connect frontend with backend API
- [x] Implement dynamic service center selection
- [x] Add all weeks selection
- [x] Display service center specific services
- [x] Enhance error handling and user feedback

### Future Enhancements

- [ ] Add bulk closure scheduling
- [ ] Implement closure templates
- [ ] Add closure history and analytics
- [ ] Enhance customer notification system
- [ ] Add closure approval workflow

## Authorization

### Role-Based Access

- **Super Admin**: Can manage closures for all service centers
- **Service Center Admin**: Can manage closures for their assigned service center
- **Other Roles**: Read-only access to closure information

### Permission Checks

- Service center access validation
- Closure modification permissions
- Service management permissions

## Performance Considerations

### Data Loading

- Lazy loading of service center services
- Efficient closure data fetching
- Optimized week generation
- Minimal API calls

### UI Performance

- Efficient re-rendering
- Optimized search functionality
- Smooth pagination
- Responsive design

## Security

### Data Validation

- Input sanitization for closure data
- Service center ID validation
- Week number range validation
- Day name validation

### Access Control

- Service center access validation
- Role-based permissions
- API endpoint protection
- Token validation

## Business Value

### For Service Centers

- **Efficient Management**: Easy closure scheduling for any week
- **Customer Communication**: Clear availability information
- **Reduced Conflicts**: Fewer booking conflicts
- **Professional Image**: Organized and reliable service

### For Customers

- **Clear Expectations**: Know when service centers are closed
- **Better Planning**: Can plan appointments around closures
- **Reduced Frustration**: No unexpected booking rejections
- **Improved Experience**: Professional and organized service

### For the Platform

- **Better Coordination**: Centralized closure management
- **Data Insights**: Closure patterns and analytics
- **Customer Satisfaction**: Improved overall experience
- **Operational Efficiency**: Streamlined booking process
