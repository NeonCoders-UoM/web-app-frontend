# Sample Feedback Data for Testing

## Prerequisites
Before adding feedback data, make sure you have the following data in your database:

### 1. Customers Table
```json
[
  {
    "customerId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@email.com",
    "phoneNumber": "1234567890"
  },
  {
    "customerId": 2,
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@email.com",
    "phoneNumber": "0987654321"
  },
  {
    "customerId": 3,
    "firstName": "Mike",
    "lastName": "Johnson",
    "email": "mike.johnson@email.com",
    "phoneNumber": "5555551234"
  },
  {
    "customerId": 4,
    "firstName": "Emily",
    "lastName": "Davis",
    "email": "emily.davis@email.com",
    "phoneNumber": "7777778888"
  },
  {
    "customerId": 5,
    "firstName": "Daniel",
    "lastName": "Wilson",
    "email": "daniel.wilson@email.com",
    "phoneNumber": "3333334444"
  }
]
```

### 2. Service Centers Table
```json
[
  {
    "serviceCenterId": 1,
    "station_name": "Speed Motors",
    "email": "contact@speedmotors.com",
    "telephone": "0112345678",
    "address": "123 Main Street, Colombo 01"
  },
  {
    "serviceCenterId": 2,
    "station_name": "Rapid Repairs",
    "email": "info@rapidrepairs.com",
    "telephone": "0119876543",
    "address": "456 Galle Road, Colombo 03"
  },
  {
    "serviceCenterId": 3,
    "station_name": "AutoSure Solutions",
    "email": "support@autosure.com",
    "telephone": "0115555666",
    "address": "789 Kandy Road, Colombo 07"
  },
  {
    "serviceCenterId": 4,
    "station_name": "MotorMedic Garage",
    "email": "hello@motormedic.com",
    "telephone": "0113333444",
    "address": "321 High Level Road, Colombo 06"
  }
]
```

### 3. Vehicles Table
```json
[
  {
    "vehicleId": 1,
    "customerId": 1,
    "registrationNumber": "ABC-1234",
    "make": "Toyota",
    "model": "Corolla",
    "year": 2020
  },
  {
    "vehicleId": 2,
    "customerId": 2,
    "registrationNumber": "XYZ-5678",
    "make": "Honda",
    "model": "Civic",
    "year": 2019
  },
  {
    "vehicleId": 3,
    "customerId": 3,
    "registrationNumber": "DEF-9012",
    "make": "Nissan",
    "model": "Sentra",
    "year": 2021
  },
  {
    "vehicleId": 4,
    "customerId": 4,
    "registrationNumber": "GHI-3456",
    "make": "Mazda",
    "model": "CX-5",
    "year": 2022
  },
  {
    "vehicleId": 5,
    "customerId": 5,
    "registrationNumber": "JKL-7890",
    "make": "Hyundai",
    "model": "Elantra",
    "year": 2023
  }
]
```

## Sample Feedback Data

Use the following JSON objects to create feedback entries via Swagger API:

### Feedback Entry 1
```json
{
  "customerId": 1,
  "serviceCenterId": 1,
  "vehicleId": 1,
  "rating": 5,
  "comments": "Excellent service! The staff was very professional and the work was completed on time. Highly recommended!",
  "serviceDate": "2025-07-15T10:30:00Z"
}
```

### Feedback Entry 2
```json
{
  "customerId": 2,
  "serviceCenterId": 2,
  "vehicleId": 2,
  "rating": 5,
  "comments": "Amazing staff and thorough work! Very satisfied with the brake service.",
  "serviceDate": "2025-07-16T14:00:00Z"
}
```

### Feedback Entry 3
```json
{
  "customerId": 3,
  "serviceCenterId": 3,
  "vehicleId": 3,
  "rating": 3,
  "comments": "Average experience. The service was okay but staff could be more friendly. Price was reasonable though.",
  "serviceDate": "2025-07-17T09:15:00Z"
}
```

### Feedback Entry 4
```json
{
  "customerId": 4,
  "serviceCenterId": 1,
  "vehicleId": 4,
  "rating": 4,
  "comments": "Good service overall. Quick oil change and engine tune-up. Only minor issue was the waiting time.",
  "serviceDate": "2025-07-18T11:45:00Z"
}
```

### Feedback Entry 5
```json
{
  "customerId": 5,
  "serviceCenterId": 1,
  "vehicleId": 5,
  "rating": 4,
  "comments": "Great service, but prices are slightly high compared to other places. Quality work though.",
  "serviceDate": "2025-07-19T16:30:00Z"
}
```

### Feedback Entry 6
```json
{
  "customerId": 1,
  "serviceCenterId": 4,
  "vehicleId": 1,
  "rating": 5,
  "comments": "Excellent for hybrid cars! The technicians really know what they're doing. Fully satisfied with the battery check and maintenance.",
  "serviceDate": "2025-07-20T13:20:00Z"
}
```

### Feedback Entry 7
```json
{
  "customerId": 2,
  "serviceCenterId": 3,
  "vehicleId": 2,
  "rating": 2,
  "comments": "Poor service experience. Had to wait for 3 hours and the air conditioning issue wasn't properly fixed. Not recommended.",
  "serviceDate": "2025-07-12T08:30:00Z"
}
```

### Feedback Entry 8
```json
{
  "customerId": 3,
  "serviceCenterId": 2,
  "vehicleId": 3,
  "rating": 4,
  "comments": "Good tire replacement service. Professional staff and clean facility. Will come back for future services.",
  "serviceDate": "2025-07-14T12:00:00Z"
}
```

### Feedback Entry 9
```json
{
  "customerId": 4,
  "serviceCenterId": 4,
  "vehicleId": 4,
  "rating": 5,
  "comments": "Outstanding service! Engine diagnostics were very thorough and they explained everything clearly. Great value for money.",
  "serviceDate": "2025-07-13T15:45:00Z"
}
```

### Feedback Entry 10
```json
{
  "customerId": 5,
  "serviceCenterId": 2,
  "vehicleId": 5,
  "rating": 1,
  "comments": "Very disappointing experience. Service took much longer than promised and the issue wasn't resolved properly. Had to go elsewhere to fix it.",
  "serviceDate": "2025-07-11T10:00:00Z"
}
```

## How to Add Data via Swagger

1. **Start your backend API** (make sure it's running on the configured port)

2. **Open Swagger UI** in your browser:
   ```
   http://localhost:5039/swagger
   ```

3. **Find the Feedback Controller** and locate the `POST /api/Feedback` endpoint

4. **Click "Try it out"** button

5. **Copy and paste each JSON object** from above into the request body

6. **Execute the request** for each feedback entry

7. **Verify the data** by using the `GET /api/Feedback` endpoint to see all feedbacks

## Expected Results

After adding this sample data, you should see:

### Rating Distribution:
- 5 stars: 4 feedbacks
- 4 stars: 3 feedbacks  
- 3 stars: 1 feedback
- 2 stars: 1 feedback
- 1 star: 1 feedback

### Average Rating: 3.7 stars

### Service Centers with Feedback:
- Speed Motors: 3 feedbacks
- Rapid Repairs: 3 feedbacks
- AutoSure Solutions: 2 feedbacks
- MotorMedic Garage: 2 feedbacks

This sample data will give you a good variety of ratings and comments to test your feedback frontend interface!

## Testing the Frontend

After adding this data:

1. Open your admin frontend feedback page
2. You should see all 10 feedback entries in the table
3. The review summary card should show the calculated average rating and distribution
4. You can test the refresh functionality
5. Verify that customer names, service centers, and dates display correctly

## Notes

- Make sure your database auto-incrementing IDs match the sample data
- Adjust the `customerId`, `serviceCenterId`, and `vehicleId` values if your database has different IDs
- The `serviceDate` should be in the past to represent completed services
- The `feedbackDate` will be automatically set by your backend when creating the feedback
