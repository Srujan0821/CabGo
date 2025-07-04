# API Documentation: Ride Endpoints

## Book a Ride
**Endpoint:**  
`POST http://localhost:8080/api/rides/book`  

**Content-Type:**  
`application/json`  

**Headers:**  
`Authorization: Bearer <user-token>`  

**Request Body:**  
```json
{
  "pickupLocation": "123 Main Street",
  "dropoffLocation": "456 Elm Street"
}
```

**Response:**  
- **Status Code:** `200`  
- **Example Response Body:**  
  ```json
  
  "rideId": 6,
  "userId": 2,
  "driverId": 1,
  "pickupLocation": "Cognizant CDC",
  "dropoffLocation": "Tiptop",
  "fare": 193.96084927997458,
  "status": "REQUESTED"


  
## Update Ride Status
**Endpoint:**  
`PUT http://localhost:8080/api/rides/status`  

**Query Parameters:**  
- `status`: `REQUESTED`, `ASSIGNED`, `ONGOING`, `COMPLETED`, `CANCELLED`, `IN_PROGRESS`

**Headers:**  
`Authorization: Bearer <driver-token>`  

**Response:**  
- **Status Code:** `200`  
- **Body:**  
  ```json
  {
    "success": true,
  "message": "Ride status updated successfully",
  "data": null
  }
  ```

---

## Get User Rides
**Endpoint:**  
`GET http://localhost:8080/api/rides/user/rides`  

**Headers:**  
`Authorization: Bearer <user-token>`  

**Response:**  
- **Status Code:** `200`  
- **Example Response Body:**  
  ```json
  
  {
    
    "rideId": 6,
    "userId": 2,
    "driverId": 1,
    "pickupLocation": "Cognizant CDC",
    "dropoffLocation": "Tiptop",
    "fare": 193.96084927997458,
    "status": "COMPLETED"
  }

  ```