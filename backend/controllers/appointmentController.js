import { executeQuery } from '../config/database.js';
import { createNotification } from './notificationController.js';

// Create Appointment
export const createAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, reasonForVisit, symptoms } = req.body;
    const patientId = req.user.id;

    console.log("\n========== 📅 APPOINTMENT CREATION START ==========");
    console.log("📨 [APPOINTMENT] Request received with body:", req.body);
    console.log("👤 [APPOINTMENT] User ID from token:", patientId);
    console.log("🔍 [APPOINTMENT] Checking patient record for user_id:", patientId);

    // Get patient details
    let patient = await executeQuery('SELECT id FROM patients WHERE user_id = ?', [patientId]);
    console.log("📊 [APPOINTMENT] Patient query result:", patient);
    
    if (patient.length === 0) {
      console.warn("⚠️ [APPOINTMENT] Patient record not found, attempting to create one for user_id:", patientId);
      try {
        // Auto-create patient record if it doesn't exist
        const insertResult = await executeQuery('INSERT INTO patients (user_id) VALUES (?)', [patientId]);
        console.log("✅ [APPOINTMENT] Patient record created - Insert ID:", insertResult.insertId);
        patient = await executeQuery('SELECT id FROM patients WHERE user_id = ?', [patientId]);
        console.log("✅ [APPOINTMENT] New patient record verified:", patient);
      } catch (createErr) {
        console.error("❌ [APPOINTMENT] Failed to create patient record:", createErr);
        return res.status(400).json({ 
          message: 'Patient record not found and could not be created. Please contact support.' 
        });
      }
    }
    
    const patientRecordId = patient[0].id;
    console.log("✅ [APPOINTMENT] Patient record confirmed - ID:", patientRecordId);
    console.log("🏥 [APPOINTMENT] Doctor ID:", doctorId);
    console.log("📅 [APPOINTMENT] Appointment Date:", appointmentDate);
    console.log("🕐 [APPOINTMENT] Appointment Time:", appointmentTime);
    console.log("💬 [APPOINTMENT] Reason:", reasonForVisit);
    console.log("🏥 [APPOINTMENT] Symptoms:", symptoms);

    // Check doctor availability
    const doctor = await executeQuery('SELECT id FROM doctors WHERE id = ?', [doctorId]);
    console.log("🔎 [APPOINTMENT] Doctor check result:", doctor);
    if (doctor.length === 0) {
      console.error("❌ [APPOINTMENT] Doctor not found - ID:", doctorId);
      return res.status(400).json({ message: 'Doctor not found' });
    }
    console.log("✅ [APPOINTMENT] Doctor verified");

    // Check for duplicate appointments
    console.log("🔍 [APPOINTMENT] Checking for duplicate appointments...");
    const existing = await executeQuery(
      'SELECT id FROM appointments WHERE patient_id = ? AND doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status != ?',
      [patientRecordId, doctorId, appointmentDate, appointmentTime, 'cancelled']
    );
    console.log("📊 [APPOINTMENT] Duplicate check result:", existing);
    if (existing.length > 0) {
      console.warn("⚠️ [APPOINTMENT] Duplicate appointment found");
      return res.status(400).json({ message: 'Appointment already exists for this time' });
    }
    console.log("✅ [APPOINTMENT] No duplicates found");

    // Create appointment
    console.log("💾 [APPOINTMENT] Inserting new appointment...");
    const result = await executeQuery(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason_for_visit, symptoms, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [patientRecordId, doctorId, appointmentDate, appointmentTime, reasonForVisit, symptoms, 'scheduled']
    );

    console.log("✅ [APPOINTMENT] Appointment created successfully!");
    console.log("📍 [APPOINTMENT] New Appointment ID:", result.insertId);
    console.log("========== 📅 APPOINTMENT CREATION SUCCESS ==========\n");

    // Send notification to patient
    await createNotification(
      patientId,
      '📅 Appointment Scheduled',
      `Your appointment has been scheduled for ${appointmentDate} at ${appointmentTime}`,
      'appointment'
    );

    // Get doctor's user_id and send notification
    const doctorUser = await executeQuery('SELECT user_id FROM doctors WHERE id = ?', [doctorId]);
    if (doctorUser.length > 0) {
      await createNotification(
        doctorUser[0].user_id,
        '📅 New Appointment',
        `New appointment scheduled for ${appointmentDate} at ${appointmentTime}`,
        'appointment'
      );
    }

    res.status(201).json({
      message: 'Appointment created successfully',
      appointmentId: result.insertId,
      appointment: {
        id: result.insertId,
        patientId: patientRecordId,
        doctorId,
        appointmentDate,
        appointmentTime,
        reason: reasonForVisit,
        status: 'scheduled'
      }
    });
  } catch (error) {
    console.error("❌ [APPOINTMENT] ERROR - Exception during appointment creation:", error);
    console.error("📝 [APPOINTMENT] Error message:", error.message);
    console.error("========== 📅 APPOINTMENT CREATION FAILED ==========\n");
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
      let doctor = await executeQuery('SELECT id FROM doctors WHERE user_id = ?', [id]);
      if (doctor.length === 0) {
        const result = await executeQuery(
          'INSERT INTO doctors (user_id, specialization, license_number, experience_years, consultation_fee) VALUES (?, ?, ?, ?, ?)',
          [id, 'General Physician', `LIC-${Date.now()}`, 0, 50]
        );
        doctor = [{ id: result.insertId }];
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
    const { appointmentDate, appointmentTime, reasonForVisit, symptoms, notes, status } = req.body;

    console.log(`\n📝 [APPOINTMENT UPDATE] Received update request for appointment ID: ${id}`);
    console.log(`📊 [APPOINTMENT UPDATE] Request body:`, req.body);

    // Build dynamic update query based on what fields are provided
    let updateFields = [];
    let updateValues = [];

    if (appointmentDate) {
      updateFields.push('appointment_date = ?');
      updateValues.push(appointmentDate);
    }
    if (appointmentTime) {
      updateFields.push('appointment_time = ?');
      updateValues.push(appointmentTime);
    }
    if (reasonForVisit) {
      updateFields.push('reason_for_visit = ?');
      updateValues.push(reasonForVisit);
    }
    if (symptoms) {
      updateFields.push('symptoms = ?');
      updateValues.push(symptoms);
    }
    if (notes) {
      updateFields.push('notes = ?');
      updateValues.push(notes);
    }
    if (status) {
      updateFields.push('status = ?');
      updateValues.push(status);
      console.log(`✅ [APPOINTMENT UPDATE] Status field detected: ${status}`);
    }

    // If no fields to update, return error
    if (updateFields.length === 0) {
      console.log(`❌ [APPOINTMENT UPDATE] No fields to update`);
      return res.status(400).json({ message: 'No fields to update' });
    }

    // Add appointment ID to the values array
    updateValues.push(id);

    const query = `UPDATE appointments SET ${updateFields.join(', ')} WHERE id = ?`;
    console.log(`🔄 [APPOINTMENT UPDATE] Executing query:`, query);
    console.log(`📋 [APPOINTMENT UPDATE] With values:`, updateValues);

    const result = await executeQuery(query, updateValues);

    console.log(`📊 [APPOINTMENT UPDATE] Query result:`, result);

    if (result.affectedRows === 0) {
      console.warn(`⚠️ [APPOINTMENT UPDATE] No rows affected - Appointment not found`);
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Send notification when status changes
    if (status) {
      const appointment = await executeQuery(
        'SELECT a.*, p.user_id as patient_user_id, d.user_id as doctor_user_id FROM appointments a JOIN patients p ON a.patient_id = p.id JOIN doctors d ON a.doctor_id = d.id WHERE a.id = ?',
        [id]
      );
      
      if (appointment.length > 0) {
        const appt = appointment[0];
        let notifTitle = '📅 Appointment Updated';
        let notifMessage = `Your appointment status has been updated to ${status}`;
        
        if (status === 'confirmed') {
          notifTitle = '✅ Appointment Confirmed';
          notifMessage = `Your appointment for ${appt.appointment_date} has been confirmed`;
        } else if (status === 'completed') {
          notifTitle = '✅ Appointment Completed';
          notifMessage = `Your appointment has been completed`;
        }
        
        // Notify patient
        await createNotification(appt.patient_user_id, notifTitle, notifMessage, 'appointment');
      }
    }

    console.log(`✅ [APPOINTMENT UPDATE] Appointment updated successfully`);
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

    // Get appointment details before cancelling
    const appointment = await executeQuery(
      'SELECT a.*, p.user_id as patient_user_id, d.user_id as doctor_user_id FROM appointments a JOIN patients p ON a.patient_id = p.id JOIN doctors d ON a.doctor_id = d.id WHERE a.id = ?',
      [id]
    );

    const result = await executeQuery(
      'UPDATE appointments SET status = ? WHERE id = ?',
      ['cancelled', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Send cancellation notifications
    if (appointment.length > 0) {
      const appt = appointment[0];
      const notifMessage = `Appointment for ${appt.appointment_date} has been cancelled`;
      
      // Notify both patient and doctor
      await createNotification(appt.patient_user_id, '❌ Appointment Cancelled', notifMessage, 'appointment');
      await createNotification(appt.doctor_user_id, '❌ Appointment Cancelled', notifMessage, 'appointment');
    }

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
