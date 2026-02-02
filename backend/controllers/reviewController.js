import { executeQuery } from '../config/database.js';

// Create review
export const createReview = async (req, res) => {
  try {
    const { doctor_id, rating, review_text } = req.body;
    const patientId = req.user.id;

    const patient = await executeQuery('SELECT id FROM patients WHERE user_id = ?', [patientId]);
    if (patient.length === 0) {
      return res.status(400).json({ message: 'Patient record not found' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if review already exists
    const existing = await executeQuery(
      'SELECT id FROM reviews WHERE doctor_id = ? AND patient_id = ?',
      [doctor_id, patient[0].id]
    );

    let result;
    if (existing.length > 0) {
      result = await executeQuery(
        'UPDATE reviews SET rating = ?, review_text = ? WHERE doctor_id = ? AND patient_id = ?',
        [rating, review_text, doctor_id, patient[0].id]
      );
    } else {
      result = await executeQuery(
        'INSERT INTO reviews (doctor_id, patient_id, rating, review_text) VALUES (?, ?, ?, ?)',
        [doctor_id, patient[0].id, rating, review_text]
      );
    }

    // Update doctor's average rating
    const avgRating = await executeQuery(
      'SELECT ROUND(AVG(rating), 2) as avg_rating, COUNT(*) as total FROM reviews WHERE doctor_id = ?',
      [doctor_id]
    );

    await executeQuery(
      'UPDATE doctors SET rating = ?, total_reviews = ? WHERE id = ?',
      [avgRating[0].avg_rating || 0, avgRating[0].total || 0, doctor_id]
    );

    res.status(201).json({
      message: existing.length > 0 ? 'Review updated successfully' : 'Review created successfully',
      reviewId: result.insertId || existing[0].id
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all reviews
export const getReviews = async (req, res) => {
  try {
    const reviews = await executeQuery(
      'SELECT r.*, u1.name as patient_name, u2.name as doctor_name FROM reviews r JOIN patients p ON r.patient_id = p.id JOIN users u1 ON p.user_id = u1.id JOIN doctors d ON r.doctor_id = d.id JOIN users u2 ON d.user_id = u2.id ORDER BY r.created_at DESC'
    );

    res.json({ reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get reviews for a doctor
export const getReviewsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const reviews = await executeQuery(
      'SELECT r.*, u.name as patient_name FROM reviews r JOIN patients p ON r.patient_id = p.id JOIN users u ON p.user_id = u.id WHERE r.doctor_id = ? ORDER BY r.created_at DESC',
      [doctorId]
    );

    res.json({ reviews });
  } catch (error) {
    console.error('Get doctor reviews error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update review
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review_text } = req.body;
    const userId = req.user.id;

    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if review exists and belongs to user
    const review = await executeQuery(
      'SELECT r.*, p.user_id FROM reviews r JOIN patients p ON r.patient_id = p.id WHERE r.id = ?',
      [id]
    );

    if (review.length === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review[0].user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Can only update your own reviews' });
    }

    // Update review
    const result = await executeQuery(
      'UPDATE reviews SET rating = ?, review_text = ? WHERE id = ?',
      [rating || review[0].rating, review_text || review[0].review_text, id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'Failed to update review' });
    }

    // Update doctor's average rating
    const avgRating = await executeQuery(
      'SELECT ROUND(AVG(rating), 2) as avg_rating, COUNT(*) as total FROM reviews WHERE doctor_id = ?',
      [review[0].doctor_id]
    );

    await executeQuery(
      'UPDATE doctors SET rating = ?, total_reviews = ? WHERE id = ?',
      [avgRating[0].avg_rating || 0, avgRating[0].total || 0, review[0].doctor_id]
    );

    res.json({ message: 'Review updated successfully' });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Get doctor_id before deletion to update rating
    const review = await executeQuery('SELECT doctor_id FROM reviews WHERE id = ?', [id]);
    if (review.length === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const result = await executeQuery('DELETE FROM reviews WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Update doctor's average rating
    const avgRating = await executeQuery(
      'SELECT ROUND(AVG(rating), 2) as avg_rating, COUNT(*) as total FROM reviews WHERE doctor_id = ?',
      [review[0].doctor_id]
    );

    await executeQuery(
      'UPDATE doctors SET rating = ?, total_reviews = ? WHERE id = ?',
      [avgRating[0].avg_rating || 0, avgRating[0].total || 0, review[0].doctor_id]
    );

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
