import { executeQuery } from '../config/database.js';
import cloudinary from 'cloudinary';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Get All Doctors
export const getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await executeQuery(
      'SELECT d.id, d.specialization, d.experience_years, d.consultation_fee, d.rating, d.total_reviews, d.availability_status, u.name, u.phone, u.profile_image FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.status = ?',
      ['active']
    );

    res.json({ status: 'success', doctors });
  } catch (error) {
    next(error);
  }
};

// Get Doctor By ID
export const getDoctorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await executeQuery(
      'SELECT d.*, u.name, u.phone, u.profile_image FROM doctors d JOIN users u ON d.user_id = u.id WHERE d.id = ? AND u.status = ?',
      [id, 'active']
    );

    if (doctor.length === 0) {
      return next(new AppError('Doctor not found', 404));
    }

    res.json({ status: 'success', doctor: doctor[0] });
  } catch (error) {
    next(error);
  }
};

// Get Doctor Profile (Protected)
export const getDoctorProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await executeQuery(
      'SELECT d.*, u.name, u.email, u.phone, u.profile_image FROM doctors d JOIN users u ON d.user_id = u.id WHERE d.id = ?',
      [id]
    );

    if (doctor.length === 0) {
      return next(new AppError('Doctor profile not found', 404));
    }

    res.json({ status: 'success', doctor: doctor[0] });
  } catch (error) {
    next(error);
  }
};

// Update Doctor Profile (Protected)
export const updateDoctorProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { specialization, experience_years, consultation_fee, bio, availability_status, profileImage } = req.body;

    logger.info(`📤 [DOCTOR PROFILE] Updating info for doctor ID: ${id}`);

    // Handle profile image removal
    if (profileImage === 'DELETE') {
      const doctorInfo = await executeQuery('SELECT user_id FROM doctors WHERE id = ?', [id]);
      if (doctorInfo.length > 0) {
        await executeQuery('UPDATE users SET profile_image = NULL WHERE id = ?', [doctorInfo[0].user_id]);
        logger.info(`✅ [DOCTOR PROFILE] Profile image removed for doctor ID: ${id}`);
        return res.json({ status: 'success', message: 'Profile image removed' });
      }
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
        logger.error(`❌ [DOCTOR PROFILE] Cloudinary upload error: ${cloudErr.message}`);
        return next(new AppError('Profile image upload failed', 500));
      }
    }

    // Ensure safe parameters for SQL bind
    const safeSpecialization = specialization === undefined ? null : specialization;
    const safeExperience = experience_years === undefined ? null : experience_years;
    const safeFee = consultation_fee === undefined ? null : consultation_fee;
    const safeBio = bio === undefined ? null : bio;
    const safeAvailability = availability_status === undefined ? null : availability_status;

    const result = await executeQuery(
      'UPDATE doctors SET specialization = IFNULL(?, specialization), experience_years = IFNULL(?, experience_years), consultation_fee = IFNULL(?, consultation_fee), bio = IFNULL(?, bio), availability_status = IFNULL(?, availability_status) WHERE id = ?',
      [safeSpecialization, safeExperience, safeFee, safeBio, safeAvailability, id]
    );

    // Update profile image in users table if uploaded
    if (profileImageUrl) {
      const doctor = await executeQuery('SELECT user_id FROM doctors WHERE id = ?', [id]);
      if (doctor.length > 0) {
        await executeQuery('UPDATE users SET profile_image = ? WHERE id = ?', [profileImageUrl, doctor[0].user_id]);
      }
    }

    if (result.affectedRows === 0) {
      return next(new AppError('Doctor not found', 404));
    }

    logger.info(`✅ [DOCTOR PROFILE] Information updated for doctor ID: ${id}`);
    res.json({ status: 'success', message: 'Doctor profile updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Get Doctors By Specialization
export const getDoctorsBySpecialization = async (req, res, next) => {
  try {
    const { specialization } = req.params;
    const doctors = await executeQuery(
      'SELECT d.id, d.specialization, d.experience_years, d.consultation_fee, d.rating, d.total_reviews, u.name, u.phone FROM doctors d JOIN users u ON d.user_id = u.id WHERE d.specialization = ? AND u.status = ?',
      [specialization, 'active']
    );

    res.json({ status: 'success', doctors });
  } catch (error) {
    next(error);
  }
};

// Get Doctor Reviews
export const getDoctorReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reviews = await executeQuery(
      'SELECT r.*, u.name as patient_name FROM reviews r JOIN users u ON r.patient_id = u.id WHERE r.doctor_id = ? ORDER BY r.created_at DESC',
      [id]
    );

    res.json({ status: 'success', reviews });
  } catch (error) {
    next(error);
  }
};

// Get Current Doctor Profile (Protected)
export const getCurrentDoctorProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let doctor = await executeQuery(
      'SELECT d.*, u.name, u.email, u.phone, u.profile_image FROM doctors d JOIN users u ON d.user_id = u.id WHERE d.user_id = ?',
      [userId]
    );

    if (doctor.length === 0) {
      logger.warn(`⚠️ [DOCTOR] Auto-creating missing doctor record for user: ${userId}`);
      await executeQuery(
        'INSERT INTO doctors (user_id, specialization, license_number, experience_years, consultation_fee) VALUES (?, ?, ?, ?, ?)',
        [userId, 'General Physician', `LIC-${Date.now()}`, 0, 50]
      );
      doctor = await executeQuery(
        'SELECT d.*, u.name, u.email, u.phone, u.profile_image FROM doctors d JOIN users u ON d.user_id = u.id WHERE d.user_id = ?',
        [userId]
      );
    }

    res.json({ status: 'success', ...doctor[0] });
  } catch (error) {
    next(error);
  }
};

// Update doctor settings (theme, notifications, etc.)
export const updateDoctorSettings = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { theme } = req.body;

    logger.info(`📤 [DOCTOR SETTINGS] Updating settings for user ID: ${id}`);

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

    logger.info(`✅ [DOCTOR SETTINGS] Theme updated for user ID: ${id}`);
    res.json({
      status: 'success',
      message: 'Settings updated successfully',
      theme
    });
  } catch (error) {
    next(error);
  }
};

// Delete doctor (Admin only)
export const deleteDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.user;

    if (role !== 'admin') {
      return next(new AppError('Access denied: Admin only', 403));
    }

    logger.info(`🗑️ [ADMIN] Attempting to delete doctor record: ${id}`);

    const doctor = await executeQuery('SELECT user_id FROM doctors WHERE id = ?', [id]);
    if (doctor.length === 0) {
      return next(new AppError('Doctor not found', 404));
    }

    const userId = doctor[0].user_id;

    // Delete doctor record and associated user
    await executeQuery('DELETE FROM doctors WHERE id = ?', [id]);
    await executeQuery('DELETE FROM users WHERE id = ?', [userId]);

    logger.info(`✅ [ADMIN] Doctor ${id} and user ${userId} deleted successfully`);
    res.json({ status: 'success', message: 'Doctor deleted successfully' });
  } catch (error) {
    next(error);
  }
};
