import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/colors.dart';
import '../../core/constants/dimensions.dart';
import '../../core/constants/strings.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_text_field.dart';
import 'register_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  late TextEditingController _emailController;
  late TextEditingController _passwordController;
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _emailController = TextEditingController();
    _passwordController = TextEditingController();
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleLogin() async {
    if (_emailController.text.isEmpty || _passwordController.text.isEmpty) {
      setState(() {
        _errorMessage = 'Please fill all fields';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      await authProvider.login(
        _emailController.text,
        _passwordController.text,
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
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppDimensions.md),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              SizedBox(height: MediaQuery.of(context).size.height * 0.1),
              // Logo
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  color: AppColors.royalBlue,
                  borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
                ),
                child: const Center(
                  child: Text(
                    '🚌',
                    style: TextStyle(fontSize: 50),
                  ),
                ),
              ),
              SizedBox(height: AppDimensions.lg),
              // Title
              const Text(
                'Royal Transportation',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: AppColors.royalBlue,
                ),
              ),
              SizedBox(height: AppDimensions.sm),
              const Text(
                'Welcome Back',
                style: TextStyle(
                  fontSize: 16,
                  color: AppColors.grey,
                ),
              ),
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
              // Email Field
              CustomTextField(
                controller: _emailController,
                label: AppStrings.email,
                hintText: 'user@example.com',
                keyboardType: TextInputType.emailAddress,
                prefixIcon: Icons.email_outlined,
              ),
              SizedBox(height: AppDimensions.md),
              // Password Field
              CustomTextField(
                controller: _passwordController,
                label: AppStrings.password,
                hintText: 'Enter your password',
                obscureText: true,
                prefixIcon: Icons.lock_outlined,
              ),
              SizedBox(height: AppDimensions.sm),
              // Forgot Password
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () {
                    // Navigate to forgot password screen
                  },
                  child: const Text(
                    AppStrings.forgotPassword,
                    style: TextStyle(color: AppColors.royalBlue),
                  ),
                ),
              ),
              SizedBox(height: AppDimensions.lg),
              // Login Button
              CustomButton(
                text: AppStrings.login,
                isLoading: _isLoading,
                onPressed: _handleLogin,
              ),
              SizedBox(height: AppDimensions.md),
              // Sign Up Link
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    AppStrings.dontHaveAccount,
                    style: const TextStyle(color: AppColors.grey),
                  ),
                  TextButton(
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (context) => const RegisterScreen(),
                        ),
                      );
                    },
                    child: const Text(
                      AppStrings.signup,
                      style: TextStyle(
                        color: AppColors.royalBlue,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
