const AuthService = require('../services/authService');
const logger = require('../utils/logger');

class AuthController {
  // Register controller
  static async register(req, res) {
    try {
      const { email, password, phone, firstName, lastName, role } = req.body;

      const user = await AuthService.registerUser({
        email,
        password,
        phone,
        firstName,
        lastName,
        role
      });

      res.status(201).json({
        success: true,
        data: user,
        message: 'User registered successfully'
      });
    } catch (error) {
      logger.error('Register controller error:', error);
      res.status(400).json({
        success: false,
        error: 'REGISTRATION_ERROR',
        message: error.message
      });
    }
  }

  // Login controller
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const result = await AuthService.loginUser(email, password);

      res.json({
        success: true,
        data: result,
        message: 'Login successful'
      });
    } catch (error) {
      logger.error('Login controller error:', error);
      res.status(401).json({
        success: false,
        error: 'LOGIN_ERROR',
        message: error.message
      });
    }
  }

  // Verify OTP controller
  static async verifyOTP(req, res) {
    try {
      const { phone, otp } = req.body;

      await AuthService.verifyOTP(phone, otp);

      // Generate token for verified phone
      const user = await db.collection('users')
        .where('phone', '==', phone)
        .limit(1)
        .get();

      if (user.empty) {
        throw new Error('User not found');
      }

      const userData = user.docs[0].data();
      const token = AuthService.generateToken(userData);

      res.json({
        success: true,
        data: {
          token: token,
          user: userData
        },
        message: 'OTP verified successfully'
      });
    } catch (error) {
      logger.error('OTP verification controller error:', error);
      res.status(400).json({
        success: false,
        error: 'OTP_VERIFICATION_ERROR',
        message: error.message
      });
    }
  }

  // Refresh token controller
  static async refreshToken(req, res) {
    try {
      const { userId } = req.user;

      const user = await AuthService.getUserById(userId);
      const newToken = AuthService.generateToken(user);

      res.json({
        success: true,
        data: {
          token: newToken
        },
        message: 'Token refreshed successfully'
      });
    } catch (error) {
      logger.error('Refresh token controller error:', error);
      res.status(401).json({
        success: false,
        error: 'TOKEN_REFRESH_ERROR',
        message: error.message
      });
    }
  }

  // Logout controller
  static async logout(req, res) {
    try {
      // Token invalidation could be handled with a blacklist or Redis
      // For now, client-side token removal is sufficient
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      logger.error('Logout controller error:', error);
      res.status(400).json({
        success: false,
        error: 'LOGOUT_ERROR',
        message: error.message
      });
    }
  }
}

module.exports = AuthController;
