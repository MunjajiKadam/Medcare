import { executeQuery } from '../config/database.js';
import AppError from '../utils/AppError.js';
import { createNotification } from './notificationController.js';

// Join waitlist
export const joinWaitlist = async (req, res, next) => {
    try {
        const { doctorId, date } = req.body;
        const patientId = req.user.id;

        // Check if patient record exists
        const patient = await executeQuery('SELECT id FROM patients WHERE user_id = ?', [patientId]);
        if (patient.length === 0) {
            return next(new AppError('Patient profile not found', 400));
        }

        const patientRecordId = patient[0].id;

        // Check if already on waitlist
        const existing = await executeQuery(
            'SELECT id FROM waitlist WHERE patient_id = ? AND doctor_id = ? AND preferred_date = ? AND status = ?',
            [patientRecordId, doctorId, date, 'active']
        );

        if (existing.length > 0) {
            return next(new AppError('You are already on the waitlist for this doctor and date', 400));
        }

        await executeQuery(
            'INSERT INTO waitlist (patient_id, doctor_id, preferred_date) VALUES (?, ?, ?)',
            [patientRecordId, doctorId, date]
        );

        res.status(201).json({
            status: 'success',
            message: 'Joined waitlist successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Get waitlist status (check if user is on waitlist)
export const getWaitlistStatus = async (req, res, next) => {
    try {
        const { doctorId, date } = req.query;
        const patientId = req.user.id;

        const patient = await executeQuery('SELECT id FROM patients WHERE user_id = ?', [patientId]);
        if (patient.length === 0) {
            return next(new AppError('Patient profile not found', 400));
        }

        const patientRecordId = patient[0].id;

        const entry = await executeQuery(
            'SELECT id FROM waitlist WHERE patient_id = ? AND doctor_id = ? AND preferred_date = ? AND status = ?',
            [patientRecordId, doctorId, date, 'active']
        );

        res.json({
            status: 'success',
            onWaitlist: entry.length > 0
        });
    } catch (error) {
        next(error);
    }
};

// Internal utility to notify waitlisted patients
export const notifyWaitlistedPatients = async (doctorId, date) => {
    try {
        const waitlisted = await executeQuery(
            'SELECT w.*, u.id as user_id, u.name FROM waitlist w JOIN patients p ON w.patient_id = p.id JOIN users u ON p.user_id = u.id WHERE w.doctor_id = ? AND w.preferred_date = ? AND w.status = ?',
            [doctorId, date, 'active']
        );

        if (waitlisted.length === 0) return;

        for (const entry of waitlisted) {
            await createNotification(
                entry.user_id,
                '📅 Appointment Slot Available!',
                `A slot has just opened up on ${date}. Book it now before it's gone!`,
                'appointment'
            );

            // Update status to notified
            await executeQuery('UPDATE waitlist SET status = ? WHERE id = ?', ['notified', entry.id]);
        }
    } catch (error) {
        console.error('Error notifying waitlisted patients:', error);
    }
};
