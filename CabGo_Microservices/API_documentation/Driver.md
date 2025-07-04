# API Documentation: Driver Endpoints

## Driver Register
**Endpoint:**  
`POST http://localhost:8080/api/drivers/register`  

**Content-Type:**  
`application/json`  

**Request Body:**  
```json
{
  "name": "John Doe",
  "phone": "9876543210",
  "licenseNumber": "DL123456789",
  "vehicleDetails": "Toyota Prius, White, 2020",
  "password": "password123"
}
```

**Response:**  
- **Status Code:** `200`  
- **Message:** 
```json 
{
  "success": true,
  "message": "Driver registered successfully!",
  "data": null
}


  ```

---

## Driver Login
**Endpoint:**  
`POST http://localhost:8080/api/drivers/login`  

**Content-Type:**  
`application/json`  

**Request Body:**  
```json
{
  "phone": "9876543210",
  "password": "password123"
}
```

**Response:**  
- **Status Code:** `200`  

  ```json
  
  "success": true,
  "message": "Login successful",
  "data": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5ODU2NDM3ODMyIiwicm9sZSI6IkRSSVZFUiIsImlhdCI6MTc1MTYwNTg0MSwiZXhwIjoxNzUxNjkyMjQxfQ.ars19JnhO6UmLSFFjXLvGicNoqT9P44dwwkIUuec5n4"



## Update Driver Status
**Endpoint:**  
`PUT http://localhost:8080/api/drivers/status`  

**Query Parameters:**  
- `available`: `true` or `false`

**Headers:**  
`Authorization: Bearer <driver-token>`  

**Response:**  
- **Status Code:** `200`  
- **Body:**  
  ```json
  {
    
  "success": true,
  "message": "Driver status updated successfully",
  "data": null

    
  }
  ```

---

## Get Driver Profile
**Endpoint:**  
`GET http://localhost:8080/api/drivers/profile`  

**Headers:**  
`Authorization: Bearer <driver-token>`  

**Response:**  
- **Status Code:** `200`  
- **Example Response Body:**  
  ```json
  {
    "driverId": 2,
  "name": "ram",
  "phone": "9856437831",
  "licenseNumber": "DL1209776780",
  "vehicleDetails": "Tour H3, White, 2020",
  "passwordHash": "$2a$10$7cbZZLuFABkC7xONmxz9eesljn8SI6ody76orn7XF45KXVkZsLC7i",
  "available": false,
  "role": "DRIVER"
  }
  ```