# Database Schema - Royal Transportation System

## Overview

Royal Transportation System uses Firebase Firestore as the primary database. Firestore is a NoSQL, serverless database that scales automatically and provides real-time capabilities.

## Collections Structure

### 1. Users Collection

**Path**: `/users/{userId}`

Stores user account information for parents, drivers, and admins.

```json
{
  "userId": "user_123",
  "email": "user@example.com",
  "phone": "+1234567890",
  "firstName": "John",
  "lastName": "Doe",
  "role": "parent",
  "profileImage": "https://storage.firebase.com/.../profile.jpg",
  "emergencyContacts": [
    {
      "name": "Jane Doe",
      "phone": "+0987654321",
      "relationship": "spouse"
    }
  ],
  "createdAt": "2026-07-20T10:00:00Z",
  "updatedAt": "2026-07-20T10:00:00Z",
  "lastLogin": "2026-07-20T14:30:00Z",
  "isActive": true
}
```

**Indexes**:
- `email` (ascending)
- `phone` (ascending)
- `role` (ascending)

### 2. Drivers Collection

**Path**: `/drivers/{driverId}`

Stores driver-specific information.

```json
{
  "driverId": "driver_123",
  "userId": "user_123",
  "licenseNumber": "DL123456789",
  "licenseExpiry": "2028-12-31",
  "licenseImage": "https://storage.firebase.com/.../license.jpg",
  "backgroundCheckPassed": true,
  "backgroundCheckDate": "2026-01-15",
  "yearsExperience": 5,
  "rating": 4.8,
  "ratingCount": 150,
  "totalTrips": 450,
  "currentStatus": "active",
  "assignedRoutes": ["route_123", "route_124"],
  "certificates": [
    {
      "name": "First Aid",
      "expiryDate": "2027-06-30"
    }
  ],
  "medicalCertificate": {
    "expiryDate": "2026-12-31",
    "approved": true
  },
  "createdAt": "2026-01-10T10:00:00Z",
  "updatedAt": "2026-07-20T10:00:00Z"
}
```

**Indexes**:
- `currentStatus` (ascending)
- `rating` (descending)
- `assignedRoutes` (ascending)

### 3. Students Collection

**Path**: `/students/{studentId}`

Stores student information.

```json
{
  "studentId": "student_123",
  "firstName": "Jane",
  "lastName": "Doe",
  "age": 10,
  "school": "Central High School",
  "parentId": "user_123",
  "assignedRoute": "route_123",
  "medicalInfo": "Nut allergy",
  "emergencyContact": {
    "name": "John Doe",
    "phone": "+1234567890"
  },
  "assignedSeat": "A5",
  "createdAt": "2026-01-10T10:00:00Z",
  "updatedAt": "2026-07-20T10:00:00Z",
  "isActive": true
}
```

**Indexes**:
- `parentId` (ascending)
- `assignedRoute` (ascending)
- `school` (ascending)

### 4. Routes Collection

**Path**: `/routes/{routeId}`

Stores transportation route information.

```json
{
  "routeId": "route_123",
  "name": "Downtown Route A",
  "description": "Downtown morning route",
  "driverId": "driver_123",
  "vehicleId": "vehicle_123",
  "status": "active",
  "startTime": "07:00",
  "endTime": "08:00",
  "estimatedDuration": 60,
  "capacity": 50,
  "currentStudentCount": 25,
  "stops": [
    {
      "stopId": "stop_1",
      "name": "Central Station",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "sequence": 1,
      "estimatedArrival": "07:00",
      "description": "Downtown terminal"
    }
  ],
  "students": ["student_123", "student_124"],
  "createdAt": "2026-01-10T10:00:00Z",
  "updatedAt": "2026-07-20T10:00:00Z"
}
```

**Indexes**:
- `status` (ascending)
- `driverId` (ascending)
- `startTime` (ascending)

### 5. Locations Collection (Time-Series)

**Path**: `/locations/{routeId}/{timestamp}`

Stores GPS location history for routes.

```json
{
  "routeId": "route_123",
  "timestamp": "2026-07-20T10:30:00Z",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "accuracy": 25,
  "speed": 45,
  "heading": 180,
  "altitude": 50,
  "recordedAt": "2026-07-20T10:30:00Z"
}
```

**Indexes**:
- Composite: `routeId` + `timestamp` (descending)

### 6. Messages Collection

**Path**: `/messages/{conversationId}/messages/{messageId}`

Stores in-app messaging between parents and drivers.

```json
{
  "conversationId": "conv_123",
  "messageId": "msg_456",
  "sender": "user_123",
  "recipient": "driver_123",
  "text": "Is my child on the bus?",
  "mediaUrl": null,
  "mediaType": null,
  "timestamp": "2026-07-20T10:30:00Z",
  "readBy": ["driver_123"],
  "readAt": "2026-07-20T10:31:00Z"
}
```

**Indexes**:
- `conversationId` + `timestamp` (descending)
- `sender` (ascending)
- `recipient` (ascending)

### 7. Payments Collection

**Path**: `/payments/{paymentId}`

Stores payment transaction records.

```json
{
  "paymentId": "pay_123",
  "userId": "user_123",
  "amount": 150.00,
  "currency": "USD",
  "status": "completed",
  "method": "card",
  "transactionId": "stripe_txn_123",
  "description": "Monthly transportation fee",
  "refundable": false,
  "processedAt": "2026-07-20T10:00:00Z",
  "receiptUrl": "https://storage.firebase.com/.../receipt.pdf",
  "metadata": {
    "invoiceId": "inv_123",
    "studentId": "student_123"
  }
}
```

**Indexes**:
- `userId` + `processedAt` (descending)
- `status` (ascending)
- `transactionId` (ascending)

### 8. Invoices Collection

**Path**: `/invoices/{invoiceId}`

Stores invoice records.

```json
{
  "invoiceId": "inv_123",
  "userId": "user_123",
  "amount": 300.00,
  "dueDate": "2026-08-05",
  "issuedDate": "2026-07-20",
  "status": "pending",
  "period": "2026-07",
  "items": [
    {
      "description": "Transportation - July 2026",
      "quantity": 1,
      "unitPrice": 300.00,
      "total": 300.00
    }
  ],
  "paidAmount": 0.00,
  "pdfUrl": "https://storage.firebase.com/.../invoice.pdf",
  "createdAt": "2026-07-20T10:00:00Z",
  "updatedAt": "2026-07-20T10:00:00Z"
}
```

**Indexes**:
- `userId` + `dueDate` (ascending)
- `status` (ascending)
- `issuedDate` (descending)

### 9. Notifications Collection

**Path**: `/notifications/{notificationId}`

Stores user notifications.

```json
{
  "notificationId": "notif_123",
  "userId": "user_123",
  "title": "Bus Arriving Soon",
  "message": "Route A bus is 5 minutes away",
  "type": "arrival",
  "priority": "high",
  "read": false,
  "actionUrl": "app://route/route_123",
  "createdAt": "2026-07-20T10:00:00Z",
  "expiresAt": "2026-07-27T10:00:00Z"
}
```

**Indexes**:
- `userId` + `createdAt` (descending)
- `read` (ascending)

### 10. Attendance Collection

**Path**: `/attendance/{routeId}/{date}/{studentId}`

Stores student attendance records.

```json
{
  "routeId": "route_123",
  "date": "2026-07-20",
  "studentId": "student_123",
  "status": "present",
  "checkedInAt": "2026-07-20T07:05:00Z",
  "checkedOutAt": "2026-07-20T08:00:00Z",
  "reason": null,
  "recordedBy": "driver_123"
}
```

**Indexes**:
- Composite: `routeId` + `date` + `status`

### 11. Complaints Collection

**Path**: `/complaints/{complaintId}`

Stores user complaints and feedback.

```json
{
  "complaintId": "comp_123",
  "userId": "user_123",
  "routeId": "route_123",
  "title": "Bus was 15 minutes late",
  "description": "The morning bus was significantly delayed",
  "status": "open",
  "priority": "medium",
  "attachments": [
    {
      "url": "https://storage.firebase.com/.../photo.jpg",
      "type": "image"
    }
  ],
  "resolution": null,
  "createdAt": "2026-07-20T10:00:00Z",
  "updatedAt": "2026-07-20T10:00:00Z",
  "resolvedAt": null
}
```

**Indexes**:
- `status` (ascending)
- `userId` + `createdAt` (descending)
- `routeId` (ascending)

### 12. Vehicles Collection

**Path**: `/vehicles/{vehicleId}`

Stores vehicle information.

```json
{
  "vehicleId": "vehicle_123",
  "registrationNumber": "ABC123XYZ",
  "make": "Mercedes-Benz",
  "model": "Sprinter",
  "year": 2022,
  "capacity": 50,
  "color": "Yellow",
  "licensePlate": "ABC 123",
  "registrationExpiry": "2027-12-31",
  "maintenanceStatus": "good",
  "lastServiceDate": "2026-07-01",
  "insuranceExpiry": "2026-12-31",
  "mileage": 50000,
  "gpsDeviceId": "gps_device_123",
  "createdAt": "2026-01-10T10:00:00Z",
  "updatedAt": "2026-07-20T10:00:00Z"
}
```

**Indexes**:
- `registrationNumber` (ascending)
- `maintenanceStatus` (ascending)

## Security Rules

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Drivers can read their own driver profile
    match /drivers/{driverId} {
      allow read: if request.auth.uid == resource.data.userId;
    }

    // Messages - read if participant
    match /messages/{conversationId}/messages/{messageId} {
      allow read: if request.auth.uid in [resource.data.sender, resource.data.recipient];
      allow write: if request.auth.uid == request.resource.data.sender;
    }

    // Routes - parents can read assigned routes
    match /routes/{routeId} {
      allow read: if get(/databases/$(database)/documents/students/$(request.auth.uid)).data.assignedRoute == routeId;
    }

    // Admin access
    match /{document=**} {
      allow read, write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Data Retention Policy

- **GPS Locations**: 90 days
- **Messages**: Indefinite (user can delete)
- **Notifications**: 7 days after expiry
- **Attendance Records**: 5 years
- **Payments**: Indefinite
- **Complaints**: 2 years

## Backup Strategy

- Automated daily backups via Firebase
- Monthly exports to Cloud Storage
- Disaster recovery testing quarterly

---

**Last Updated**: July 2026
**Version**: 1.0
