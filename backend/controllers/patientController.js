import { executeQuery } from '../config/database.js';

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

    const result = await executeQuery(
      'UPDATE patients SET blood_type = ?, date_of_birth = ?, gender = ?, medical_history = ?, allergies = ?, emergency_contact = ?, emergency_phone = ? WHERE user_id = ?',
      [blood_type, date_of_birth, gender, medical_history, allergies, emergency_contact, emergency_phone, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    res.json({ message: 'Patient profile updated successfully' });
  } catch (error) {
    console.error('Update patient profile error:', error);
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
