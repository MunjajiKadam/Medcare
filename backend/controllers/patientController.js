import dotenv from 'dotenv';
dotenv.config();
import { executeQuery } from '../config/database.js';
import cloudinary from 'cloudinary';
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Get all patients
export const getAllPatients = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admin only' });
    }

    const patients = await executeQuery(
      'SELECT p.*, u.name, u.email, u.phone FROM patients p JOIN users u ON p.user_id = u.id'
    );

    res.json({ patients });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get patient by ID
export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await executeQuery(
      'SELECT p.*, u.name, u.email, u.phone FROM patients p JOIN users u ON p.user_id = u.id WHERE p.id = ?',
      [id]
    );

    if (patient.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ patient: patient[0] });
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get patient profile (protected - own profile)
export const getPatientProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const patient = await executeQuery(
      'SELECT p.*, u.name, u.email, u.phone, u.profile_image FROM patients p JOIN users u ON p.user_id = u.id WHERE p.user_id = ?',
      [id]
    );

    if (patient.length === 0) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    res.json({ patient: patient[0] });
  } catch (error) {
    console.error('Get patient profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update patient profile
export const updatePatientProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const { blood_type, date_of_birth, gender, medical_history, allergies, emergency_contact, emergency_phone } = req.body;

    console.log("📤 [PATIENT PROFILE] Updating health info for user_id:", id);
    console.log("📊 [PATIENT PROFILE] Health data:", { blood_type, date_of_birth, gender, medical_history, allergies, emergency_contact, emergency_phone });

    const result = await executeQuery(
      'UPDATE patients SET blood_type = ?, date_of_birth = ?, gender = ?, medical_history = ?, allergies = ?, emergency_contact = ?, emergency_phone = ? WHERE user_id = ?',
      [blood_type, date_of_birth, gender, medical_history, allergies, emergency_contact, emergency_phone, id]
    );

    if (result.affectedRows === 0) {
      console.error("❌ [PATIENT PROFILE] Patient profile not found for user_id:", id);
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    console.log("✅ [PATIENT PROFILE] Health info updated successfully for user_id:", id);
    res.json({ message: 'Patient profile updated successfully' });
  } catch (error) {
    console.error('❌ [PATIENT PROFILE] Update patient profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update personal info (name, email, phone)
export const updatePersonalInfo = async (req, res) => {
  try {
    const { id } = req.user;
    const { name, email, phone, profileImage } = req.body;

    console.log("📤 [PERSONAL INFO] Updating personal info for user_id:", id);
    console.log("📊 [PERSONAL INFO] Personal data:", { name, email, phone, profileImage });

    // Check if email already exists for another user
    if (email) {
      const existingUser = await executeQuery(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, id]
      );
      if (existingUser.length > 0) {
        console.warn("⚠️ [PERSONAL INFO] Email already in use:", email);
        return res.status(400).json({ message: 'Email already in use by another account' });
      }
    }

    // Handle profile image: upload, ignore, or delete
    // If profileImage is the special string 'DELETE', remove the profile image (set NULL)
    if (profileImage === 'DELETE') {
      const delRes = await executeQuery('UPDATE users SET profile_image = NULL WHERE id = ?', [id]);
      if (delRes.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
      console.log("✅ [PERSONAL INFO] Profile image removed for user_id:", id);
      return res.json({ message: 'Profile image removed' });
    }

    // Upload profile image to Cloudinary if provided (profileImage should be a URL or base64)
    let profileImageUrl = null;
    if (profileImage) {
      try {
        const uploadResult = await cloudinary.v2.uploader.upload(profileImage, {
          folder: 'medcare/profiles',
          resource_type: 'image'
        });
        profileImageUrl = uploadResult.secure_url;
      } catch (cloudErr) {
        console.error('Cloudinary upload error:', cloudErr);
        return res.status(500).json({ message: 'Profile image upload failed', error: cloudErr.message });
      }
    }

    const result = await executeQuery(
      'UPDATE users SET name = ?, email = ?, phone = ?, profile_image = IFNULL(?, profile_image) WHERE id = ?',
      [name, email, phone, profileImageUrl, id]
    );

    if (result.affectedRows === 0) {
      console.error("❌ [PERSONAL INFO] User not found for user_id:", id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("✅ [PERSONAL INFO] Personal info updated successfully for user_id:", id);
    res.json({ message: 'Personal information updated successfully' });
  } catch (error) {
    console.error('❌ [PERSONAL INFO] Update personal info error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user settings (theme, notifications, etc.)
export const updateSettings = async (req, res) => {
  try {
    const { id } = req.user;
    const { theme } = req.body;

    console.log("📤 [SETTINGS] Updating settings for user_id:", id);
    console.log("📊 [SETTINGS] Settings data:", { theme });

    // Validate theme value
    const validThemes = ['light', 'dark', 'auto'];
    if (theme && !validThemes.includes(theme)) {
      return res.status(400).json({ message: 'Invalid theme value. Must be light, dark, or auto' });
    }

    const result = await executeQuery(
      'UPDATE users SET theme_preference = ? WHERE id = ?',
      [theme, id]
    );

    if (result.affectedRows === 0) {
      console.error("❌ [SETTINGS] User not found for user_id:", id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("✅ [SETTINGS] Settings updated successfully for user_id:", id);
    res.json({ 
      message: 'Settings updated successfully',
      theme 
    });
  } catch (error) {
    console.error('❌ [SETTINGS] Update settings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete patient
export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;

    if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admin only' });
    }

    // First delete related records
    const patient = await executeQuery('SELECT user_id FROM patients WHERE id = ?', [id]);
    if (patient.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Delete patient and cascade will handle related records
    const result = await executeQuery('DELETE FROM patients WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Delete user account
    await executeQuery('DELETE FROM users WHERE id = ?', [patient[0].user_id]);

    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
