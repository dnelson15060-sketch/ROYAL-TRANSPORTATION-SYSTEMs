import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/colors.dart';
import '../../core/constants/dimensions.dart';
import '../../core/constants/strings.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_text_field.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({Key? key}) : super(key: key);

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  late TextEditingController _firstNameController;
  late TextEditingController _lastNameController;
  late TextEditingController _emailController;
  late TextEditingController _phoneController;
  late TextEditingController _passwordController;
  late TextEditingController _confirmPasswordController;
  String? _selectedRole;
  bool _isLoading = false;
  String? _errorMessage;

  final List<String> roles = ['parent', 'driver'];

  @override
  void initState() {
    super.initState();
    _firstNameController = TextEditingController();
    _lastNameController = TextEditingController();
    _emailController = TextEditingController();
    _phoneController = TextEditingController();
    _passwordController = TextEditingController();
    _confirmPasswordController = TextEditingController();
    _selectedRole = 'parent';
  }

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _handleRegister() async {
    if (_firstNameController.text.isEmpty ||
        _lastNameController.text.isEmpty ||
        _emailController.text.isEmpty ||
        _phoneController.text.isEmpty ||
        _passwordController.text.isEmpty ||
        _confirmPasswordController.text.isEmpty) {
      setState(() {
        _errorMessage = 'Please fill all fields';
      });
      return;
    }

    if (_passwordController.text != _confirmPasswordController.text) {
      setState(() {
        _errorMessage = 'Passwords do not match';
      });
      return;
    }

    if (_passwordController.text.length < 8) {
      setState(() {
        _errorMessage = 'Password must be at least 8 characters';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      await authProvider.register(
        email: _emailController.text,
        password: _passwordController.text,
        phone: _phoneController.text,
        firstName: _firstNameController.text,
        lastName: _lastNameController.text,
        role: _selectedRole ?? 'parent',
      );

      if (mounted) {
        Navigator.of(context).pushReplacementNamed('/home');
      }
    } catch (error) {
      setState(() {
        _errorMessage = error.toString();
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(
        title: const Text('Create Account'),
        backgroundColor: AppColors.royalBlue,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppDimensions.md),
          child: Column(
            children: [
              SizedBox(height: AppDimensions.lg),
              // Error Message
              if (_errorMessage != null)
                Container(
                  padding: const EdgeInsets.all(AppDimensions.md),
                  decoration: BoxDecoration(
                    color: AppColors.error.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
                    border: Border.all(color: AppColors.error),
                  ),
                  child: Text(
                    _errorMessage!,
                    style: const TextStyle(color: AppColors.error),
                  ),
                ),
              SizedBox(height: AppDimensions.lg),
              // First Name
              CustomTextField(
                controller: _firstNameController,
                label: 'First Name',
                hintText: 'John',
                prefixIcon: Icons.person_outlined,
              ),
              SizedBox(height: AppDimensions.md),
              // Last Name
              CustomTextField(
                controller: _lastNameController,
                label: 'Last Name',
                hintText: 'Doe',
                prefixIcon: Icons.person_outlined,
              ),
              SizedBox(height: AppDimensions.md),
              // Email
              CustomTextField(
                controller: _emailController,
                label: AppStrings.email,
                hintText: 'user@example.com',
                keyboardType: TextInputType.emailAddress,
                prefixIcon: Icons.email_outlined,
              ),
              SizedBox(height: AppDimensions.md),
              // Phone
              CustomTextField(
                controller: _phoneController,
                label: 'Phone Number',
                hintText: '+1234567890',
                keyboardType: TextInputType.phone,
                prefixIcon: Icons.phone_outlined,
              ),
              SizedBox(height: AppDimensions.md),
              // Role Selection
              DropdownButtonFormField<String>(
                value: _selectedRole,
                decoration: InputDecoration(
                  labelText: 'Account Type',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
                  ),
                  prefixIcon: const Icon(Icons.person_add_outlined),
                ),
                items: roles.map((String role) {
                  return DropdownMenuItem<String>(
                    value: role,
                    child: Text(role.toUpperCase()),
                  );
                }).toList(),
                onChanged: (String? newValue) {
                  setState(() {
                    _selectedRole = newValue;
                  });
                },
              ),
              SizedBox(height: AppDimensions.md),
              // Password
              CustomTextField(
                controller: _passwordController,
                label: AppStrings.password,
                hintText: 'Enter your password',
                obscureText: true,
                prefixIcon: Icons.lock_outlined,
              ),
              SizedBox(height: AppDimensions.md),
              // Confirm Password
              CustomTextField(
                controller: _confirmPasswordController,
                label: 'Confirm Password',
                hintText: 'Confirm your password',
                obscureText: true,
                prefixIcon: Icons.lock_outlined,
              ),
              SizedBox(height: AppDimensions.lg),
              // Register Button
              CustomButton(
                text: AppStrings.signup,
                isLoading: _isLoading,
                onPressed: _handleRegister,
              ),
              SizedBox(height: AppDimensions.md),
              // Login Link
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    AppStrings.alreadyHaveAccount,
                    style: TextStyle(color: AppColors.grey),
                  ),
                  TextButton(
                    onPressed: () {
                      Navigator.of(context).pop();
                    },
                    child: const Text(
                      AppStrings.login,
                      style: TextStyle(
                        color: AppColors.royalBlue,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(height: AppDimensions.lg),
            ],
          ),
        ),
      ),
    );
  }
}
