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
