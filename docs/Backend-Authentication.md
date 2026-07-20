# Backend Authentication Implementation Guide

## Overview

This guide covers the complete authentication implementation for the Royal Transportation System backend using Firebase Auth and JWT tokens.

## Files Created/Updated

### 1. **authService.js** - Business Logic Layer
Location: `backend/src/services/authService.js`

Handles:
- User registration with Firebase Auth
- User login and JWT token generation
- OTP verification
- User retrieval and updates
- Token generation with role-based claims

**Key Methods:**
```javascript
- generateToken(user) // Create JWT token
- registerUser(userData) // Register new user
- loginUser(email, password) // Authenticate user
- getUserById(userId) // Fetch user data
- updateUser(userId, updateData) // Update user profile
- verifyOTP(phone, otp) // Verify phone OTP
```

### 2. **authController.js** - API Controller Layer
Location: `backend/src/controllers/authController.js`

Handles HTTP requests:
- POST `/register` - User registration
- POST `/login` - User login
- POST `/verify-otp` - OTP verification
- POST `/refresh-token` - Token refresh (protected)
- POST `/logout` - User logout (protected)

### 3. **validators.js** - Input Validation Middleware
Location: `backend/src/middleware/validators.js`

Validates:
- Email format
- Password strength (8+ chars, uppercase, lowercase, number, special char)
- Phone number format
- Names (2-50 characters)
- User role (parent/driver/student/admin)
- OTP format (6 digits)

### 4. **auth.js** - Authentication Middleware
Location: `backend/src/middleware/auth.js`

Middlewares:
- `authMiddleware` - Verify JWT token
- `roleMiddleware` - Check user role permissions

### 5. **auth.js** - Routes
Location: `backend/src/routes/auth.js`

Updated with all endpoints and validation

## API Endpoints

### 1. Register User
```
POST /api/v1/auth/register

Request Body:
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890",
  "firstName": "John",
  "lastName": "Doe",
  "role": "parent"
}

Response (201):
{
  "success": true,
  "data": {
    "userId": "firebase_uid",
    "email": "user@example.com",
    "role": "parent",
    "createdAt": "2026-07-20T10:00:00Z"
  },
  "message": "User registered successfully"
}
```

### 2. Login User
```
POST /api/v1/auth/login

Request Body:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response (200):
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": "firebase_uid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "parent",
      "profileImage": null
    }
  },
  "message": "Login successful"
}
```

### 3. Verify OTP
```
POST /api/v1/auth/verify-otp

Request Body:
{
  "phone": "+1234567890",
  "otp": "123456"
}

Response (200):
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {...}
  },
  "message": "OTP verified successfully"
}
```

### 4. Refresh Token
```
POST /api/v1/auth/refresh-token

Headers:
Authorization: Bearer <existing_token>

Response (200):
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Token refreshed successfully"
}
```

### 5. Logout
```
POST /api/v1/auth/logout

Headers:
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install jsonwebtoken bcryptjs express-validator
```

### 2. Update Environment Variables
Add to `backend/.env`:
```env
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRY=7d
FIREBASE_CREDENTIALS={...}
FIREBASE_PROJECT_ID=royal-transportation
```

### 3. Test Authentication

**Start the server:**
```bash
npm run dev
```

**Test with curl or Postman:**

```bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "phone": "+1234567890",
    "firstName": "John",
    "lastName": "Doe",
    "role": "parent"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

## Security Features Implemented

✅ **Password Validation**
- Minimum 8 characters
- Requires uppercase letter
- Requires lowercase letter
- Requires number
- Requires special character

✅ **Email Validation**
- RFC-compliant email format
- Normalized (lowercased)

✅ **JWT Tokens**
- Signed with secret key
- Include user role for authorization
- 7-day expiration (configurable)
- Verified on protected routes

✅ **Firebase Auth**
- Secure password storage
- User account management
- Built-in security features

✅ **Role-Based Access Control**
- Parent, Driver, Student, Admin roles
- Permission checking middleware
- Role claims in JWT

## Error Handling

All errors return consistent JSON format:

```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human readable message"
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Invalid input data
- `REGISTRATION_ERROR` - Registration failed
- `LOGIN_ERROR` - Login failed
- `UNAUTHORIZED` - Missing/invalid token
- `FORBIDDEN` - Insufficient permissions
- `TOKEN_REFRESH_ERROR` - Token refresh failed

## Logging

All authentication events are logged:
- User registration
- User login
- OTP verification
- Token refresh
- Logout
- Errors

Logs are stored in:
- `backend/error.log` - Error level logs
- `backend/combined.log` - All logs

## Next Steps

1. ✅ Backend authentication complete
2. Next: Mobile app authentication integration
3. Then: GPS tracking implementation
4. Then: Push notifications

---

**Status**: ✅ Backend Authentication Implementation Complete
**Last Updated**: July 2026
