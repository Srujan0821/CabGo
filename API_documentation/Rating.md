# Rating API Documentation

## POST /api/ratings

### Description
Submit a rating for a completed ride.

### Request
**URL:** `http://localhost:8080/api/ratings`  
**Method:** POST  
**Headers:**  
`Authorization: Bearer <user-token>`  

**Body:**
```json
{

  "score": 5,
  "comments": "Great ride! Very professional driver."
}

```

### Response
**Status Code:** 200 OK  
**Body:**
```json
{
  "ratingId": 3,
  "rideId": 6,
  "fromUserId": 2,
  "toUserId": 1,
  "score": 5,
  "comments": "Great ride! Very professional driver."
}
```

---

## GET /api/ratings/driver/ratings

### Description
Retrieve all ratings received by a driver.

### Request
**URL:** `http://localhost:8080/api/ratings/driver/ratings`  
**Method:** GET  
**Headers:**  
`Authorization: Bearer <driver-token>`  

### Response
**Status Code:** 200 OK  
**Body:**
```json
[
  {
    "ratingId": 1,
    "rideId": 1,
    "fromUserId": 1,
    "toUserId": 1,
    "score": 5,
    "comments": "Great ride! Very professional driver."
  },
  {
    "ratingId": 2,
    "rideId": 5,
    "fromUserId": 1,
    "toUserId": 1,
    "score": 5,
    "comments": "Great ride! Very professional driver."
  },
  {
    "ratingId": 3,
    "rideId": 6,
    "fromUserId": 2,
    "toUserId": 1,
    "score": 5,
    "comments": "Great ride! Very professional driver."
  }
]

```