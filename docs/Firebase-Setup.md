# Firebase Configuration Guide - Royal Transportation System

## Step 1: Create Firebase Project

### 1.1 Create Project in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add Project"**
3. Enter project name: `royal-transportation`
4. Accept terms and click **"Create Project"**
5. Wait for project creation to complete

### 1.2 Register Apps

#### Android App
1. Click **Android** icon in Firebase console
2. Package name: `com.royaltransportation.app`
3. App nickname: `Royal Transportation - Android`
4. Download `google-services.json`
5. Place in: `mobile_app/android/app/google-services.json`

#### iOS App
1. Click **iOS** icon in Firebase console
2. Bundle ID: `com.royaltransportation.app`
3. App nickname: `Royal Transportation - iOS`
4. Download `GoogleService-Info.plist`
5. Place in: `mobile_app/ios/Runner/GoogleService-Info.plist`

#### Web App
1. Click **Web** icon (</>) in Firebase console
2. App nickname: `Royal Transportation - Web`
3. Copy config object (you'll need this)

---

## Step 2: Enable Firebase Services

### 2.1 Authentication

1. Go to **Build > Authentication**
2. Click **"Get Started"**
3. Enable providers:
   - **Email/Password**
     - Click enable
     - Make sure "Email/Password" is ON
   - **Phone**
     - Click enable
     - Add reCAPTCHA v3 (for security)
     - Enable SMS provider

### 2.2 Firestore Database

1. Go to **Build > Firestore Database**
2. Click **"Create Database"**
3. Start location: `us-central1` (or closest to you)
4. Security rules: **Start in test mode** (we'll update later)
5. Click **"Create"**

### 2.3 Cloud Storage

1. Go to **Build > Storage**
2. Click **"Get Started"**
3. Default bucket location: `us-central1`
4. Click **"Done"**

### 2.4 Cloud Messaging

1. Go to **Build > Cloud Messaging**
2. Click **"Generate private key"** (creates service account)
3. Note the Server API Key (you'll need this)

### 2.5 Analytics

1. Go to **Analytics**
2. Click **"Enable Google Analytics"** (optional but recommended)

---

## Step 3: Create Service Account for Backend

1. Go to **Project Settings** (⚙️ icon top right)
2. Click **"Service Accounts"** tab
3. Select **"Node.js"** from dropdown
4. Click **"Generate new private key"**
5. A JSON file will download
6. **DO NOT commit this file to Git!**

---

## Step 4: Backend Configuration

### 4.1 Create `.env` file

```bash
cd backend
cp .env.example .env
```

### 4.2 Edit `backend/.env`

```env
# Firebase
FIREBASE_CREDENTIALS={paste_entire_json_from_service_account_key}
FIREBASE_PROJECT_ID=royal-transportation
FIREBASE_DATABASE_URL=https://royal-transportation.firebaseio.com
FIREBASE_STORAGE_BUCKET=royal-transportation.appspot.com

# API
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
CORS_ORIGIN=*

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_this
JWT_EXPIRY=7d

# Stripe (for later)
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Twilio (for SMS/OTP)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Email (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Google Maps
GOOGLE_MAPS_API_KEY=
```

**Important:** For Firebase credentials, copy the entire JSON content from the service account key

### 4.3 Initialize Firebase in Backend

Update `backend/src/config/firebase.js`:

```javascript
const admin = require('firebase-admin');
const logger = require('../utils/logger');

if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
    
    logger.info('Firebase initialized successfully');
  } catch (error) {
    logger.error('Firebase initialization failed:', error);
    process.exit(1);
  }
}

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

module.exports = { admin, db, auth, storage };
```

---

## Step 5: Mobile Configuration

### 5.1 Create Firebase Config for Flutter

Create `mobile_app/lib/config/firebase_config.dart`:

```dart
class FirebaseConfig {
  // Firebase Web Config (from Firebase Console > Project Settings)
  static const String apiKey = 'YOUR_API_KEY';
  static const String appId = 'YOUR_APP_ID';
  static const String messagingSenderId = 'YOUR_MESSAGING_SENDER_ID';
  static const String projectId = 'royal-transportation';
  static const String authDomain = 'royal-transportation.firebaseapp.com';
  static const String storageBucket = 'royal-transportation.appspot.com';
  static const String measurementId = 'YOUR_MEASUREMENT_ID';
}
```

### 5.2 Update `mobile_app/lib/main.dart`

```dart
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';
import 'src/app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Firebase
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  
  runApp(const MyApp());
}
```

### 5.3 Generate `firebase_options.dart`

```bash
cd mobile_app
flutter pub global activate flutterfire_cli
flutterfire configure --project=royal-transportation
```

This will:
- Connect to your Firebase project
- Auto-generate `firebase_options.dart`
- Update Android/iOS configs

---

## Step 6: Firestore Database Setup

### 6.1 Create Collections

In Firebase Console > Firestore - Collections to create:
1. **users**
2. **drivers**
3. **students**
4. **routes**
5. **locations**
6. **payments**
7. **notifications**

(See docs/Database.md for full schema)

### 6.2 Set Security Rules

Go to **Firestore > Rules** and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Drivers can read their own driver profile
    match /drivers/{driverId} {
      allow read: if request.auth.uid == resource.data.userId;
    }

    // Admins can read everything
    match /{document=**} {
      allow read, write: if request.auth.token.role == 'admin';
    }
  }
}
```

---

## Step 7: Test Firebase Connection

### 7.1 Backend Test

```bash
cd backend
npm install
npm run dev
```

You should see: `Firebase initialized successfully`

### 7.2 Mobile Test

```bash
cd mobile_app
flutter pub get
flutter run -d chrome
```

The app should launch without Firebase errors

---

## Step 8: Environment Variables Checklist

✅ `backend/.env` created with Firebase credentials
✅ `firebase_options.dart` generated for mobile
✅ `google-services.json` placed in Android folder
✅ `GoogleService-Info.plist` placed in iOS folder
✅ Firestore collections created
✅ Security rules updated
✅ Authentication providers enabled
✅ Cloud Storage enabled
✅ Cloud Messaging enabled

---

## Troubleshooting

### "Firebase credential not found"
- Check `.env` file has FIREBASE_CREDENTIALS
- Ensure it's valid JSON
- Verify file is not in .gitignore accidentally

### "Permission denied" errors in Firestore
- Check security rules in Firebase Console
- Make sure user is authenticated
- Verify user ID matches in rules

### "App not registered" error on mobile
- Run `flutterfire configure` again
- Ensure `google-services.json` and `GoogleService-Info.plist` exist
- Clear Flutter build cache: `flutter clean`

---

**Status**: ✅ Firebase Configuration Complete
**Next Step**: Backend Authentication Implementation

**Last Updated**: July 2026
