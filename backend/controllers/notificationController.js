import { executeQuery } from '../config/database.js';

// Get User Notifications
export const getUserNotifications = async (req, res) => {
  try {
    const { id } = req.user;
    const notifications = await executeQuery(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [id]
    );

    res.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Unread Count
export const getUnreadCount = async (req, res) => {
  try {
    const { id } = req.user;
    const result = await executeQuery(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [id]
    );

    res.json({ count: result[0].count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark Notification as Read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await executeQuery(
      'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark All as Read
export const markAllAsRead = async (req, res) => {
  try {
    const { id } = req.user;
    
    await executeQuery(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE',
      [id]
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await executeQuery(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create Notification (Internal Helper)
export const createNotification = async (userId, title, message, type = 'general') => {
  try {
    await executeQuery(
      'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
      [userId, title, message, type]
    );
    console.log(`✅ Notification created for user ${userId}: ${title}`);
  } catch (error) {
    console.error('Create notification error:', error);
    throw error;
  }
};

// Send Notification to Patient (Doctor Only)
export const sendNotificationToPatient = async (req, res) => {
  try {
    const { patient_id, title, message } = req.body;
    const doctorUserId = req.user.id;

    console.log('📤 [SEND NOTIFICATION] Doctor user ID:', doctorUserId);
    console.log('📤 [SEND NOTIFICATION] Request body:', req.body);

    // Validate required fields
    if (!patient_id || !title || !message) {
      return res.status(400).json({ message: 'Patient ID, title, and message are required' });
    }

    // Get doctor record
    const doctor = await executeQuery('SELECT id FROM doctors WHERE user_id = ?', [doctorUserId]);
    if (doctor.length === 0) {
      return res.status(400).json({ message: 'Doctor record not found' });
    }

    // Get patient's user_id
    const patient = await executeQuery('SELECT user_id FROM patients WHERE id = ?', [patient_id]);
    if (patient.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Create notification for patient
    await executeQuery(
      'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
      [patient[0].user_id, title, message, 'general']
    );

    console.log('✅ [SEND NOTIFICATION] Notification sent to patient:', patient_id);

    res.status(201).json({ 
      message: 'Notification sent successfully to patient',
      recipient: patient_id
    });
  } catch (error) {
    console.error('Send notification to patient error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Doctor's Patients (for notification recipient selection)
export const getDoctorPatients = async (req, res) => {
  try {
    const doctorUserId = req.user.id;

    // Get doctor record
    const doctor = await executeQuery('SELECT id FROM doctors WHERE user_id = ?', [doctorUserId]);
    if (doctor.length === 0) {
      return res.status(400).json({ message: 'Doctor record not found' });
    }

    // Get all unique patients who have had appointments with this doctor
    const patients = await executeQuery(
      `SELECT DISTINCT p.id, p.user_id, u.name, u.email, u.phone 
       FROM patients p 
       JOIN users u ON p.user_id = u.id 
       JOIN appointments a ON p.id = a.patient_id 
       WHERE a.doctor_id = ? 
       ORDER BY u.name`,
      [doctor[0].id]
    );

    res.json({ patients });
  } catch (error) {
    console.error('Get doctor patients error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
