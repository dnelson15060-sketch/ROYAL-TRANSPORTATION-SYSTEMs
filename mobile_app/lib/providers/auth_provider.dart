import 'package:flutter/material.dart';
import 'dart:convert';
import '../services/api_service.dart';
import '../utils/secure_storage.dart';

class AuthProvider with ChangeNotifier {
  String? _token;
  Map<String, dynamic>? _user;
  bool _isAuthenticated = false;
  bool _isLoading = false;

  // Getters
  String? get token => _token;
  Map<String, dynamic>? get user => _user;
  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;

  // Constructor - check if user is already logged in
  AuthProvider() {
    _checkAuthStatus();
  }

  Future<void> _checkAuthStatus() async {
    _token = await SecureStorage.getToken();
    if (_token != null) {
      _isAuthenticated = true;
      notifyListeners();
    }
  }

  // Register
  Future<void> register({
    required String email,
    required String password,
    required String phone,
    required String firstName,
    required String lastName,
    required String role,
  }) async {
    try {
      _isLoading = true;
      notifyListeners();

      final result = await ApiService.register(
        email: email,
        password: password,
        phone: phone,
        firstName: firstName,
        lastName: lastName,
        role: role,
      );

      // After registration, auto-login
      await login(email, password);
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      throw Exception('Registration failed: $e');
    }
  }

  // Login
  Future<void> login(String email, String password) async {
    try {
      _isLoading = true;
      notifyListeners();

      final result = await ApiService.login(
        email: email,
        password: password,
      );

      _token = result['data']['token'];
      _user = result['data']['user'];
      _isAuthenticated = true;
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _isLoading = false;
      _isAuthenticated = false;
      notifyListeners();
      throw Exception('Login failed: $e');
    }
  }

  // Logout
  Future<void> logout() async {
    try {
      _isLoading = true;
      notifyListeners();

      await ApiService.logout();

      _token = null;
      _user = null;
      _isAuthenticated = false;
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      throw Exception('Logout failed: $e');
    }
  }

  // Refresh token
  Future<void> refreshToken() async {
    try {
      final result = await ApiService.refreshToken();
      _token = result['data']['token'];
      notifyListeners();
    } catch (e) {
      _isAuthenticated = false;
      _token = null;
      notifyListeners();
      throw Exception('Token refresh failed: $e');
    }
  }
}
