import { executeQuery } from '../config/database.js';

// Create diagnosis
export const createDiagnosis = async (req, res) => {
  try {
    const { appointment_id, patient_id, diagnosis, icd_code, severity, notes } = req.body;
    const doctorId = req.user.id;

    const doctor = await executeQuery('SELECT id FROM doctors WHERE user_id = ?', [doctorId]);
    if (doctor.length === 0) {
      return res.status(400).json({ message: 'Doctor record not found' });
    }

    const result = await executeQuery(
      'INSERT INTO diagnoses (appointment_id, doctor_id, patient_id, diagnosis, icd_code, severity, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [appointment_id, doctor[0].id, patient_id, diagnosis, icd_code, severity, notes]
    );

    res.status(201).json({
      message: 'Diagnosis created successfully',
      diagnosisId: result.insertId
    });
  } catch (error) {
    console.error('Create diagnosis error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get diagnosis for an appointment
export const getDiagnosisByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    const diagnoses = await executeQuery(
      `SELECT d.*, u.name as doctor_name 
       FROM diagnoses d 
       JOIN doctors dr ON d.doctor_id = dr.id 
       JOIN users u ON dr.user_id = u.id 
       WHERE d.appointment_id = ?
       ORDER BY d.created_at DESC`,
      [appointmentId]
    );

    res.json({ diagnoses });
  } catch (error) {
    console.error('Get diagnosis error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get diagnoses for patient
export const getPatientDiagnoses = async (req, res) => {
  try {
    const { role, id } = req.user;
    let diagnoses;

    if (role === 'patient') {
      const patient = await executeQuery('SELECT id FROM patients WHERE user_id = ?', [id]);
      diagnoses = await executeQuery(
        `SELECT d.*, u.name as doctor_name, a.appointment_date, a.appointment_time
         FROM diagnoses d 
         JOIN doctors dr ON d.doctor_id = dr.id 
         JOIN users u ON dr.user_id = u.id 
         JOIN appointments a ON d.appointment_id = a.id
         WHERE d.patient_id = ? 
         ORDER BY d.created_at DESC`,
        [patient[0].id]
      );
    } else if (role === 'doctor') {
      const doctor = await executeQuery('SELECT id FROM doctors WHERE user_id = ?', [id]);
      diagnoses = await executeQuery(
        `SELECT d.*, u1.name as patient_name, u2.name as doctor_name 
         FROM diagnoses d 
         JOIN patients pt ON d.patient_id = pt.id 
         JOIN users u1 ON pt.user_id = u1.id 
         JOIN users u2 ON d.doctor_id = u2.user_id 
         WHERE d.doctor_id = ? 
         ORDER BY d.created_at DESC`,
        [doctor[0].id]
      );
    } else if (role === 'admin') {
      diagnoses = await executeQuery(
        `SELECT d.*, u1.name as patient_name, u2.name as doctor_name 
         FROM diagnoses d 
         JOIN patients pt ON d.patient_id = pt.id 
         JOIN users u1 ON pt.user_id = u1.id 
         JOIN doctors dr ON d.doctor_id = dr.id 
         JOIN users u2 ON dr.user_id = u2.id 
         ORDER BY d.created_at DESC`
      );
    }

    res.json({ diagnoses });
  } catch (error) {
    console.error('Get patient diagnoses error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update diagnosis
export const updateDiagnosis = async (req, res) => {
  try {
    const { diagnosisId } = req.params;
    const { diagnosis, icd_code, severity, notes } = req.body;
    const doctorId = req.user.id;

    const doctor = await executeQuery('SELECT id FROM doctors WHERE user_id = ?', [doctorId]);
    if (doctor.length === 0) {
      return res.status(400).json({ message: 'Doctor record not found' });
    }

    await executeQuery(
      'UPDATE diagnoses SET diagnosis = ?, icd_code = ?, severity = ?, notes = ?, updated_at = NOW() WHERE id = ? AND doctor_id = ?',
      [diagnosis, icd_code, severity, notes, diagnosisId, doctor[0].id]
    );

    res.json({ message: 'Diagnosis updated successfully' });
  } catch (error) {
    console.error('Update diagnosis error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete diagnosis
export const deleteDiagnosis = async (req, res) => {
  try {
    const { diagnosisId } = req.params;
    const doctorId = req.user.id;

    const doctor = await executeQuery('SELECT id FROM doctors WHERE user_id = ?', [doctorId]);
    if (doctor.length === 0) {
      return res.status(400).json({ message: 'Doctor record not found' });
    }

    await executeQuery(
      'DELETE FROM diagnoses WHERE id = ? AND doctor_id = ?',
      [diagnosisId, doctor[0].id]
    );

    res.json({ message: 'Diagnosis deleted successfully' });
  } catch (error) {
    console.error('Delete diagnosis error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
