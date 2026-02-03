import { executeQuery } from '../config/database.js';

// Create consultation notes
export const createConsultationNotes = async (req, res) => {
  try {
    const { appointment_id, patient_id, notes, vitals, observations, follow_up } = req.body;
    const doctorId = req.user.id;

    const doctor = await executeQuery('SELECT id FROM doctors WHERE user_id = ?', [doctorId]);
    if (doctor.length === 0) {
      return res.status(400).json({ message: 'Doctor record not found' });
    }

    const vitalString = vitals ? JSON.stringify(vitals) : null;

    const result = await executeQuery(
      'INSERT INTO consultation_notes (appointment_id, doctor_id, patient_id, notes, vitals, observations, follow_up) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [appointment_id, doctor[0].id, patient_id, notes, vitalString, observations, follow_up]
    );

    res.status(201).json({
      message: 'Consultation notes created successfully',
      notesId: result.insertId
    });
  } catch (error) {
    console.error('Create consultation notes error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get consultation notes
export const getConsultationNotes = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    const notes = await executeQuery(
      `SELECT cn.*, u.name as doctor_name 
       FROM consultation_notes cn 
       JOIN doctors d ON cn.doctor_id = d.id 
       JOIN users u ON d.user_id = u.id 
       WHERE cn.appointment_id = ?`,
      [appointmentId]
    );

    if (notes.length === 0) {
      return res.status(404).json({ message: 'Consultation notes not found' });
    }

    // Parse vitals JSON if exists
    const notesData = notes[0];
    if (notesData.vitals) {
      notesData.vitals = JSON.parse(notesData.vitals);
    }

    res.json(notesData);
  } catch (error) {
    console.error('Get consultation notes error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all consultation notes for doctor
export const getDoctorConsultationNotes = async (req, res) => {
  try {
    const { role, id } = req.user;
    let notes;

    if (role === 'doctor') {
      const doctor = await executeQuery('SELECT id FROM doctors WHERE user_id = ?', [id]);
      notes = await executeQuery(
        `SELECT cn.*, u1.name as patient_name, u2.name as doctor_name 
         FROM consultation_notes cn 
         JOIN patients pt ON cn.patient_id = pt.id 
         JOIN users u1 ON pt.user_id = u1.id 
         JOIN users u2 ON cn.doctor_id = u2.user_id 
         WHERE cn.doctor_id = ? 
         ORDER BY cn.created_at DESC`,
        [doctor[0].id]
      );
    } else if (role === 'admin') {
      notes = await executeQuery(
        `SELECT cn.*, u1.name as patient_name, u2.name as doctor_name 
         FROM consultation_notes cn 
         JOIN patients pt ON cn.patient_id = pt.id 
         JOIN users u1 ON pt.user_id = u1.id 
         JOIN doctors d ON cn.doctor_id = d.id 
         JOIN users u2 ON d.user_id = u2.id 
         ORDER BY cn.created_at DESC`
      );
    }

    // Parse vitals for all records
    notes.forEach(note => {
      if (note.vitals) {
        note.vitals = JSON.parse(note.vitals);
      }
    });

    res.json({ consultationNotes: notes });
  } catch (error) {
    console.error('Get doctor consultation notes error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update consultation notes
export const updateConsultationNotes = async (req, res) => {
  try {
    const { notesId } = req.params;
    const { notes, vitals, observations, follow_up } = req.body;
    const doctorId = req.user.id;

    const doctor = await executeQuery('SELECT id FROM doctors WHERE user_id = ?', [doctorId]);
    if (doctor.length === 0) {
      return res.status(400).json({ message: 'Doctor record not found' });
    }

    const vitalString = vitals ? JSON.stringify(vitals) : null;

    await executeQuery(
      'UPDATE consultation_notes SET notes = ?, vitals = ?, observations = ?, follow_up = ?, updated_at = NOW() WHERE id = ? AND doctor_id = ?',
      [notes, vitalString, observations, follow_up, notesId, doctor[0].id]
    );

    res.json({ message: 'Consultation notes updated successfully' });
  } catch (error) {
    console.error('Update consultation notes error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
