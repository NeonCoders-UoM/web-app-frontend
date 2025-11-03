# Feedback Integration Guide

## Overview
The feedback page has been successfully connected to the backend API. This integration allows:

1. **Customers** can add feedback and ratings through the mobile app
2. **Admins** can view all feedback through the admin frontend

## What Was Implemented

### 1. API Functions (`src/utils/api.ts`)
- `getAllFeedbacks()` - Fetch all feedback with optional filters
- `getFeedbackById()` - Get specific feedback by ID
- `getCustomerFeedbacks()` - Get feedback for a specific customer
- `getServiceCenterFeedbacks()` - Get feedback for a specific service center
- `getFeedbackStats()` - Get rating statistics and summary
- `createFeedback()` - Create new feedback (for mobile app)
- `updateFeedback()` - Update existing feedback
- `deleteFeedback()` - Delete feedback (admin only)

### 2. TypeScript Types (`src/types/index.ts`)
- `FeedbackDTO` - Main feedback data structure
- `CreateFeedbackDTO` - For creating new feedback
- `UpdateFeedbackDTO` - For updating feedback
- `FeedbackStatsDTO` - For rating statistics
- `FeedbackFilters` - For filtering feedback queries

### 3. Updated Feedback Page (`src/app/(authorized)/feedback/page.tsx`)
- **Real-time data fetching** from backend API
- **Loading states** with user-friendly messages
- **Error handling** with retry functionality
- **Refresh button** to reload data
- **Automatic data transformation** to match existing UI components
- **Rating statistics** from real backend data

### 4. Environment Configuration (`.env.local`)
- Backend API URL configuration
- Easy to change for different environments

## API Endpoints Used

The frontend connects to these backend endpoints:

- `GET /api/Feedback` - Get all feedbacks (with optional filters)
- `GET /api/Feedback/{id}` - Get feedback by ID
- `GET /api/Feedback/Customer/{customerId}` - Get customer feedbacks
- `GET /api/Feedback/ServiceCenter/{serviceCenterId}` - Get service center feedbacks
- `GET /api/Feedback/Stats` - Get feedback statistics
- `POST /api/Feedback` - Create new feedback
- `PUT /api/Feedback/{id}` - Update feedback
- `DELETE /api/Feedback/{id}` - Delete feedback

## Features

### For Admins (Frontend)
✅ View all customer feedback in a table format  
✅ See rating statistics and averages  
✅ Real-time data refresh  
✅ Error handling and retry mechanisms  
✅ Loading states  

### For Customers (Mobile App)
✅ Submit feedback with ratings (1-5 stars)  
✅ Add comments about service experience  
✅ Link feedback to specific service centers and vehicles  

## Configuration

### Backend URL
Update the API URL in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5039/api
```

### Authentication
The API calls include automatic authentication token handling through the axios interceptor.

## Data Flow

1. **Customer Experience (Mobile App)**:
   - Customer receives service at a service center
   - Customer submits feedback through mobile app
   - Feedback is stored in backend database

2. **Admin Experience (Web Frontend)**:
   - Admin opens feedback page
   - Frontend fetches feedback data from backend API
   - Data is displayed in user-friendly table format
   - Rating statistics are shown in summary card

## Error Handling

- **Network errors**: Automatic retry functionality
- **Authentication errors**: Redirect to login page
- **Loading states**: User-friendly loading messages
- **Empty data**: Graceful handling of no feedback scenarios

## Future Enhancements

1. **Filtering**: Add filters by date range, rating, service center
2. **Pagination**: Handle large datasets with pagination
3. **Export**: Export feedback data to CSV/Excel
4. **Real-time updates**: WebSocket integration for live updates
5. **Feedback responses**: Allow admins to respond to feedback
