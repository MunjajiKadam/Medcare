import { executeQuery } from '../config/database.js';
import { createNotification } from './notificationController.js';

// Create prescription
export const createPrescription = async (req, res) => {
  try {
    const { appointment_id, patient_id, medications, dosage, duration, instructions } = req.body;
    const doctorId = req.user.id;

    const doctor = await executeQuery('SELECT id FROM doctors WHERE user_id = ?', [doctorId]);
    if (doctor.length === 0) {
      return res.status(400).json({ message: 'Doctor record not found' });
    }

    const result = await executeQuery(
      'INSERT INTO prescriptions (appointment_id, doctor_id, patient_id, medications, dosage, duration, instructions) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [appointment_id, doctor[0].id, patient_id, medications, dosage, duration, instructions]
    );

    // Get patient's user_id and send notification
    const patient = await executeQuery('SELECT user_id FROM patients WHERE id = ?', [patient_id]);
    if (patient.length > 0) {
      await createNotification(
        patient[0].user_id,
        '💊 New Prescription',
        `You have received a new prescription for ${medications}`,
        'prescription'
      );
    }

    res.status(201).json({
      message: 'Prescription created successfully',
      prescriptionId: result.insertId
    });
  } catch (error) {
    console.error('Create prescription error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all prescriptions
export const getPrescriptions = async (req, res) => {
  try {
    const { role, id } = req.user;
    let prescriptions;

    if (role === 'doctor') {
      const doctor = await executeQuery('SELECT id FROM doctors WHERE user_id = ?', [id]);
      prescriptions = await executeQuery(
        'SELECT p.*, u1.name as patient_name, u2.name as doctor_name FROM prescriptions p JOIN patients pt ON p.patient_id = pt.id JOIN users u1 ON pt.user_id = u1.id JOIN users u2 ON p.doctor_id = u2.user_id WHERE p.doctor_id = ? ORDER BY p.created_at DESC',
        [doctor[0].id]
      );
    } else if (role === 'patient') {
      const patient = await executeQuery('SELECT id FROM patients WHERE user_id = ?', [id]);
      prescriptions = await executeQuery(
        'SELECT p.*, u1.name as patient_name, u2.name as doctor_name FROM prescriptions p JOIN users u1 ON p.patient_id = (SELECT id FROM patients WHERE user_id = u1.id) JOIN doctors d ON p.doctor_id = d.id JOIN users u2 ON d.user_id = u2.id WHERE p.patient_id = ? ORDER BY p.created_at DESC',
        [patient[0].id]
      );
    } else if (role === 'admin') {
      prescriptions = await executeQuery(
        'SELECT p.*, u1.name as patient_name, u2.name as doctor_name FROM prescriptions p JOIN patients pt ON p.patient_id = pt.id JOIN users u1 ON pt.user_id = u1.id JOIN doctors d ON p.doctor_id = d.id JOIN users u2 ON d.user_id = u2.id ORDER BY p.created_at DESC'
      );
    }

    res.json({ prescriptions });
  } catch (error) {
    console.error('Get prescriptions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get prescription by ID
export const getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const prescription = await executeQuery(
      'SELECT p.*, u1.name as patient_name, u2.name as doctor_name FROM prescriptions p JOIN patients pt ON p.patient_id = pt.id JOIN users u1 ON pt.user_id = u1.id JOIN users u2 ON p.doctor_id = u2.user_id WHERE p.id = ?',
      [id]
    );

    if (prescription.length === 0) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json({ prescription: prescription[0] });
  } catch (error) {
    console.error('Get prescription error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update prescription
export const updatePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { medications, dosage, duration, instructions } = req.body;

    const result = await executeQuery(
      'UPDATE prescriptions SET medications = ?, dosage = ?, duration = ?, instructions = ? WHERE id = ?',
      [medications, dosage, duration, instructions, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json({ message: 'Prescription updated successfully' });
  } catch (error) {
    console.error('Update prescription error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete prescription
export const deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await executeQuery('DELETE FROM prescriptions WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    console.error('Delete prescription error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
