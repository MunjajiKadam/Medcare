import { executeQuery } from '../config/database.js';

// Create health record
export const createHealthRecord = async (req, res) => {
  try {
    const { record_type, record_value, record_date } = req.body;
    const patientId = req.user.id;

    const patient = await executeQuery('SELECT id FROM patients WHERE user_id = ?', [patientId]);
    if (patient.length === 0) {
      return res.status(400).json({ message: 'Patient record not found' });
    }

    const result = await executeQuery(
      'INSERT INTO health_records (patient_id, record_type, record_value, record_date) VALUES (?, ?, ?, ?)',
      [patient[0].id, record_type, record_value, record_date || new Date()]
    );

    res.status(201).json({
      message: 'Health record created successfully',
      recordId: result.insertId
    });
  } catch (error) {
    console.error('Create health record error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all health records
export const getHealthRecords = async (req, res) => {
  try {
    const patientId = req.user.id;

    const patient = await executeQuery('SELECT id FROM patients WHERE user_id = ?', [patientId]);
    if (patient.length === 0) {
      return res.status(400).json({ message: 'Patient record not found' });
    }

    const records = await executeQuery(
      'SELECT * FROM health_records WHERE patient_id = ? ORDER BY record_date DESC',
      [patient[0].id]
    );

    res.json({ records });
  } catch (error) {
    console.error('Get health records error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get health record by ID
export const getHealthRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await executeQuery('SELECT * FROM health_records WHERE id = ?', [id]);

    if (record.length === 0) {
      return res.status(404).json({ message: 'Health record not found' });
    }

    res.json({ record: record[0] });
  } catch (error) {
    console.error('Get health record error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update health record
export const updateHealthRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { record_type, record_value, record_date } = req.body;

    const result = await executeQuery(
      'UPDATE health_records SET record_type = ?, record_value = ?, record_date = ? WHERE id = ?',
      [record_type, record_value, record_date, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Health record not found' });
    }

    res.json({ message: 'Health record updated successfully' });
  } catch (error) {
    console.error('Update health record error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete health record
export const deleteHealthRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await executeQuery('DELETE FROM health_records WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Health record not found' });
    }

    res.json({ message: 'Health record deleted successfully' });
  } catch (error) {
    console.error('Delete health record error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
