import { executeQuery } from '../config/database.js';

// Create time slot
export const createTimeSlot = async (req, res) => {
  try {
    const { day_of_week, start_time, end_time } = req.body;
    const doctorId = req.user.id;

    const doctor = await executeQuery('SELECT id FROM doctors WHERE user_id = ?', [doctorId]);
    if (doctor.length === 0) {
      return res.status(400).json({ message: 'Doctor record not found' });
    }

    const result = await executeQuery(
      'INSERT INTO doctor_time_slots (doctor_id, day_of_week, start_time, end_time, is_available) VALUES (?, ?, ?, ?, ?)',
      [doctor[0].id, day_of_week, start_time, end_time, true]
    );

    res.status(201).json({
      message: 'Time slot created successfully',
      slotId: result.insertId
    });
  } catch (error) {
    console.error('Create time slot error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all time slots for a doctor
export const getTimeSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { doctor_id } = req.query;
    const id = doctorId || doctor_id;

    if (!id) {
      return res.status(400).json({ message: 'Doctor ID is required' });
    }

    const slots = await executeQuery(
      'SELECT * FROM doctor_time_slots WHERE doctor_id = ? ORDER BY day_of_week, start_time',
      [id]
    );

    res.json({ slots });
  } catch (error) {
    console.error('Get time slots error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all time slots (admin only)
export const getAllTimeSlots = async (req, res) => {
  try {
    const slots = await executeQuery(
      `SELECT ts.*, d.id as doctor_id, u.name as doctor_name, d.specialization 
       FROM doctor_time_slots ts 
       JOIN doctors d ON ts.doctor_id = d.id 
       JOIN users u ON d.user_id = u.id 
       ORDER BY u.name, ts.day_of_week, ts.start_time`
    );

    res.json({ slots });
  } catch (error) {
    console.error('Get all time slots error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get time slot by ID
export const getTimeSlotById = async (req, res) => {
  try {
    const { id } = req.params;
    const slot = await executeQuery('SELECT * FROM doctor_time_slots WHERE id = ?', [id]);

    if (slot.length === 0) {
      return res.status(404).json({ message: 'Time slot not found' });
    }

    res.json({ slot: slot[0] });
  } catch (error) {
    console.error('Get time slot error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update time slot
export const updateTimeSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { day_of_week, start_time, end_time, is_available } = req.body;

    const result = await executeQuery(
      'UPDATE doctor_time_slots SET day_of_week = ?, start_time = ?, end_time = ?, is_available = ? WHERE id = ?',
      [day_of_week, start_time, end_time, is_available, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Time slot not found' });
    }

    res.json({ message: 'Time slot updated successfully' });
  } catch (error) {
    console.error('Update time slot error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete time slot
export const deleteTimeSlot = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await executeQuery('DELETE FROM doctor_time_slots WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Time slot not found' });
    }

    res.json({ message: 'Time slot deleted successfully' });
  } catch (error) {
    console.error('Delete time slot error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
