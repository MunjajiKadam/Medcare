import { executeQuery } from '../config/database.js';
import { createNotification } from './notificationController.js';
import AppError from '../utils/AppError.js';
import { notifyWaitlistedPatients } from './waitlistController.js';
import logger from '../utils/logger.js';

// Create Appointment
export const createAppointment = async (req, res, next) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, reasonForVisit, symptoms, is_virtual } = req.body;
    const patientId = req.user.id;

    logger.info(`📅 [APPOINTMENT] Creating appointment for patient ${patientId} with doctor ${doctorId}`);

    // Get patient details
    let patient = await executeQuery('SELECT id FROM patients WHERE user_id = ?', [patientId]);

    if (patient.length === 0) {
      const result = await executeQuery('INSERT INTO patients (user_id) VALUES (?)', [patientId]);
      patient = [{ id: result.insertId }];
    }

    const patientRecordId = patient[0].id;

    const doctor = await executeQuery('SELECT d.id, u.name FROM doctors d JOIN users u ON d.user_id = u.id WHERE d.id = ?', [doctorId]);
    if (doctor.length === 0) {
      return next(new AppError('Doctor not found', 404));
    }

    const existing = await executeQuery(
      'SELECT id FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status != ?',
      [doctorId, appointmentDate, appointmentTime, 'cancelled']
    );
    if (existing.length > 0) {
      return next(new AppError('This time slot is already booked', 400));
    }

    let meetingLink = null;
    if (is_virtual) {
      meetingLink = `https://meet.jit.si/medcare-${doctorId}-${Date.now()}`;
    }

    const result = await executeQuery(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason_for_visit, symptoms, status, is_virtual, meeting_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [patientRecordId, doctorId, appointmentDate, appointmentTime, reasonForVisit, symptoms, 'scheduled', is_virtual || false, meetingLink]
    );

    const appointmentId = result.insertId;

    await createNotification(
      patientId,
      '📅 Appointment Scheduled',
      `Your appointment for ${appointmentDate} at ${appointmentTime} is confirmed. ${is_virtual ? 'This is a virtual consultation.' : ''}`,
      'appointment'
    );

    const doctorUser = await executeQuery('SELECT user_id FROM doctors WHERE id = ?', [doctorId]);
    if (doctorUser.length > 0) {
      await createNotification(
        doctorUser[0].user_id,
        '📅 New Appointment',
        `New appointment scheduled for ${appointmentDate} at ${appointmentTime}.`,
        'appointment'
      );
    }

    res.status(201).json({
      status: 'success',
      message: 'Appointment created successfully',
      appointmentId,
      meetingLink
    });
  } catch (error) {
    next(error);
  }
};

// Get Appointments
export const getAppointments = async (req, res, next) => {
  try {
    const { role, id } = req.user;
    let appointments;

    if (role === 'patient') {
      const patient = await executeQuery('SELECT id FROM patients WHERE user_id = ?', [id]);
      if (patient.length === 0) return next(new AppError('Patient profile not found', 404));

      appointments = await executeQuery(
        'SELECT a.*, d.specialization, u.name as doctor_name, u.profile_image FROM appointments a JOIN doctors d ON a.doctor_id = d.id JOIN users u ON d.user_id = u.id WHERE a.patient_id = ? ORDER BY a.appointment_date DESC, a.appointment_time DESC',
        [patient[0].id]
      );
    } else if (role === 'doctor') {
      const doctor = await executeQuery('SELECT id FROM doctors WHERE user_id = ?', [id]);
      if (doctor.length === 0) return next(new AppError('Doctor profile not found', 404));

      appointments = await executeQuery(
        'SELECT a.*, u.name as patient_name, u.profile_image FROM appointments a JOIN patients p ON a.patient_id = p.id JOIN users u ON p.user_id = u.id WHERE a.doctor_id = ? ORDER BY a.appointment_date DESC, a.appointment_time DESC',
        [doctor[0].id]
      );
    } else {
      appointments = await executeQuery(
        'SELECT a.*, u1.name as patient_name, u2.name as doctor_name FROM appointments a JOIN patients p ON a.patient_id = p.id JOIN users u1 ON p.user_id = u1.id JOIN doctors d ON a.doctor_id = d.id JOIN users u2 ON d.user_id = u2.id ORDER BY a.appointment_date DESC, a.appointment_time DESC'
      );
    }

    res.json({ status: 'success', appointments });
  } catch (error) {
    next(error);
  }
};

// Get Appointment By ID
export const getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;

    const appointment = await executeQuery(
      'SELECT a.*, p.user_id as patient_user_id, d.user_id as doctor_user_id, u1.name as patient_name, u2.name as doctor_name FROM appointments a JOIN patients p ON a.patient_id = p.id JOIN users u1 ON p.user_id = u1.id JOIN doctors d ON a.doctor_id = d.id JOIN users u2 ON d.user_id = u2.id WHERE a.id = ?',
      [id]
    );

    if (appointment.length === 0) {
      return next(new AppError('Appointment not found', 404));
    }

    const appt = appointment[0];

    if (role !== 'admin' && appt.patient_user_id !== userId && appt.doctor_user_id !== userId) {
      return next(new AppError('Access denied: You are not authorized to view this appointment', 403));
    }

    res.json({ status: 'success', appointment: appt });
  } catch (error) {
    next(error);
  }
};

// Update Appointment
export const updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    // mysql2 throws if bind parameters contain `undefined` — convert undefined to null
    const safeStatus = typeof status === 'undefined' ? null : status;
    const safeNotes = typeof notes === 'undefined' ? null : notes;

    const result = await executeQuery(
      'UPDATE appointments SET status = IFNULL(?, status), notes = IFNULL(?, notes) WHERE id = ?',
      [safeStatus, safeNotes, id]
    );

    if (result.affectedRows === 0) return next(new AppError('Appointment not found', 404));

    if (status) {
      const appt = await executeQuery(
        'SELECT a.*, p.user_id as patient_user_id FROM appointments a JOIN patients p ON a.patient_id = p.id WHERE a.id = ?',
        [id]
      );
      if (appt.length > 0) {
        await createNotification(appt[0].patient_user_id, '📅 Appointment Updated', `Your appointment status is now ${status}`, 'appointment');
      }
    }

    res.json({ status: 'success', message: 'Appointment updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Cancel Appointment
export const cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const appointment = await executeQuery(
      'SELECT a.*, p.user_id as patient_user_id, d.user_id as doctor_user_id FROM appointments a JOIN patients p ON a.patient_id = p.id JOIN doctors d ON a.doctor_id = d.id WHERE a.id = ?',
      [id]
    );

    if (appointment.length === 0) return next(new AppError('Appointment not found', 404));
    const appt = appointment[0];

    await executeQuery('UPDATE appointments SET status = ? WHERE id = ?', ['cancelled', id]);

    const notifMessage = `Appointment for ${appt.appointment_date} has been cancelled`;
    await createNotification(appt.patient_user_id, '❌ Appointment Cancelled', notifMessage, 'appointment');
    await createNotification(appt.doctor_user_id, '❌ Appointment Cancelled', notifMessage, 'appointment');

    logger.info(`🔔 [WAITLIST] Slot freed for doctor ${appt.doctor_id} on ${appt.appointment_date}. Notifying patients...`);
    await notifyWaitlistedPatients(appt.doctor_id, appt.appointment_date);

    res.json({ status: 'success', message: 'Appointment cancelled successfully' });
  } catch (error) {
    next(error);
  }
};
