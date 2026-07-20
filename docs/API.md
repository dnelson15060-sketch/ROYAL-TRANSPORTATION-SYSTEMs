# API Documentation - Royal Transportation System

## Overview

The Royal Transportation System API is a RESTful service built with Node.js and Express. It provides endpoints for authentication, user management, GPS tracking, routing, payments, messaging, and reporting.

**Base URL**: `https://api.royaltransportation.com/v1`

**Authentication**: JWT Bearer tokens in Authorization header

```
Authorization: Bearer <jwt_token>
```

## Response Format

All responses follow a standard format:

```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

Error responses:

```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Error description"
}
```

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Register a new user account.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "phone": "+1234567890",
  "firstName": "John",
  "lastName": "Doe",
  "role": "parent"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "userId": "user_123",
    "email": "user@example.com",
    "role": "parent",
    "createdAt": "2026-07-20T10:00:00Z"
  }
}
```

### Login

**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "refresh_token_xyz",
    "user": {
      "userId": "user_123",
      "email": "user@example.com",
      "role": "parent",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

### Verify OTP

**POST** `/auth/verify-otp`

Verify phone OTP for two-factor authentication.

**Request**:
```json
{
  "phone": "+1234567890",
  "otp": "123456"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {...}
  }
}
```

### Refresh Token

**POST** `/auth/refresh-token`

Get a new JWT token using refresh token.

**Request**:
```json
{
  "refreshToken": "refresh_token_xyz"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

## User Endpoints

### Get User Profile

**GET** `/users/profile`

Retrieve current user profile information.

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "userId": "user_123",
    "email": "user@example.com",
    "phone": "+1234567890",
    "firstName": "John",
    "lastName": "Doe",
    "role": "parent",
    "profileImage": "https://storage.firebase.com/...",
    "emergencyContacts": [
      {
        "name": "Jane Doe",
        "phone": "+0987654321",
        "relationship": "spouse"
      }
    ],
    "createdAt": "2026-07-20T10:00:00Z",
    "updatedAt": "2026-07-20T10:00:00Z"
  }
}
```

### Update User Profile

**PUT** `/users/profile`

Update user profile information.

**Request**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "emergencyContacts": [...]
}
```

**Response** (200): Updated user object

### Get User Children

**GET** `/users/children`

Get list of children associated with parent account.

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "studentId": "student_123",
      "name": "Jane Doe",
      "age": 10,
      "school": "Central High School",
      "assignedRoute": "route_456"
    }
  ]
}
```

## Driver Endpoints

### Get Driver Routes

**GET** `/drivers/routes`

Get assigned routes for driver.

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "routeId": "route_123",
      "name": "Downtown Route A",
      "status": "active",
      "stops": 15,
      "students": 25,
      "estimatedTime": 45,
      "startTime": "07:00",
      "endTime": "08:00"
    }
  ]
}
```

### Post GPS Location

**POST** `/gps/track`

Submit current GPS location (called every 30 seconds from driver app).

**Request**:
```json
{
  "routeId": "route_123",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "accuracy": 25,
  "speed": 45,
  "timestamp": "2026-07-20T10:30:00Z"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Location recorded"
}
```

### Get GPS History

**GET** `/gps/history/:driverId?startDate=2026-07-20&endDate=2026-07-21`

Get GPS location history for a driver.

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "accuracy": 25,
      "speed": 45,
      "timestamp": "2026-07-20T10:30:00Z"
    }
  ]
}
```

### Mark Attendance

**POST** `/drivers/attendance`

Mark students as present or absent.

**Request**:
```json
{
  "routeId": "route_123",
  "attendance": [
    {
      "studentId": "student_123",
      "status": "present",
      "timestamp": "2026-07-20T07:15:00Z"
    },
    {
      "studentId": "student_124",
      "status": "absent",
      "reason": "Sick"
    }
  ]
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Attendance recorded"
}
```

## Route Endpoints

### Get Routes List

**GET** `/routes?limit=10&offset=0`

Get paginated list of routes.

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "routeId": "route_123",
      "name": "Downtown Route A",
      "driver": "driver_456",
      "students": 25,
      "estimatedTime": 45,
      "stops": [
        {
          "stopId": "stop_1",
          "name": "Central Station",
          "latitude": 40.7128,
          "longitude": -74.0060,
          "sequence": 1,
          "estimatedArrival": "07:00"
        }
      ]
    }
  ],
  "total": 50,
  "limit": 10,
  "offset": 0
}
```

### Create Route

**POST** `/routes`

Create a new transportation route.

**Request**:
```json
{
  "name": "Downtown Route A",
  "driverId": "driver_456",
  "startTime": "07:00",
  "endTime": "08:00",
  "stops": [
    {
      "name": "Central Station",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "sequence": 1
    }
  ],
  "students": ["student_123", "student_124"]
}
```

**Response** (201): Created route object

## Payment Endpoints

### Process Payment

**POST** `/payments/process`

Process a payment transaction.

**Request**:
```json
{
  "userId": "user_123",
  "amount": 150.00,
  "currency": "USD",
  "method": "card",
  "token": "stripe_token_xyz"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "transactionId": "txn_123456",
    "amount": 150.00,
    "status": "completed",
    "timestamp": "2026-07-20T10:00:00Z"
  }
}
```

### Get Payment History

**GET** `/payments/history?limit=10&offset=0`

Get user payment history.

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "transactionId": "txn_123456",
      "amount": 150.00,
      "status": "completed",
      "method": "card",
      "timestamp": "2026-07-20T10:00:00Z",
      "receipt": "https://storage.firebase.com/..."
    }
  ]
}
```

## Notification Endpoints

### Send Notification

**POST** `/notifications/send`

Send push notification to users.

**Request**:
```json
{
  "recipients": ["user_123", "user_124"],
  "title": "Bus Arriving Soon",
  "message": "Route A bus is 5 minutes away",
  "type": "info",
  "actionUrl": "app://route/route_123"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Notification sent to 2 recipients"
}
```

### Get Notification History

**GET** `/notifications/history?limit=20&offset=0`

Get notification history for current user.

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "notificationId": "notif_123",
      "title": "Bus Arriving Soon",
      "message": "Route A bus is 5 minutes away",
      "type": "info",
      "read": true,
      "timestamp": "2026-07-20T10:00:00Z"
    }
  ]
}
```

## Report Endpoints

### Daily Report

**GET** `/reports/daily?date=2026-07-20`

Get daily operations report.

**Response** (200):
```json
{
  "success": true,
  "data": {
    "date": "2026-07-20",
    "totalRoutes": 10,
    "activeRoutes": 8,
    "totalStudents": 200,
    "presentStudents": 195,
    "delayedRoutes": 2,
    "incidents": 0
  }
}
```

### Financial Report

**GET** `/reports/financial?startDate=2026-07-01&endDate=2026-07-31`

Get financial report for date range.

**Response** (200):
```json
{
  "success": true,
  "data": {
    "period": "2026-07-01 to 2026-07-31",
    "totalRevenue": 15000.00,
    "totalExpenses": 5000.00,
    "totalPayments": 14500.00,
    "outstandingBalance": 500.00
  }
}
```

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `INVALID_CREDENTIALS` | 401 | Invalid email or password |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

## Rate Limiting

The API implements rate limiting:
- **Public endpoints**: 100 requests per minute
- **Authenticated endpoints**: 1000 requests per minute
- **GPS tracking**: 1 request per 30 seconds per driver

## Pagination

Endpoints that return lists support pagination:

```
?limit=10&offset=0
```

- `limit`: Number of results (default: 10, max: 100)
- `offset`: Starting position (default: 0)

---

**Last Updated**: July 2026
**Version**: 1.0
