# API Documentation: Payment Endpoints

## Process Payment

### Endpoint
`POST http://localhost:8080/api/payments/process`

### Headers
- `Authorization: Bearer <user-token>`  
- `Content-Type: application/json`

### Request Body
```json
{
  "amount": 228.0,
  "method": "CARD"
}
```

### Response
**Status Code:** 200  
**Example Response Body:**
```json

  "paymentId": 4,
  "rideId": 6,
  "userId": 2,
  "amount": 189.0,
  "method": "CARD",
  "status": "SUCCESS",
  "timestamp": "2025-07-04T10:41:40.939680100"

```

---

## Get Receipt

### Endpoint
`GET http://localhost:8080/api/payments/receipt/`

### Headers
- `Authorization: Bearer <user-token>`

### Path Parameter
- `rideId`: The ID of the ride for which the receipt is requested.

### Response
**Status Code:** 200  
**Example Response Body:**
```json
"paymentId": 4,
  "rideId": 6,
  "userId": 2,
  "amount": 189.0,
  "method": "CARD",
  "status": "SUCCESS",
  "timestamp": "2025-07-04T10:41:40.939680100"

````