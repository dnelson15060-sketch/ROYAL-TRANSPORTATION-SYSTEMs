import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'config/app_routes.dart';
import 'providers/auth_provider.dart';
import 'screens/auth/login_screen.dart';
import 'services/auth_service.dart';
import 'services/notification_service.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  var firebaseReady = true;
  try {
    await Firebase.initializeApp();
  } catch (_) {
    firebaseReady = false;
  }

  runApp(RoyalTransportationApp(firebaseReady: firebaseReady));
}

class RoyalTransportationApp extends StatelessWidget {
  const RoyalTransportationApp({
    super.key,
    required this.firebaseReady,
  });

  final bool firebaseReady;

  @override
  Widget build(BuildContext context) {
    if (!firebaseReady) {
      return const MaterialApp(
        home: Scaffold(
          body: Center(
            child: Text('Firebase configuration required'),
          ),
        ),
      );
    }

    return ChangeNotifierProvider(
      create: (_) => AuthProvider(
        authService: AuthService(),
        notificationService: NotificationService(),
      ),
      child: MaterialApp(
        title: 'Royal Transportation',
        routes: {
          AppRoutes.login: (_) => const LoginScreen(),
          AppRoutes.register: (_) => const Scaffold(
                body: Center(child: Text('Register')),
              ),
        },
        initialRoute: AppRoutes.login,
      ),
    );
  }
}
