import { executeQuery } from '../config/database.js';

// Get All Doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await executeQuery(
      'SELECT d.id, d.specialization, d.experience_years, d.consultation_fee, d.rating, d.total_reviews, d.availability_status, u.name, u.phone FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.status = ?',
      ['active']
    );

    res.json({ doctors });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Doctor By ID
export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await executeQuery(
      'SELECT d.*, u.name, u.phone, u.profile_image FROM doctors d JOIN users u ON d.user_id = u.id WHERE d.id = ? AND u.status = ?',
      [id, 'active']
    );

    if (doctor.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ doctor: doctor[0] });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Doctor Profile (Protected)
export const getDoctorProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await executeQuery(
      'SELECT d.*, u.name, u.email, u.phone, u.profile_image FROM doctors d JOIN users u ON d.user_id = u.id WHERE d.id = ?',
      [id]
    );

    if (doctor.length === 0) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    res.json({ doctor: doctor[0] });
  } catch (error) {
    console.error('Get doctor profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Doctor Profile (Protected)
export const updateDoctorProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { specialization, experience_years, consultation_fee, bio, availability_status } = req.body;

    const result = await executeQuery(
      'UPDATE doctors SET specialization = ?, experience_years = ?, consultation_fee = ?, bio = ?, availability_status = ? WHERE id = ?',
      [specialization, experience_years, consultation_fee, bio, availability_status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ message: 'Doctor profile updated successfully' });
  } catch (error) {
    console.error('Update doctor profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Doctors By Specialization
export const getDoctorsBySpecialization = async (req, res) => {
  try {
    const { specialization } = req.params;
    const doctors = await executeQuery(
      'SELECT d.id, d.specialization, d.experience_years, d.consultation_fee, d.rating, d.total_reviews, u.name, u.phone FROM doctors d JOIN users u ON d.user_id = u.id WHERE d.specialization = ? AND u.status = ?',
      [specialization, 'active']
    );

    res.json({ doctors });
  } catch (error) {
    console.error('Get doctors by specialization error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Doctor Reviews
export const getDoctorReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await executeQuery(
      'SELECT r.*, u.name as patient_name FROM reviews r JOIN users u ON r.patient_id = u.id WHERE r.doctor_id = ? ORDER BY r.created_at DESC',
      [id]
    );

    res.json({ reviews });
  } catch (error) {
    console.error('Get doctor reviews error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Current Doctor Profile (Protected)
export const getCurrentDoctorProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the auth middleware

    let doctor = await executeQuery(
      'SELECT d.*, u.name, u.email, u.phone, u.profile_image FROM doctors d JOIN users u ON d.user_id = u.id WHERE d.user_id = ?',
      [userId]
    );

    if (doctor.length === 0) {
      // Auto-create doctor record
      const result = await executeQuery(
        'INSERT INTO doctors (user_id, specialization, license_number, experience_years, consultation_fee) VALUES (?, ?, ?, ?, ?)',
        [userId, 'General Physician', `LIC-${Date.now()}`, 0, 50]
      );
      doctor = await executeQuery(
        'SELECT d.*, u.name, u.email, u.phone, u.profile_image FROM doctors d JOIN users u ON d.user_id = u.id WHERE d.user_id = ?',
        [userId]
      );
    }

    res.json(doctor[0]);
  } catch (error) {
    console.error('Get current doctor profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update doctor settings (theme, notifications, etc.)
export const updateDoctorSettings = async (req, res) => {
  try {
    const { id } = req.user;
    const { theme } = req.body;

    console.log("📤 [DOCTOR SETTINGS] Updating settings for user_id:", id);
    console.log("📊 [DOCTOR SETTINGS] Settings data:", { theme });

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
      console.error("❌ [DOCTOR SETTINGS] User not found for user_id:", id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("✅ [DOCTOR SETTINGS] Settings updated successfully for user_id:", id);
    res.json({ 
      message: 'Settings updated successfully',
      theme 
    });
  } catch (error) {
    console.error('❌ [DOCTOR SETTINGS] Update settings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete doctor (Admin only)
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;

    if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admin only' });
    }

    console.log("📤 [DELETE DOCTOR] Deleting doctor ID:", id);

    // First get the user_id associated with this doctor
    const doctor = await executeQuery('SELECT user_id FROM doctors WHERE id = ?', [id]);
    if (doctor.length === 0) {
      console.error("❌ [DELETE DOCTOR] Doctor not found:", id);
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const userId = doctor[0].user_id;

    // Delete doctor record (cascade will handle related records like appointments, reviews, etc.)
    const result = await executeQuery('DELETE FROM doctors WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Delete user account
    await executeQuery('DELETE FROM users WHERE id = ?', [userId]);

    console.log("✅ [DELETE DOCTOR] Doctor deleted successfully:", id);
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('❌ [DELETE DOCTOR] Delete doctor error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
