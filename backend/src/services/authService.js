const { db, auth } = require('../config/firebase');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

class AuthService {
  // Generate JWT token
  static generateToken(user) {
    return jwt.sign(
      {
        userId: user.userId,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );
  }

  // Register new user
  static async registerUser(userData) {
    try {
      const { email, password, phone, firstName, lastName, role } = userData;

      // Check if user already exists
      const existingUser = await db.collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();

      if (!existingUser.empty) {
        throw new Error('User with this email already exists');
      }

      // Create Firebase Auth user
      const firebaseUser = await auth.createUser({
        email: email,
        password: password,
        displayName: `${firstName} ${lastName}`
      });

      // Store user data in Firestore
      const userData_db = {
        userId: firebaseUser.uid,
        email: email,
        phone: phone,
        firstName: firstName,
        lastName: lastName,
        role: role,
        profileImage: null,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await db.collection('users').doc(firebaseUser.uid).set(userData_db);

      logger.info(`New user registered: ${email}`);

      return {
        userId: firebaseUser.uid,
        email: email,
        role: role,
        createdAt: userData_db.createdAt
      };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  static async loginUser(email, password) {
    try {
      // Verify password with Firebase
      // Note: This is a simplified approach. In production, use Firebase REST API
      const userQuery = await db.collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();

      if (userQuery.empty) {
        throw new Error('User not found');
      }

      const userData = userQuery.docs[0].data();

      // Generate JWT token
      const token = this.generateToken(userData);

      logger.info(`User logged in: ${email}`);

      return {
        token: token,
        user: {
          userId: userData.userId,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          profileImage: userData.profileImage
        }
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  // Get user by ID
  static async getUserById(userId) {
    try {
      const userDoc = await db.collection('users').doc(userId).get();

      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      return userDoc.data();
    } catch (error) {
      logger.error('Get user error:', error);
      throw error;
    }
  }

  // Update user
  static async updateUser(userId, updateData) {
    try {
      updateData.updatedAt = new Date().toISOString();

      await db.collection('users').doc(userId).update(updateData);

      logger.info(`User updated: ${userId}`);

      return await this.getUserById(userId);
    } catch (error) {
      logger.error('Update user error:', error);
      throw error;
    }
  }

  // Verify OTP (mock implementation)
  static async verifyOTP(phone, otp) {
    try {
      // In production, verify with Twilio or similar service
      // For now, this is a mock implementation
      if (otp.length !== 6 || isNaN(otp)) {
        throw new Error('Invalid OTP format');
      }

      logger.info(`OTP verified for phone: ${phone}`);

      return true;
    } catch (error) {
      logger.error('OTP verification error:', error);
      throw error;
    }
  }
}

module.exports = AuthService;
