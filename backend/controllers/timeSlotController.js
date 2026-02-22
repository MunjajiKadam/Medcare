import { executeQuery } from '../config/database.js';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

// Create time slot
export const createTimeSlot = async (req, res, next) => {
  try {
    const { day_of_week, start_time, end_time } = req.body;
    const doctorUserId = req.user.id;

    const doctor = await executeQuery('SELECT id FROM doctors WHERE user_id = ?', [doctorUserId]);
    if (doctor.length === 0) {
      return next(new AppError('Doctor record not found', 404));
    }

    logger.info(`📅 [TIME SLOT] Creating slot for doctor ${doctor[0].id}: ${day_of_week} ${start_time}-${end_time}`);

    const result = await executeQuery(
      'INSERT INTO doctor_time_slots (doctor_id, day_of_week, start_time, end_time, is_available) VALUES (?, ?, ?, ?, ?)',
      [doctor[0].id, day_of_week, start_time, end_time, true]
    );

    res.status(201).json({
      status: 'success',
      message: 'Time slot created successfully',
      slotId: result.insertId
    });
  } catch (error) {
    next(error);
  }
};

// Get all time slots for a doctor
export const getTimeSlots = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { doctor_id, date } = req.query;
    let id = doctorId || doctor_id;

    if (!id && req.user && req.user.role === 'doctor') {
      const doctor = await executeQuery('SELECT id FROM doctors WHERE user_id = ?', [req.user.id]);
      if (doctor.length > 0) {
        id = doctor[0].id;
      }
    }

    if (!id) {
      return next(new AppError('Doctor ID is required', 400));
    }

    let slots;
    if (date) {
      const selectedDate = new Date(date);
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayOfWeek = daysOfWeek[selectedDate.getDay()];

      logger.info(`📅 [TIME SLOT] Fetching slots for doctor ${id} on ${dayOfWeek} (${date})`);

        // Get configured slots for that day
        const configuredSlots = await executeQuery(
          'SELECT * FROM doctor_time_slots WHERE doctor_id = ? AND day_of_week = ? AND is_available = TRUE ORDER BY start_time',
          [id, dayOfWeek]
        );

        // Helper to parse time strings like HH:MM or HH:MM:SS into minutes since midnight
        const toMinutes = (timeStr) => {
          if (!timeStr) return null;
          const parts = timeStr.split(':');
          const h = parseInt(parts[0], 10) || 0;
          const m = parseInt(parts[1], 10) || 0;
          return h * 60 + m;
        };

        const minutesToTime = (mins) => {
          const h = Math.floor(mins / 60);
          const m = mins % 60;
          return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        };

        // Fetch already booked appointment times for that doctor on the date
        const bookedRows = await executeQuery(
          `SELECT appointment_time FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND status != ?`,
          [id, date, 'cancelled']
        );
        const bookedSet = new Set(bookedRows.map(r => (r.appointment_time || '').toString().slice(0,5)));

        // Build 30-minute intervals from configured slots, excluding booked times
        const generatedTimes = [];
        for (const s of configuredSlots) {
          const startMin = toMinutes(s.start_time);
          const endMin = toMinutes(s.end_time);
          if (startMin === null || endMin === null || endMin <= startMin) continue;

          for (let t = startMin; t + 30 <= endMin; t += 30) {
            const timeStr = minutesToTime(t);
            if (!bookedSet.has(timeStr)) generatedTimes.push(timeStr);
          }
        }

        // Deduplicate and sort
        slots = Array.from(new Set(generatedTimes)).sort();
    } else {
      slots = await executeQuery(
        'SELECT * FROM doctor_time_slots WHERE doctor_id = ? ORDER BY day_of_week, start_time',
        [id]
      );
    }

    res.json({ status: 'success', slots });
  } catch (error) {
    next(error);
  }
};

// Get all time slots (admin only)
export const getAllTimeSlots = async (req, res, next) => {
  try {
    const { role } = req.user;
    if (role !== 'admin') {
      return next(new AppError('Access denied: Admin only', 403));
    }

    const slots = await executeQuery(
      `SELECT ts.*, d.id as doctor_id, u.name as doctor_name, d.specialization 
       FROM doctor_time_slots ts 
       JOIN doctors d ON ts.doctor_id = d.id 
       JOIN users u ON d.user_id = u.id 
       ORDER BY u.name, ts.day_of_week, ts.start_time`
    );

    res.json({ status: 'success', slots });
  } catch (error) {
    next(error);
  }
};

// Get time slot by ID
export const getTimeSlotById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const slot = await executeQuery('SELECT * FROM doctor_time_slots WHERE id = ?', [id]);

    if (slot.length === 0) {
      return next(new AppError('Time slot not found', 404));
    }

    res.json({ status: 'success', slot: slot[0] });
  } catch (error) {
    next(error);
  }
};

// Update time slot
export const updateTimeSlot = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { day_of_week, start_time, end_time, is_available } = req.body;

    const result = await executeQuery(
      'UPDATE doctor_time_slots SET day_of_week = ?, start_time = ?, end_time = ?, is_available = ? WHERE id = ?',
      [day_of_week, start_time, end_time, is_available, id]
    );

    if (result.affectedRows === 0) {
      return next(new AppError('Time slot not found', 404));
    }

    logger.info(`✅ [TIME SLOT] Slot ${id} updated`);
    res.json({ status: 'success', message: 'Time slot updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Delete time slot
export const deleteTimeSlot = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await executeQuery('DELETE FROM doctor_time_slots WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return next(new AppError('Time slot not found', 404));
    }

    logger.info(`🗑️ [TIME SLOT] Slot ${id} deleted`);
    res.json({ status: 'success', message: 'Time slot deleted successfully' });
  } catch (error) {
    next(error);
  }
};
