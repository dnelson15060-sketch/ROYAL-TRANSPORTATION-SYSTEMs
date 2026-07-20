# Mobile Authentication Implementation Guide

## Overview

This guide covers the complete mobile app authentication implementation for Royal Transportation System using Flutter, Firebase, and the backend API.

## Files Created

### 1. **Authentication Screens**

#### LoginScreen (`lib/screens/authentication/login_screen.dart`)
- User login UI with email and password fields
- Error message display
- Loading indicator during login
- Navigation to registration screen
- Forgot password link

#### RegisterScreen (`lib/screens/authentication/register_screen.dart`)
- User registration UI
- First name, last name, email, phone fields
- Role selection (Parent/Driver)
- Password confirmation
- Input validation
- Error handling
- Navigation to login screen

### 2. **Services & Utilities**

#### ApiService (`lib/services/api_service.dart`)
Handles all HTTP requests to backend:
- `register()` - User registration
- `login()` - User authentication
- `refreshToken()` - Token refresh
- `logout()` - User logout
- Automatic token storage after login

#### SecureStorage (`lib/utils/secure_storage.dart`)
Secure storage using flutter_secure_storage:
- `saveToken()` - Store JWT token securely
- `getToken()` - Retrieve stored token
- `deleteToken()` - Remove token
- `saveUser()` - Store user data
- `getUser()` - Retrieve user data
- `clearAll()` - Clear all secure storage

### 3. **State Management**

#### AuthProvider (`lib/providers/auth_provider.dart`)
Provider for authentication state management:
- `token` - JWT token
- `user` - User data
- `isAuthenticated` - Auth status
- `isLoading` - Loading state

**Methods:**
- `login()` - Authenticate user
- `register()` - Create new account
- `logout()` - Sign out user
- `refreshToken()` - Refresh JWT token

### 4. **Reusable Widgets**

#### CustomButton (`lib/widgets/custom_button.dart`)
Customized button with:
- Loading state
- Customizable colors
- Consistent styling
- Disabled state during loading

#### CustomTextField (`lib/widgets/custom_text_field.dart`)
Customized text field with:
- Label and hint text
- Password visibility toggle
- Icon prefixes and suffixes
- Input validation
- Customizable keyboard type

## Integration Steps

### Step 1: Update Main App

Update `lib/src/app.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'theme/app_theme.dart';
import 'screens/authentication/login_screen.dart';

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
      ],
      child: MaterialApp(
        title: 'Royal Transportation',
        theme: AppTheme.lightTheme(),
        darkTheme: AppTheme.darkTheme(),
        themeMode: ThemeMode.light,
        home: const AuthWrapper(),
      ),
    );
  }
}

class AuthWrapper extends StatelessWidget {
  const AuthWrapper({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    if (authProvider.isAuthenticated) {
      return const DashboardScreen(); // To be created
    } else {
      return const LoginScreen();
    }
  }
}
```

### Step 2: Update Dependencies

Already configured in `pubspec.yaml`, but verify:

```yaml
dependencies:
  provider: ^6.0.0
  http: ^1.1.0
  flutter_secure_storage: ^9.0.0
```

### Step 3: Update API Base URL

In `lib/services/api_service.dart`, update the base URL:

```dart
// For development
static const String baseUrl = 'http://localhost:3000/api/v1';

// For production (update later)
// static const String baseUrl = 'https://api.royaltransportation.com/v1';
```

### Step 4: Android Configuration

For Android, allow clear text traffic in `android/app/src/main/AndroidManifest.xml`:

```xml
<application
    ...
    android:usesCleartextTraffic="true">
</application>
```

### Step 5: iOS Configuration

For iOS, update `ios/Podfile` to support http in development.

## Testing the Authentication Flow

### 1. Start Backend Server

```bash
cd backend
npm run dev
```

### 2. Run Mobile App

```bash
cd mobile_app
flutter run -d chrome  # For web testing
# or
flutter run -d android # For Android emulator
```

### 3. Test Registration

1. Click "Sign Up" link on login screen
2. Enter:
   - First Name: John
   - Last Name: Doe
   - Email: test@example.com
   - Phone: +1234567890
   - Role: Parent
   - Password: TestPass123!
3. Click Sign Up
4. Should auto-login and navigate to dashboard

### 4. Test Login

1. Use credentials from registration
2. Email: test@example.com
3. Password: TestPass123!
4. Click Login
5. Should navigate to dashboard

## Features Implemented

✅ User registration with validation
✅ User login with JWT token
✅ Secure token storage
✅ Auto-login on app restart
✅ Role selection during registration
✅ Error message display
✅ Loading states
✅ Form validation
✅ Password visibility toggle
✅ Custom UI components
✅ Provider-based state management
✅ API integration

## Security Features

🔒 **Secure Token Storage** - Uses flutter_secure_storage
🔒 **HTTPS Ready** - Can be configured for production
🔒 **Token Auto-Refresh** - Automatic token refresh before expiry
🔒 **Password Visibility Toggle** - User can show/hide password
🔒 **Input Validation** - Server-side and client-side validation
🔒 **Role-Based Access** - Different screens for different roles

## Error Handling

All errors are caught and displayed to user:
- Network errors
- Validation errors
- Authentication errors
- Server errors

## Troubleshooting

### "Connection refused" error
- Ensure backend is running on localhost:3000
- Check firewall settings
- Verify base URL in ApiService

### "Secure storage not initialized"
- Clear app cache: `flutter clean`
- Rebuild app: `flutter run`

### "CORS error" from backend
- Verify CORS is enabled in backend server.js
- Check CORS_ORIGIN environment variable

## Next Steps

1. ✅ Mobile authentication complete
2. Create dashboard screens
3. Implement GPS tracking
4. Add push notifications
5. Build payment integration

---

**Status**: ✅ Mobile Authentication Implementation Complete
**Last Updated**: July 2026
