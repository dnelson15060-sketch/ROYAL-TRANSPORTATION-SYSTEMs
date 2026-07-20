# Royal Transportation System 🚌

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
├── docs/                          # Documentation
│   ├── Requirements.md
│   ├── Architecture.md
│   ├── API.md
│   ├── Database.md
│   └── Deployment.md
│
├── mobile_app/                    # Flutter Mobile Application
│   ├── lib/
│   │   ├── core/                 # Core utilities
│   │   ├── models/               # Data models
│   │   ├── services/             # Business logic
│   │   ├── providers/            # State management
│   │   ├── widgets/              # Reusable components
│   │   ├── screens/              # UI screens
│   │   ├── theme/                # App theming
│   │   └── main.dart
│   └── pubspec.yaml
│
├── backend/                       # Node.js Backend
│   ├── src/
│   │   ├── auth/                 # Authentication
│   │   ├── users/                # User management
│   │   ├── students/             # Student management
│   │   ├── drivers/              # Driver management
│   │   ├── gps/                  # GPS tracking
│   │   ├── routes/               # Route management
│   │   ├── payments/             # Payment processing
│   │   ├── messaging/            # Messaging service
│   │   ├── complaints/           # Complaint system
│   │   ├── notifications/        # Notifications
│   │   └── reports/              # Reporting
│   ├── package.json
│   └── server.js
│
├── admin_dashboard/              # Flutter Web Admin Panel
├── firebase/                      # Firebase configuration
├── assets/                        # Images, icons, logos
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
- Flutter SDK (3.0+)
- Node.js (18+)
- Firebase account
- Google Maps API key
- Git

### Mobile App Setup
```bash
cd mobile_app
flutter pub get
flutter run
```

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Firebase Setup
1. Create Firebase project
2. Configure authentication
3. Set up Firestore database
4. Enable Cloud Messaging
5. Configure Storage rules

## 📊 Development Phases

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| **Phase 1: MVP** | 6-8 weeks | Authentication, Tracking, Notifications |
| **Phase 2: Features** | 4-6 weeks | Messaging, Attendance, Management |
| **Phase 3: Payments** | 4-6 weeks | Payment integration, Reports |
| **Phase 4: Polish** | 3-4 weeks | AI, QR codes, App Store launch |

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
**Status**: 🟡 In Development (Phase 1 - MVP)
