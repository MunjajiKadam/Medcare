import { executeQuery } from '../config/database.js';
import cloudinary from 'cloudinary';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Get all patients
export const getAllPatients = async (req, res, next) => {
  try {
    const { role } = req.user;

    if (role !== 'admin') {
      return next(new AppError('Access denied: Admin only', 403));
    }

    const patients = await executeQuery(
      'SELECT p.*, u.name, u.email, u.phone FROM patients p JOIN users u ON p.user_id = u.id'
    );

    res.json({ status: 'success', patients });
  } catch (error) {
    next(error);
  }
};

// Get patient by ID
export const getPatientById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = await executeQuery(
      'SELECT p.*, u.name, u.email, u.phone FROM patients p JOIN users u ON p.user_id = u.id WHERE p.id = ?',
      [id]
    );

    if (patient.length === 0) {
      return next(new AppError('Patient not found', 404));
    }

    res.json({ status: 'success', patient: patient[0] });
  } catch (error) {
    next(error);
  }
};

// Get patient profile (protected - own profile)
export const getPatientProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    const patient = await executeQuery(
      'SELECT p.*, u.name, u.email, u.phone, u.profile_image FROM patients p JOIN users u ON p.user_id = u.id WHERE p.user_id = ?',
      [id]
    );

    if (patient.length === 0) {
      return next(new AppError('Patient profile not found', 404));
    }

    res.json({ status: 'success', patient: patient[0] });
  } catch (error) {
    next(error);
  }
};

// Update patient profile
export const updatePatientProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { blood_type, date_of_birth, gender, medical_history, allergies, emergency_contact, emergency_phone } = req.body;

    logger.info(`📤 [PATIENT PROFILE] Updating health info for user_id: ${id}`);

    const result = await executeQuery(
      'UPDATE patients SET blood_type = ?, date_of_birth = ?, gender = ?, medical_history = ?, allergies = ?, emergency_contact = ?, emergency_phone = ? WHERE user_id = ?',
      [blood_type, date_of_birth, gender, medical_history, allergies, emergency_contact, emergency_phone, id]
    );

    if (result.affectedRows === 0) {
      return next(new AppError('Patient profile not found', 404));
    }

    logger.info(`✅ [PATIENT PROFILE] Health info updated for user_id: ${id}`);
    res.json({ status: 'success', message: 'Patient profile updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Update personal info (name, email, phone)
export const updatePersonalInfo = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { name, email, phone, profileImage } = req.body;

    logger.info(`📤 [PERSONAL INFO] Updating info for user_id: ${id}`);

    // Check if email already exists for another user
    if (email) {
      const existingUser = await executeQuery(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, id]
      );
      if (existingUser.length > 0) {
        return next(new AppError('Email already in use by another account', 400));
      }
    }

    // Handle profile image deletion
    if (profileImage === 'DELETE') {
      const delRes = await executeQuery('UPDATE users SET profile_image = NULL WHERE id = ?', [id]);
      if (delRes.affectedRows === 0) return next(new AppError('User not found', 404));
      return res.json({ status: 'success', message: 'Profile image removed' });
    }

    // Upload profile image to Cloudinary if provided
    let profileImageUrl = null;
    if (profileImage) {
      try {
        const uploadResult = await cloudinary.v2.uploader.upload(profileImage, {
          folder: 'medcare/profiles',
          resource_type: 'image'
        });
        profileImageUrl = uploadResult.secure_url;
      } catch (cloudErr) {
        logger.error(`❌ [PATIENT PROFILE] Cloudinary upload error: ${cloudErr.message}`);
        return next(new AppError('Profile image upload failed', 500));
      }
    }

    const result = await executeQuery(
      'UPDATE users SET name = ?, email = ?, phone = ?, profile_image = IFNULL(?, profile_image) WHERE id = ?',
      [name, email, phone, profileImageUrl, id]
    );

    if (result.affectedRows === 0) {
      return next(new AppError('User not found', 404));
    }

    logger.info(`✅ [PERSONAL INFO] Information updated for user_id: ${id}`);
    res.json({ status: 'success', message: 'Personal information updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Update user settings (theme, notifications, etc.)
export const updateSettings = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { theme } = req.body;

    logger.info(`📤 [SETTINGS] Updating settings for user_id: ${id}`);

    const validThemes = ['light', 'dark', 'auto'];
    if (theme && !validThemes.includes(theme)) {
      return next(new AppError('Invalid theme value. Must be light, dark, or auto', 400));
    }

    const result = await executeQuery(
      'UPDATE users SET theme_preference = ? WHERE id = ?',
      [theme, id]
    );

    if (result.affectedRows === 0) {
      return next(new AppError('User not found', 404));
    }

    logger.info(`✅ [SETTINGS] Theme preference updated for user_id: ${id}`);
    res.json({
      status: 'success',
      message: 'Settings updated successfully',
      theme
    });
  } catch (error) {
    next(error);
  }
};

// Delete patient
export const deletePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.user;

    if (role !== 'admin') {
      return next(new AppError('Access denied: Admin only', 403));
    }

    const patient = await executeQuery('SELECT user_id FROM patients WHERE id = ?', [id]);
    if (patient.length === 0) {
      return next(new AppError('Patient not found', 404));
    }

    // Cascade delete is assumed to be handled by DB, but we delete the user account which should trigger it
    const userId = patient[0].user_id;
    const result = await executeQuery('DELETE FROM patients WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return next(new AppError('Patient not found', 404));
    }

    await executeQuery('DELETE FROM users WHERE id = ?', [userId]);

    logger.info(`🗑️ [ADMIN] Patient ${id} and associated user ${userId} deleted`);
    res.json({ status: 'success', message: 'Patient deleted successfully' });
  } catch (error) {
    next(error);
  }
};
