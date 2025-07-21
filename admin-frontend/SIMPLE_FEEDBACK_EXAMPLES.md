# 4 Simple Feedback Examples for Swagger Testing

## How to Use These Examples

1. **Start your backend API** (make sure it's running on port 5039)
2. **Open Swagger UI** in your browser: `http://localhost:5039/swagger`
3. **Find the Feedback Controller** → `POST /api/Feedback` endpoint
4. **Click "Try it out"**
5. **Copy and paste each example** below into the request body
6. **Click "Execute"** for each one

---

## Example 1: Excellent Service (5 Stars)
```json
{
  "customerId": 1,
  "serviceCenterId": 1,
  "vehicleId": 1,
  "rating": 5,
  "comments": "Excellent service! Very professional staff and quick repair.",
  "serviceDate": "2025-07-20T10:00:00Z"
}
```

---

## Example 2: Good Service (4 Stars)
```json
{
  "customerId": 2,
  "serviceCenterId": 2,
  "vehicleId": 2,
  "rating": 4,
  "comments": "Good service overall. Only minor delay but quality work.",
  "serviceDate": "2025-07-19T14:30:00Z"
}
```

---

## Example 3: Average Service (3 Stars)
```json
{
  "customerId": 3,
  "serviceCenterId": 1,
  "vehicleId": 3,
  "rating": 3,
  "comments": "Average experience. Service was okay but could be better.",
  "serviceDate": "2025-07-18T09:15:00Z"
}
```

---

## Example 4: Poor Service (2 Stars)
```json
{
  "customerId": 4,
  "serviceCenterId": 3,
  "vehicleId": 4,
  "rating": 2,
  "comments": "Poor service. Had to wait too long and issue not properly fixed.",
  "serviceDate": "2025-07-17T16:45:00Z"
}
```

---

## What You'll See After Adding These

### In Your Admin Frontend:
- **4 feedback entries** in the feedback table
- **Average rating**: 3.5 stars
- **Rating distribution**:
  - 5 stars: 1 feedback
  - 4 stars: 1 feedback  
  - 3 stars: 1 feedback
  - 2 stars: 1 feedback
  - 1 star: 0 feedbacks

### Expected Results:
- Customer names will show as the names from your database
- Service center names will display from your service centers table
- Dates will be formatted properly
- Comments will appear in the feedback table
- Star ratings will be displayed correctly

---

## Quick Test Steps:

1. **Add Example 1** → Execute → Should get `201 Created` response
2. **Add Example 2** → Execute → Should get `201 Created` response  
3. **Add Example 3** → Execute → Should get `201 Created` response
4. **Add Example 4** → Execute → Should get `201 Created` response
5. **Open your admin frontend** feedback page
6. **See the 4 feedback entries** displayed in the table
7. **Check the rating summary** shows correct average and counts

## Notes:
- Make sure you have customers, service centers, and vehicles with IDs 1-4 in your database
- If you get validation errors, check that these IDs exist in your database
- The `serviceDate` should be in the past to represent completed services
- The backend will automatically set the `feedbackDate` to the current timestamp
