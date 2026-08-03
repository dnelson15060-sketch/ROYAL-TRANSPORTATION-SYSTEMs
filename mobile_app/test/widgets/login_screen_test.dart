import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:provider/provider.dart';
import 'package:royal_transportation/config/app_routes.dart';
import 'package:royal_transportation/providers/auth_provider.dart';
import 'package:royal_transportation/screens/auth/login_screen.dart';
import 'package:royal_transportation/services/auth_service.dart';
import 'package:royal_transportation/services/notification_service.dart';

class MockAuthService extends Mock implements AuthService {
  @override
  Stream<User?> get authStateChanges => const Stream.empty();
}

class MockNotificationService extends Mock implements NotificationService {}

Widget _wrapWithProviders(Widget child) {
  final authProvider = AuthProvider(
    authService: MockAuthService(),
    notificationService: MockNotificationService(),
  );

  return ChangeNotifierProvider<AuthProvider>.value(
    value: authProvider,
    child: MaterialApp(
      home: child,
      routes: {
        AppRoutes.register: (_) => const Scaffold(body: Text('Register')),
      },
    ),
  );
}

void main() {
  testWidgets('LoginScreen renders email and password fields',
      (tester) async {
    await tester.pumpWidget(_wrapWithProviders(const LoginScreen()));

    expect(find.byKey(const Key('emailField')), findsOneWidget);
    expect(find.byKey(const Key('passwordField')), findsOneWidget);
    expect(find.byKey(const Key('loginButton')), findsOneWidget);
  });

  testWidgets('submit button is disabled when fields are empty',
      (tester) async {
    await tester.pumpWidget(_wrapWithProviders(const LoginScreen()));

    final buttonFinder = find.descendant(
      of: find.byKey(const Key('loginButton')),
      matching: find.byType(ElevatedButton),
    );
    ElevatedButton button = tester.widget(buttonFinder);
    expect(button.onPressed, isNull);

    await tester.enterText(
      find.byKey(const Key('emailField')),
      'parent@example.com',
    );
    await tester.enterText(
      find.byKey(const Key('passwordField')),
      'password123',
    );
    await tester.pump();

    button = tester.widget(buttonFinder);
    expect(button.onPressed, isNotNull);
  });
}
