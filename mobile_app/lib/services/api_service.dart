import 'package:http/http.dart' as http;
import 'dart:convert';
import '../utils/secure_storage.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:3000/api/v1';
  static const String contentType = 'application/json';

  static Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String phone,
    required String firstName,
    required String lastName,
    required String role,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/register'),
        headers: {
          'Content-Type': contentType,
        },
        body: jsonEncode({
          'email': email,
          'password': password,
          'phone': phone,
          'firstName': firstName,
          'lastName': lastName,
          'role': role,
        }),
      );

      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        throw Exception(jsonDecode(response.body)['message'] ?? 'Registration failed');
      }
    } catch (e) {
      throw Exception('Registration error: $e');
    }
  }

  static Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {
          'Content-Type': contentType,
        },
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        final result = jsonDecode(response.body);
        // Store token securely
        await SecureStorage.saveToken(result['data']['token']);
        return result;
      } else {
        throw Exception(jsonDecode(response.body)['message'] ?? 'Login failed');
      }
    } catch (e) {
      throw Exception('Login error: $e');
    }
  }

  static Future<Map<String, dynamic>> refreshToken() async {
    try {
      final token = await SecureStorage.getToken();
      if (token == null) {
        throw Exception('No token found');
      }

      final response = await http.post(
        Uri.parse('$baseUrl/auth/refresh-token'),
        headers: {
          'Content-Type': contentType,
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final result = jsonDecode(response.body);
        await SecureStorage.saveToken(result['data']['token']);
        return result;
      } else {
        throw Exception('Token refresh failed');
      }
    } catch (e) {
      throw Exception('Token refresh error: $e');
    }
  }

  static Future<void> logout() async {
    try {
      final token = await SecureStorage.getToken();
      if (token != null) {
        await http.post(
          Uri.parse('$baseUrl/auth/logout'),
          headers: {
            'Content-Type': contentType,
            'Authorization': 'Bearer $token',
          },
        );
      }
      await SecureStorage.deleteToken();
    } catch (e) {
      throw Exception('Logout error: $e');
    }
  }
}
