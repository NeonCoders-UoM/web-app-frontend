# Frontend-Backend Integration Setup Guide

## ✅ Changes Made to Frontend

### 1. Updated Client Interface

- Modified `Client` interface in `types/index.ts` to match backend API structure
- Added support for `firstName`, `lastName`, `customerId`, `phoneNumber`, etc.
- Maintained backward compatibility with legacy fields (`client`, `phoneno`, etc.)

### 2. Updated API Functions

- Modified `fetchClients()` to call `/api/Customers` endpoint with fallback data
- Modified `fetchClientById()` to call `/api/Customers/{id}` endpoint with fallback data
- Added `updateCustomer()`, `createCustomer()`, and `deleteCustomer()` functions
- Added proper TypeScript interfaces for backend responses
- Added graceful fallback to mock data when backend is unavailable

### 3. Updated Customer Update Form

- Modified form to handle `firstName` and `lastName` separately
- Users can now edit first and last names in separate fields
- Form submission combines names and calls backend API
- Added proper error handling and loading states

### 4. Updated Client Edit Page

- Integrated with real backend API calls instead of mock data
- Added proper data transformation between frontend and backend formats
- Enhanced error handling and loading states
- Maintains existing UI/UX while connecting to real data

### 5. Removed TypeScript Errors

- Removed unused `mockClients` array that was causing TypeScript conflicts
- Fixed type compatibility issues between old and new Client interface
- Added fallback data for development/testing purposes
- Updated all related functions to handle optional properties correctly

## 🔧 Backend Requirements

### 1. Add Missing Controller Methods

Your `CustomersController` needs these additional methods:

- `PUT /api/Customers/{id}` - Update customer
- `POST /api/Customers` - Create customer
- `DELETE /api/Customers/{id}` - Delete customer

See `BACKEND_ADDITIONS.md` for the complete code.

### 2. Add DTO Classes

Create these DTO classes in your DTOs folder:

- `CustomerUpdateDto`
- `CustomerCreateDto`

### 3. CORS Configuration

Make sure your backend allows requests from your frontend URL:

```csharp
// In Program.cs or Startup.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000") // Your frontend URL
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

// Use the policy
app.UseCors("AllowFrontend");
```

## 🚀 Setup Instructions

### 1. Environment Configuration

1. Copy `.env.example` to `.env.local`
2. Update `NEXT_PUBLIC_API_URL` to match your backend URL:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5039/api
   ```

### 2. Backend Setup

1. Add the missing controller methods from `BACKEND_ADDITIONS.md`
2. Add the DTO classes
3. Configure CORS for frontend requests
4. Ensure authentication is properly configured
5. Test your endpoints using a tool like Postman

### 3. Testing the Integration

#### Option A: With Backend Running

1. Start your .NET backend server
2. Start the frontend: `npm run dev`
3. Navigate to http://localhost:3000/client
4. You should see real customer data from your backend

#### Option B: Without Backend (Fallback Mode)

1. Start only the frontend: `npm run dev`
2. Navigate to http://localhost:3000/client
3. You'll see fallback demo data and can test the UI
4. Check browser console for "using fallback data" messages

### 4. Verification Steps

- ✅ Clients page loads and displays customer data
- ✅ Individual client edit page loads with proper data
- ✅ Form allows editing of first/last names separately
- ✅ Form submission works (check browser dev tools Network tab)
- ✅ Navigation between pages works correctly
- ✅ Error handling works when backend is unavailable

## 📡 API Endpoints Used

- `GET /api/Customers` - List all customers ✅ (exists in your backend)
- `GET /api/Customers/{id}` - Get customer by ID ✅ (exists in your backend)
- `PUT /api/Customers/{id}` - Update customer ❌ (needs to be added)
- `POST /api/Customers` - Create customer ❌ (needs to be added)
- `DELETE /api/Customers/{id}` - Delete customer ❌ (needs to be added)

## 🔐 Authentication

The frontend automatically includes JWT tokens in requests via the Axios interceptor.
Make sure your backend validates these tokens properly for the Customer endpoints.

## 🔄 Data Flow

1. **Loading Data**: Frontend → `GET /api/Customers` → Backend returns customers with `firstName`, `lastName`
2. **Display**: Frontend transforms data (combines names, converts IDs) for table display
3. **Editing**: Frontend splits combined name back to `firstName`/`lastName` for form fields
4. **Saving**: Frontend → `PUT /api/Customers/{id}` → Backend receives structured data
5. **Fallback**: If backend unavailable, frontend uses static demo data

## 🛠️ Development Features

- **Graceful Degradation**: Works with or without backend
- **Type Safety**: Full TypeScript support with proper interfaces
- **Error Handling**: Comprehensive error handling and user feedback
- **Backward Compatibility**: Existing components continue to work
- **Developer Experience**: Clear console logging for debugging

## 🎯 Next Steps

1. Add the missing backend endpoints
2. Test the full integration
3. Optionally add customer creation and deletion UI
4. Implement customer vehicle management integration
5. Add real-time updates or caching as needed
