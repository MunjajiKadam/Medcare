import { executeQuery } from '../config/database.js';

// Create Appointment
export const createAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, reasonForVisit, symptoms } = req.body;
    const patientId = req.user.id;

    // Get patient details
    const patient = await executeQuery('SELECT id FROM patients WHERE user_id = ?', [patientId]);
    if (patient.length === 0) {
      return res.status(400).json({ message: 'Patient record not found' });
    }

    // Check doctor availability
    const doctor = await executeQuery('SELECT id FROM doctors WHERE id = ?', [doctorId]);
    if (doctor.length === 0) {
      return res.status(400).json({ message: 'Doctor not found' });
    }

    // Check for duplicate appointments
    const existing = await executeQuery(
      'SELECT id FROM appointments WHERE patient_id = ? AND doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status != ?',
      [patient[0].id, doctorId, appointmentDate, appointmentTime, 'cancelled']
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Appointment already exists for this time' });
    }

    // Create appointment
    const result = await executeQuery(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason_for_visit, symptoms, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [patient[0].id, doctorId, appointmentDate, appointmentTime, reasonForVisit, symptoms, 'scheduled']
    );

    res.status(201).json({
      message: 'Appointment created successfully',
      appointmentId: result.insertId
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Appointments
export const getAppointments = async (req, res) => {
  try {
    const { role, id } = req.user;
    let appointments;

    if (role === 'patient') {
      const patient = await executeQuery('SELECT id FROM patients WHERE user_id = ?', [id]);
      if (patient.length === 0) {
        return res.status(400).json({ message: 'Patient record not found' });
      }
      appointments = await executeQuery(
        'SELECT a.*, d.specialization, u.name as doctor_name FROM appointments a JOIN doctors d ON a.doctor_id = d.id JOIN users u ON d.user_id = u.id WHERE a.patient_id = ? ORDER BY a.appointment_date DESC',
        [patient[0].id]
      );
    } else if (role === 'doctor') {
      const doctor = await executeQuery('SELECT id FROM doctors WHERE user_id = ?', [id]);
      if (doctor.length === 0) {
        return res.status(400).json({ message: 'Doctor record not found' });
      }
      appointments = await executeQuery(
        'SELECT a.*, u.name as patient_name, p.blood_type FROM appointments a JOIN patients p ON a.patient_id = p.id JOIN users u ON p.user_id = u.id WHERE a.doctor_id = ? ORDER BY a.appointment_date DESC',
        [doctor[0].id]
      );
    } else if (role === 'admin') {
      appointments = await executeQuery(
        'SELECT a.*, u1.name as patient_name, u2.name as doctor_name FROM appointments a JOIN patients p ON a.patient_id = p.id JOIN users u1 ON p.user_id = u1.id JOIN doctors d ON a.doctor_id = d.id JOIN users u2 ON d.user_id = u2.id ORDER BY a.appointment_date DESC'
      );
    }

    res.json({ appointments });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Appointment By ID
export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await executeQuery(
      'SELECT a.*, u1.name as patient_name, u2.name as doctor_name, d.specialization FROM appointments a JOIN patients p ON a.patient_id = p.id JOIN users u1 ON p.user_id = u1.id JOIN doctors d ON a.doctor_id = d.id JOIN users u2 ON d.user_id = u2.id WHERE a.id = ?',
      [id]
    );

    if (appointment.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ appointment: appointment[0] });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Appointment
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { appointmentDate, appointmentTime, reasonForVisit, symptoms, notes } = req.body;

    const result = await executeQuery(
      'UPDATE appointments SET appointment_date = ?, appointment_time = ?, reason_for_visit = ?, symptoms = ?, notes = ? WHERE id = ?',
      [appointmentDate, appointmentTime, reasonForVisit, symptoms, notes, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment updated successfully' });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel Appointment
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await executeQuery(
      'UPDATE appointments SET status = ? WHERE id = ?',
      ['cancelled', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
