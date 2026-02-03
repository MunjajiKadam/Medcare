import { executeQuery } from '../config/database.js';

// Get doctor availability
export const getDoctorAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await executeQuery(
      'SELECT availability_status FROM doctors WHERE id = ?',
      [doctorId]
    );

    if (doctor.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Get time slots
    const timeSlots = await executeQuery(
      'SELECT * FROM doctor_time_slots WHERE doctor_id = ? ORDER BY day_of_week, start_time',
      [doctorId]
    );

    // Get availability history
    const history = await executeQuery(
      'SELECT * FROM availability_history WHERE doctor_id = ? ORDER BY created_at DESC LIMIT 10',
      [doctorId]
    );

    res.json({
      currentStatus: doctor[0].availability_status,
      timeSlots,
      history
    });
  } catch (error) {
    console.error('Get doctor availability error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update availability status
export const updateAvailabilityStatus = async (req, res) => {
  try {
    const { status, reason, end_date } = req.body;
    const doctorId = req.user.id;

    const doctor = await executeQuery('SELECT id FROM doctors WHERE user_id = ?', [doctorId]);
    if (doctor.length === 0) {
      return res.status(400).json({ message: 'Doctor record not found' });
    }

    // Update doctor status
    await executeQuery(
      'UPDATE doctors SET availability_status = ? WHERE id = ?',
      [status, doctor[0].id]
    );

    // Log in history
    if (reason) {
      await executeQuery(
        'INSERT INTO availability_history (doctor_id, status, start_date, end_date, reason) VALUES (?, ?, NOW(), ?, ?)',
        [doctor[0].id, status, end_date || null, reason]
      );
    }

    res.json({ message: 'Availability status updated successfully' });
  } catch (error) {
    console.error('Update availability status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create/Update time slot
export const upsertTimeSlot = async (req, res) => {
  try {
    const { day_of_week, start_time, end_time, is_available } = req.body;
    const doctorId = req.user.id;

    const doctor = await executeQuery('SELECT id FROM doctors WHERE user_id = ?', [doctorId]);
    if (doctor.length === 0) {
      return res.status(400).json({ message: 'Doctor record not found' });
    }

    // Check if slot exists for this day
    const existing = await executeQuery(
      'SELECT id FROM doctor_time_slots WHERE doctor_id = ? AND day_of_week = ?',
      [doctor[0].id, day_of_week]
    );

    let result;
    if (existing.length > 0) {
      // Update existing
      await executeQuery(
        'UPDATE doctor_time_slots SET start_time = ?, end_time = ?, is_available = ? WHERE id = ?',
        [start_time, end_time, is_available !== false, existing[0].id]
      );
      res.json({ message: 'Time slot updated successfully' });
    } else {
      // Create new
      result = await executeQuery(
        'INSERT INTO doctor_time_slots (doctor_id, day_of_week, start_time, end_time, is_available) VALUES (?, ?, ?, ?, ?)',
        [doctor[0].id, day_of_week, start_time, end_time, is_available !== false]
      );
      res.status(201).json({
        message: 'Time slot created successfully',
        slotId: result.insertId
      });
    }
  } catch (error) {
    console.error('Upsert time slot error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle time slot availability
export const toggleTimeSlotAvailability = async (req, res) => {
  try {
    const { slotId } = req.params;
    const { is_available } = req.body;
    const doctorId = req.user.id;

    const doctor = await executeQuery('SELECT id FROM doctors WHERE user_id = ?', [doctorId]);
    if (doctor.length === 0) {
      return res.status(400).json({ message: 'Doctor record not found' });
    }

    // Verify slot belongs to doctor
    const slot = await executeQuery(
      'SELECT * FROM doctor_time_slots WHERE id = ? AND doctor_id = ?',
      [slotId, doctor[0].id]
    );

    if (slot.length === 0) {
      return res.status(404).json({ message: 'Time slot not found' });
    }

    await executeQuery(
      'UPDATE doctor_time_slots SET is_available = ? WHERE id = ?',
      [is_available, slotId]
    );

    res.json({ message: 'Time slot availability updated successfully' });
  } catch (error) {
    console.error('Toggle time slot availability error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete time slot
export const deleteTimeSlot = async (req, res) => {
  try {
    const { slotId } = req.params;
    const doctorId = req.user.id;

    const doctor = await executeQuery('SELECT id FROM doctors WHERE user_id = ?', [doctorId]);
    if (doctor.length === 0) {
      return res.status(400).json({ message: 'Doctor record not found' });
    }

    await executeQuery(
      'DELETE FROM doctor_time_slots WHERE id = ? AND doctor_id = ?',
      [slotId, doctor[0].id]
    );

    res.json({ message: 'Time slot deleted successfully' });
  } catch (error) {
    console.error('Delete time slot error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get availability history for doctor
export const getAvailabilityHistory = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const doctor = await executeQuery('SELECT id FROM doctors WHERE user_id = ?', [doctorId]);
    if (doctor.length === 0) {
      return res.status(400).json({ message: 'Doctor record not found' });
    }

    const history = await executeQuery(
      'SELECT * FROM availability_history WHERE doctor_id = ? ORDER BY created_at DESC',
      [doctor[0].id]
    );

    res.json({ history });
  } catch (error) {
    console.error('Get availability history error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
