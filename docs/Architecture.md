# System Architecture - Royal Transportation System

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
├──────────────────┬──────────────────┬──────────────────┬─────────┤
│  Mobile App      │  Admin Dashboard │  Driver App      │   Web   │
│  (Flutter)       │  (Flutter Web)   │  (Flutter)       │ Portal  │
└────────┬─────────┴────────┬─────────┴────────┬────────┴────┬────┘
         │                  │                  │             │
         └──────────────────┼──────────────────┼─────────────┘
                            │
                   ┌────────▼────────┐
                   │   API Gateway   │
                   │   (Express.js)  │
                   └────────┬────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
    ┌────────┐          ┌────────┐         ┌────────┐
    │  Auth  │          │ Business│        │ Reports│
    │Service │          │ Logic   │        │Service │
    └────┬───┘          └────┬───┘         └────┬───┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
        ▼                                         ▼
    ┌──────────────┐                    ┌──────────────┐
    │  Firestore   │                    │   Firebase   │
    │  Database    │                    │  Cloud Msgs  │
    └──────────────┘                    └──────────────┘
        │                                         │
        └────────────────────┬────────────────────┘
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
        ▼                                         ▼
    ┌──────────────┐                    ┌──────────────┐
    │Firebase Auth │                    │   Storage    │
    │              │                    │   & CDN      │
    └──────────────┘                    └──────────────┘
```

## System Components

### 1. Client Applications

#### Mobile App (Flutter)
- **Platforms**: iOS, Android
- **State Management**: Provider/BLoC
- **Local Storage**: SQLite/Hive
- **Features**: GPS tracking, offline-first, real-time updates
- **Target Users**: Parents, Drivers, Students

#### Admin Dashboard (Flutter Web)
- **Platform**: Web (Chrome, Safari, Firefox, Edge)
- **Features**: Fleet management, reporting, analytics
- **Target Users**: Administrators

### 2. Backend Infrastructure

#### API Server (Node.js + Express)
```
Routes:
├── /api/auth/
│   ├── POST /register
│   ├── POST /login
│   ├── POST /logout
│   ├── POST /refresh-token
│   └── POST /verify-otp
│
├── /api/users/
│   ├── GET /profile
│   ├── PUT /profile
│   ├── GET /children
│   └── PUT /emergency-contacts
│
├── /api/drivers/
│   ├── GET /routes
│   ├── POST /location
│   ├── POST /attendance
│   └── GET /performance
│
├── /api/routes/
│   ├── GET /list
│   ├── POST /create
│   ├── PUT /:id
│   └── DELETE /:id
│
├── /api/gps/
│   ├── POST /track
│   ├── GET /history/:driverId
│   └── GET /current/:routeId
│
├── /api/payments/
│   ├── POST /process
│   ├── GET /history
│   ├── POST /invoice
│   └── GET /receipts
│
├── /api/notifications/
│   ├── POST /send
│   ├── GET /history
│   └── PUT /preferences
│
├── /api/reports/
│   ├── GET /daily
│   ├── GET /monthly
│   ├── GET /financial
│   └── GET /performance
│
└── /api/admin/
    ├── GET /dashboard
    ├── GET /users
    └── PUT /settings
```

#### Authentication Service
- **Provider**: Firebase Authentication
- **Methods**: Email/password, Phone/OTP
- **JWT Tokens**: Issued by backend
- **Session Management**: Redis-based sessions
- **MFA Support**: Two-factor authentication

#### GPS Tracking Service
- **Update Frequency**: Every 30 seconds
- **Accuracy**: ±20-50 meters
- **Offline Support**: Queue updates for later sync
- **Processing**: Real-time location aggregation
- **Storage**: Firestore + time-series collection

#### Messaging Service
- **Queue**: Firebase Cloud Messaging
- **Push Notifications**: Real-time delivery
- **Message Storage**: Firestore
- **Read Receipts**: Timestamp tracking
- **Offline Delivery**: Queue-based retry

### 3. Data Layer

#### Firestore Collections

```
users/
  ├── {userId}
  │   ├── email: string
  │   ├── phone: string
  │   ├── role: enum (parent|driver|student|admin)
  │   ├── fullName: string
  │   ├── profileImage: string
  │   ├── emergencyContacts: array
  │   ├── createdAt: timestamp
  │   └── updatedAt: timestamp
  │
drivers/
  ├── {driverId}
  │   ├── licenseNumber: string
  │   ├── licenseExpiry: date
  │   ├── backgroundCheck: boolean
  │   ├── rating: number
  │   ├── totalTrips: number
  │   ├── assignedRoutes: array
  │   └── currentStatus: enum
  │
students/
  ├── {studentId}
  │   ├── name: string
  │   ├── school: string
  │   ├── parentId: reference
  │   ├── assignedRoute: reference
  │   ├── medicalInfo: string
  │   └── emergencyContact: string
  │
routes/
  ├── {routeId}
  │   ├── name: string
  │   ├── stops: array
  │   ├── assignedDriver: reference
  │   ├── students: array
  │   ├── vehicle: reference
  │   ├── estimatedTime: number
  │   └── status: enum
  │
locations/
  ├── {routeId}
  │   ├── latitude: number
  │   ├── longitude: number
  │   ├── timestamp: timestamp
  │   ├── accuracy: number
  │   └── speed: number
  │
messages/
  ├── {conversationId}
  │   ├── participants: array
  │   ├── messages: subcollection
  │   │   ├── {messageId}
  │   │   │   ├── text: string
  │   │   │   ├── sender: reference
  │   │   │   ├── timestamp: timestamp
  │   │   │   └── readBy: array
  │   │
payments/
  ├── {paymentId}
  │   ├── userId: reference
  │   ├── amount: number
  │   ├── status: enum
  │   ├── method: string
  │   ├── transactionId: string
  │   ├── date: timestamp
  │   └── receipt: string
  │
notifications/
  ├── {notificationId}
  │   ├── userId: reference
  │   ├── type: enum
  │   ├── title: string
  │   ├── message: string
  │   ├── read: boolean
  │   ├── actionUrl: string
  │   └── timestamp: timestamp
```

### 4. External Services

#### Google Maps API
- Real-time directions
- Route optimization
- Geofencing
- Distance/duration calculations

#### Firebase Services
- Authentication (Email, Phone OTP)
- Firestore (NoSQL database)
- Cloud Storage (Document/media storage)
- Cloud Messaging (Push notifications)
- Analytics

#### Payment Gateway
- **Stripe**: Card payments
- **WiPay**: Mobile money payments
- **Webhooks**: Transaction callbacks

#### SMS Service
- OTP delivery
- SMS notifications
- Delivery reports

## Data Flow Diagrams

### Authentication Flow
```
User Input
    │
    ▼
┌─────────────────┐
│ Client App      │
│ (Login Form)    │
└────────┬────────┘
         │ POST /auth/login
         ▼
┌─────────────────┐
│ Express Server  │
│ (Auth Route)    │
└────────┬────────┘
         │
         ├─ Verify Credentials
         │  via Firebase Auth
         │
         ├─ Generate JWT Token
         │
         └─ Return Token + User Data
              │
              ▼
         Client App
         (Store Token)
```

### GPS Tracking Flow
```
Driver App
    │ GPS Location (every 30s)
    ▼
┌──────────────────┐
│ Collect Location │
│ (lat, long, acc) │
└────────┬─────────┘
         │ POST /api/gps/track
         ▼
┌──────────────────┐
│ Express Server   │
│ Validate & Store │
└────────┬─────────┘
         │
         ├─ Save to Firestore
         │  locations/{routeId}
         │
         ├─ Update Real-time
         │  Listeners
         │
         └─ Send Push
            Notification
             │
             ▼
         Parent Apps
         (Map Updates)
```

### Payment Flow
```
Parent App
(Payment Form)
    │
    ▼
┌─────────────────┐
│ Payment Screen  │
│ (Amount, Method)│
└────────┬────────┘
         │
         │ Amount + Card
         ▼
┌──────────────────────┐
│ Stripe/WiPay API     │
│ Process Transaction  │
└────────┬─────────────┘
         │
         ├─ Success → Send Token
         │
         └─ Token to Server
              │
              ▼
         ┌──────────────┐
         │Express Server│
         │ Record Payment
         │ Generate Receipt
         └──────┬───────┘
                │
                ├─ Save to Firestore
                │  payments/{paymentId}
                │
                └─ Send Confirmation
                   Email + SMS
```

## Deployment Architecture

### Development Environment
```
Local Machine
├── Flutter SDK
├── Node.js + npm
├── Firebase Emulator
└── Local Database
```

### Staging Environment
```
Cloud (Firebase Hosting)
├── Staging API (Cloud Functions)
├── Firestore (staging project)
├── Storage (staging bucket)
└── Analytics (staging)
```

### Production Environment
```
Cloud Infrastructure
├── API Server (Node.js on Cloud Run)
├── Database (Firestore)
├── Storage (Cloud Storage + CDN)
├── Messaging (Cloud Messaging)
├── Analytics (Firebase Analytics)
└── Monitoring (Cloud Monitoring)
```

## Security Architecture

### Authentication
- Firebase Authentication (primary)
- JWT tokens (API authentication)
- Refresh token rotation
- Session management

### Authorization
- Role-based access control (RBAC)
- Resource-level permissions
- API endpoint protection
- Frontend route guards

### Data Protection
- SSL/TLS encryption in transit
- AES encryption at rest
- PII encryption in database
- Secure key management

### API Security
- Rate limiting
- CORS configuration
- Input validation
- SQL injection prevention
- XSS protection

## Performance Optimization

### Caching Strategy
- Redis for session/token caching
- Firestore query caching
- Client-side local storage
- CDN for static assets

### Database Optimization
- Indexed queries
- Denormalization where needed
- Query optimization
- Batch operations

### Frontend Optimization
- Code splitting
- Lazy loading
- Asset optimization
- Offline-first architecture

---

**Last Updated**: July 2026
**Version**: 1.0
