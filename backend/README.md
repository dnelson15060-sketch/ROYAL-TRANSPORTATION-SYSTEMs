# Backend API - Royal Transportation System

## Structure

```
src/
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── drivers.js
│   ├── gps.js
│   ├── routes.js
│   ├── payments.js
│   ├── notifications.js
│   └── reports.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── driverController.js
│   ├── gpsController.js
│   ├── routeController.js
│   ├── paymentController.js
│   ├── notificationController.js
│   └── reportController.js
├── services/
│   ├── firebaseService.js
│   ├── authService.js
│   ├── emailService.js
│   ├── smsService.js
│   ├── stripeService.js
│   └── mapService.js
├── middleware/
│   ├── auth.js
│   ├── validation.js
│   └── errorHandler.js
├── utils/
│   ├── logger.js
│   ├── validators.js
│   └── helpers.js
└── config/
    ├── firebase.js
    ├── database.js
    └── constants.js
```

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your Firebase credentials
npm run dev
```

## Testing

```bash
npm test
```

## Deployment

```bash
npm start
```
