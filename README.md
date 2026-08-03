# Royal Transportation System 🚌

[![Backend CI](https://github.com/dnelson15060-sketch/ROYAL-TRANSPORTATION-SYSTEMs/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/dnelson15060-sketch/ROYAL-TRANSPORTATION-SYSTEMs/actions/workflows/backend-ci.yml)
[![Admin CI](https://github.com/dnelson15060-sketch/ROYAL-TRANSPORTATION-SYSTEMs/actions/workflows/admin-ci.yml/badge.svg)](https://github.com/dnelson15060-sketch/ROYAL-TRANSPORTATION-SYSTEMs/actions/workflows/admin-ci.yml)
[![Mobile CI](https://github.com/dnelson15060-sketch/ROYAL-TRANSPORTATION-SYSTEMs/actions/workflows/mobile-ci.yml/badge.svg)](https://github.com/dnelson15060-sketch/ROYAL-TRANSPORTATION-SYSTEMs/actions/workflows/mobile-ci.yml)

A comprehensive mobile and web platform for managing school transportation, driver tracking, parent notifications, and student safety for Royal Transportation.

## 📋 Project Overview

Royal Transportation System is an integrated solution that connects:
- **Parents** - Real-time bus tracking, child status updates, and notifications
- **Drivers** - Route management, GPS tracking, attendance, and messaging
- **Administrators** - Fleet management, analytics, payments, and reporting

## 🎯 Key Features

### Milestone 1 (MVP)
- ✅ User authentication (Parents, Drivers, Admin)
- ✅ Parent dashboard with live GPS tracking
- ✅ Driver dashboard with route management
- ✅ Firebase integration
- ✅ Google Maps integration
- ✅ Push notifications
- ✅ Royal Transportation branding

### Milestone 2
- 📱 In-app messaging between parents and drivers
- 📍 Student attendance tracking
- 👥 Student and driver management
- 📢 Complaint system
- 🔔 Advanced notifications

### Milestone 3
- 💳 Online payments (Stripe + WiPay)
- 📄 Receipt management
- 📊 Financial reports
- 📈 Analytics dashboard

### Milestone 4
- 🤖 AI route optimization
- 🔍 QR code student check-in
- 👤 Face ID authentication
- 🎯 App Store releases

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| Mobile App | Flutter |
| Backend | Node.js + Express |
| Database | Firebase Firestore |
| Authentication | Firebase Auth |
| Maps | Google Maps SDK |
| Notifications | Firebase Cloud Messaging |
| Payments | Stripe + WiPay |
| Storage | Firebase Storage |
| Admin Dashboard | Flutter Web |
| Version Control | Git + GitHub |

## 📁 Project Structure

```
royal-transportation-system/
├── .github/
│   └── workflows/                 # GitHub Actions CI/CD
│       ├── backend-ci.yml         # Backend lint + test + Docker build
│       ├── admin-ci.yml           # Admin dashboard lint + test + build
│       └── mobile-ci.yml          # Flutter analyze + test + APK build
├── docs/                          # Documentation
│   ├── Requirements.md
│   ├── Architecture.md
│   ├── API.md
│   ├── Database.md
│   ├── Deployment.md
│   └── Firebase-Setup.md
├── mobile_app/                    # Flutter Mobile Application
│   ├── lib/
│   │   ├── config/               # App config, colors, routes
│   │   ├── models/               # Data models
│   │   ├── services/             # Auth, GPS, API, FCM services
│   │   ├── providers/            # State management (Provider)
│   │   ├── screens/
│   │   │   ├── auth/             # Login, Register
│   │   │   ├── parent/           # Live map, child status, notifications
│   │   │   └── driver/           # Route list, active route, attendance
│   │   ├── widgets/              # Reusable UI components
│   │   └── main.dart
│   ├── test/                     # Flutter unit + widget tests
│   ├── pubspec.yaml
│   └── .env.example
├── backend/                       # Node.js + Express API
│   ├── src/
│   │   ├── config/               # Firebase Admin, constants
│   │   ├── middleware/            # Auth, error handler, validation
│   │   ├── routes/               # health, auth, users, drivers,
│   │   │                         #   students, routes, gps,
│   │   │                         #   attendance, notifications
│   │   └── services/             # Business logic services
│   ├── scripts/
│   │   └── seed.js               # Demo data seed script
│   ├── tests/                    # Jest unit + integration tests
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── admin_dashboard/               # React + Vite Admin Web App
│   ├── src/
│   │   ├── components/           # UI primitives + layout
│   │   ├── pages/                # auth, dashboard, users, drivers,
│   │   │                         #   students, routes, notifications
│   │   ├── services/             # API + Firebase Auth services
│   │   ├── contexts/             # AuthContext
│   │   ├── hooks/                # useAuth, useApi
│   │   └── types/                # TypeScript interfaces
│   ├── package.json
│   └── .env.example
├── firebase/                      # Firebase configuration
│   ├── firestore.rules            # Firestore security rules
│   ├── firestore.indexes.json     # Composite indexes
│   └── firebase.json              # Firebase CLI config
├── docker-compose.yml             # Local multi-service stack
├── start.sh                       # One-command local startup
└── .gitignore
```

## 🔄 Git Workflow

We use a professional branching strategy:

```
main                              # Production releases
├── development                   # Development integration
│   ├── feature/authentication
│   ├── feature/gps-tracking
│   ├── feature/payments
│   ├── feature/messaging
│   ├── feature/attendance
│   ├── feature/complaints
│   └── feature/notifications
```

## 🚀 Getting Started

### Prerequisites

| Tool | Minimum Version | Install |
|------|----------------|---------|
| Node.js | 18.x | https://nodejs.org |
| Flutter | 3.19+ | https://flutter.dev |
| Firebase CLI | Latest | `npm i -g firebase-tools` |
| Git | 2.x | https://git-scm.com |

### Quick Start (All Components)

```bash
# 1. Clone the repository
git clone https://github.com/dnelson15060-sketch/ROYAL-TRANSPORTATION-SYSTEMs.git
cd ROYAL-TRANSPORTATION-SYSTEMs

# 2. Run the startup script (installs deps + starts backend + admin dashboard)
./start.sh
```

This will:
- Install backend and admin dashboard dependencies
- Copy `.env.example` → `.env` files for you to configure
- Start the backend API on http://localhost:3000
- Start the admin dashboard on http://localhost:5173

### Manual Setup

#### 1. Backend API

```bash
cd backend
cp .env.example .env          # Edit with your Firebase credentials
npm install
npm run dev                   # Start with auto-reload (nodemon)
# or: npm start               # Production start

# Seed demo data
npm run seed

# Run tests
npm test
```

#### 2. Admin Dashboard

```bash
cd admin_dashboard
cp .env.example .env          # Edit with your Firebase web config
npm install
npm run dev                   # Start Vite dev server

# Run tests
npm test

# Production build
npm run build
```

#### 3. Mobile App

```bash
cd mobile_app
flutter pub get

# Configure Firebase (required before running)
# Install FlutterFire CLI: dart pub global activate flutterfire_cli
# Then run: flutterfire configure --project=YOUR_FIREBASE_PROJECT_ID

# Run on connected device/emulator
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:3000/api/v1

# Run tests
flutter test
```

### Firebase Setup

See [docs/Firebase-Setup.md](docs/Firebase-Setup.md) for the full guide. Quick steps:

1. Create a Firebase project at https://console.firebase.google.com
2. Enable **Authentication** (Email/Password)
3. Enable **Firestore** in production mode
4. Enable **Cloud Messaging**
5. Create a **Service Account** key for the backend
6. Deploy Firestore security rules:
   ```bash
   cd firebase
   firebase deploy --only firestore:rules,firestore:indexes
   ```

### Environment Variables

Each component has a `.env.example` file. Copy and fill in your values:

| File | Purpose |
|------|---------|
| `backend/.env.example` | Firebase Admin SDK, server config |
| `admin_dashboard/.env.example` | Firebase Web SDK, API URL |
| `mobile_app/.env.example` | API base URL, Firebase project ID |

> ⚠️ **Never commit `.env` files.** They are listed in `.gitignore`.

### Demo Data

After setting up Firebase, seed demo data:

```bash
cd backend && npm run seed
```

This creates:
- **Admin**: `admin@royal.com` (password set in Firebase Auth manually)
- **Drivers**: `driver1@royal.com`, `driver2@royal.com`
- **Parents**: 5 parent accounts
- **Students**: 8 students linked to parents
- **Routes**: 3 routes with stops
- **Buses**: 2 bus records

### Happy-Path Demo Flow

1. **Admin** logs into Admin Dashboard → creates route → assigns driver and students
2. **Driver** logs into mobile app → sees assigned route → taps "Start Route" → GPS location broadcasts every 30s
3. **Parent** logs into mobile app → sees live bus location on map → receives push notification when driver starts route

## 📊 Development Phases

| Phase | Status | Deliverables |
|-------|--------|--------------|
| **Phase 1: MVP** | 🟢 Complete | Authentication, GPS Tracking, Notifications, Core Dashboards |
| **Phase 2: Features** | 🔵 Planned | In-app Messaging, Advanced Attendance, Complaints |
| **Phase 3: Payments** | 🔵 Planned | Stripe + WiPay, Invoicing, Financial Reports |
| **Phase 4: Polish** | 🔵 Planned | AI Route Optimization, QR Codes, App Store Release |

## 🎨 UI Theme

- 🔵 **Royal Blue** (#003DA5)
- 🔴 **Red** (#E31937)
- ⚪ **White** (#FFFFFF)
- 🟡 **Gold** (#FFD700) - Accents

## 📝 Documentation

- [Requirements](docs/Requirements.md) - Full system requirements
- [Architecture](docs/Architecture.md) - System architecture
- [API Documentation](docs/API.md) - Backend API endpoints
- [Database Schema](docs/Database.md) - Firestore structure
- [Deployment](docs/Deployment.md) - Deployment guide

## 🔐 Security

- Firebase Authentication with email/password and phone verification
- JWT tokens for API authentication
- Encrypted GPS location data
- PCI DSS compliant payment processing
- Role-based access control

## 📱 User Roles

1. **Parent** - Track children, receive notifications, manage account
2. **Driver** - Manage routes, track GPS, communicate with parents
3. **Student** - Check-in, receive notifications, view route
4. **Administrator** - System management, analytics, reporting

## 🤝 Contributing

1. Create a feature branch from `development`
2. Commit changes with clear messages
3. Push to your branch
4. Create a Pull Request to `development`
5. After review, merge to `main` for release

## 📞 Support

For issues or questions, please create an issue in the GitHub repository.

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👥 Team

- **Project Lead**: dnelson15060-sketch
- **Development**: Royal Transportation System Team

---

**Last Updated**: July 2026
**Status**: 🟢 MVP Complete (Phase 1)
**Version**: 1.0.0
