import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { executeQuery } from '../config/database.js';
import cloudinary from 'cloudinary';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Register User
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, specialization, experienceYears, consultationFee, licenseNumber, profileImage } = req.body;
    logger.info(`📝 [REGISTER] New registration attempt: ${email} as ${role}`);

    // Validation
    if (!name || !email || !password || !role) {
      return next(new AppError('All fields are required', 400));
    }

    // Doctor-specific validation
    if (role === 'doctor') {
      if (!specialization || !licenseNumber || !experienceYears || !consultationFee) {
        return next(new AppError('All doctor fields are required (specialization, license number, experience, and consultation fee)', 400));
      }
    }

    // Check if user already exists
    const existingUser = await executeQuery('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return next(new AppError('User already exists', 400));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // If profileImage is a URL (from frontend), use it directly. If it's a file, upload to Cloudinary.
    let profileImageUrl = null;
    if (profileImage) {
      if (typeof profileImage === 'string' && (profileImage.startsWith('http://') || profileImage.startsWith('https://'))) {
        profileImageUrl = profileImage;
      } else {
        try {
          const uploadResult = await cloudinary.v2.uploader.upload(profileImage, {
            folder: 'medcare/profiles',
            resource_type: 'image'
          });
          profileImageUrl = uploadResult.secure_url;
        } catch (cloudErr) {
          logger.error(`❌ [REGISTER] Cloudinary upload error: ${cloudErr.message}`);
          return next(new AppError('Profile image upload failed', 500));
        }
      }
    }

    // Create user
    const result = await executeQuery(
      'INSERT INTO users (name, email, password, role, profile_image) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, profileImageUrl]
    );

    const userId = result.insertId;

    // Create role-specific record
    if (role === 'patient') {
      await executeQuery('INSERT INTO patients (user_id) VALUES (?)', [userId]);
    } else if (role === 'doctor') {
      await executeQuery(
        'INSERT INTO doctors (user_id, specialization, experience_years, consultation_fee, license_number) VALUES (?, ?, ?, ?, ?)',
        [userId, specialization, experienceYears, consultationFee, licenseNumber]
      );
    }

    // Generate token
    const token = jwt.sign(
      { id: userId, email, role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    logger.info(`✅ [REGISTER] User registered successfully: ${email}`);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      token,
      user: { id: userId, name, email, role, profile_image: profileImageUrl, theme: 'light' }
    });
  } catch (error) {
    next(error);
  }
};

// Login User
export const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    logger.info(`🔐 [LOGIN] Attempting login: ${email} as ${role}`);

    // Validation
    if (!email || !password || !role) {
      return next(new AppError('Email, password, and role are required', 400));
    }

    // Find user by email and role
    const user = await executeQuery('SELECT * FROM users WHERE email = ? AND role = ?', [email, role]);

    if (user.length === 0) {
      logger.warn(`❌ [LOGIN] User not found: ${email}`);
      return next(new AppError('Invalid credentials', 401));
    }

    const userData = user[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      logger.warn(`❌ [LOGIN] Invalid password for: ${email}`);
      return next(new AppError('Invalid credentials', 401));
    }

    // Check user status
    if (userData.status !== 'active') {
      logger.warn(`❌ [LOGIN] Inactive account access attempt: ${email}`);
      return next(new AppError('User account is not active', 403));
    }

    // Role-specific record sync (auto-repairing missing records)
    if (role === 'doctor') {
      const doctorCheck = await executeQuery('SELECT id FROM doctors WHERE user_id = ?', [userData.id]);
      if (doctorCheck.length === 0) {
        logger.warn(`⚠️ [LOGIN] Missing doctor record for user: ${userData.id}. Auto-creating...`);
        await executeQuery(
          'INSERT INTO doctors (user_id, specialization, license_number, experience_years, consultation_fee) VALUES (?, ?, ?, ?, ?)',
          [userData.id, 'General Physician', `LIC-${userData.id}-${Date.now()}`, 0, 50.00]
        );
      }
    } else if (role === 'patient') {
      const patientCheck = await executeQuery('SELECT id FROM patients WHERE user_id = ?', [userData.id]);
      if (patientCheck.length === 0) {
        logger.warn(`⚠️ [LOGIN] Missing patient record for user: ${userData.id}. Auto-creating...`);
        await executeQuery('INSERT INTO patients (user_id) VALUES (?)', [userData.id]);
      }
    }

    // Generate token
    const token = jwt.sign(
      { id: userData.id, email: userData.email, role: userData.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    logger.info(`✅ [LOGIN] Successful login: ${email}`);

    res.json({
      status: 'success',
      message: 'Login successful',
      token,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        profile_image: userData.profile_image || null,
        phone: userData.phone,
        theme: userData.theme_preference || 'light'
      }
    });
  } catch (error) {
    next(error);
  }
};

// Logout User
export const logout = (req, res) => {
  res.json({ status: 'success', message: 'Logout successful' });
};

// Change Password
export const changePassword = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return next(new AppError('All fields are required', 400));
    }

    if (newPassword !== confirmPassword) {
      return next(new AppError('New passwords do not match', 400));
    }

    if (newPassword.length < 6) {
      return next(new AppError('Password must be at least 6 characters', 400));
    }

    const user = await executeQuery('SELECT password FROM users WHERE id = ?', [id]);
    if (user.length === 0) {
      return next(new AppError('User not found', 404));
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user[0].password);
    if (!isPasswordValid) {
      return next(new AppError('Current password is incorrect', 401));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await executeQuery('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);

    logger.info(`🔐 [PASSWORD] User ${id} changed password successfully`);
    res.json({ status: 'success', message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};
