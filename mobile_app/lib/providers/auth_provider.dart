import 'dart:async';

import 'package:flutter/foundation.dart';
import '../services/auth_service.dart';
import '../services/notification_service.dart';

class AuthProvider extends ChangeNotifier {
  AuthProvider({
    required AuthService authService,
    required NotificationService notificationService,
  })  : _authService = authService,
        _notificationService = notificationService {
    _authSubscription = _authService.authStateChanges.listen((_) {
      notifyListeners();
    });
  }

  final AuthService _authService;
  final NotificationService _notificationService;
  StreamSubscription? _authSubscription;

  bool get isLoggedIn => _authService.isLoggedIn;

  Future<void> initialize() => _notificationService.initialize();

  @override
  void dispose() {
    _authSubscription?.cancel();
    super.dispose();
  }
}
