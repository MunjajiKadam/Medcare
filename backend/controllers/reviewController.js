import { executeQuery } from '../config/database.js';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

// Create review
export const createReview = async (req, res, next) => {
  try {
    const { doctor_id, rating, review_text } = req.body;
    const patientId = req.user.id;

    logger.info(`📝 [REVIEW] Create attempt: Doctor ${doctor_id}, Patient ${patientId}`);

    if (!doctor_id) {
      return next(new AppError('Doctor ID is required', 400));
    }

    if (!rating || rating < 1 || rating > 5) {
      return next(new AppError('Rating must be between 1 and 5', 400));
    }

    if (!review_text || !review_text.trim()) {
      return next(new AppError('Review text is required', 400));
    }

    const patient = await executeQuery('SELECT id FROM patients WHERE user_id = ?', [patientId]);

    let patientDbId;
    if (patient.length === 0) {
      logger.warn(`👤 [REVIEW] Auto-creating missing patient record for user: ${patientId}`);
      const patientResult = await executeQuery(
        'INSERT INTO patients (user_id) VALUES (?)',
        [patientId]
      );
      patientDbId = patientResult.insertId;
    } else {
      patientDbId = patient[0].id;
    }

    // Check if review already exists
    const existing = await executeQuery(
      'SELECT id FROM reviews WHERE doctor_id = ? AND patient_id = ?',
      [doctor_id, patientDbId]
    );

    let result;
    if (existing.length > 0) {
      logger.info(`📝 [REVIEW] Updating existing review: ${existing[0].id}`);
      result = await executeQuery(
        'UPDATE reviews SET rating = ?, review_text = ? WHERE doctor_id = ? AND patient_id = ?',
        [rating, review_text, doctor_id, patientDbId]
      );
    } else {
      logger.info('📝 [REVIEW] Creating new review');
      result = await executeQuery(
        'INSERT INTO reviews (doctor_id, patient_id, rating, review_text) VALUES (?, ?, ?, ?)',
        [doctor_id, patientDbId, rating, review_text]
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
      status: 'success',
      message: existing.length > 0 ? 'Review updated successfully' : 'Review created successfully',
      reviewId: result.insertId || existing[0].id
    });
  } catch (error) {
    next(error);
  }
};

// Get all reviews
export const getReviews = async (req, res, next) => {
  try {
    const reviews = await executeQuery(
      'SELECT r.*, u1.name as patient_name, u2.name as doctor_name FROM reviews r JOIN patients p ON r.patient_id = p.id JOIN users u1 ON p.user_id = u1.id JOIN doctors d ON r.doctor_id = d.id JOIN users u2 ON d.user_id = u2.id ORDER BY r.created_at DESC'
    );

    res.json({ status: 'success', reviews });
  } catch (error) {
    next(error);
  }
};

// Get reviews for a doctor
export const getReviewsByDoctor = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const reviews = await executeQuery(
      'SELECT r.*, u.name as patient_name FROM reviews r JOIN patients p ON r.patient_id = p.id JOIN users u ON p.user_id = u.id WHERE r.doctor_id = ? ORDER BY r.created_at DESC',
      [doctorId]
    );

    res.json({ status: 'success', reviews });
  } catch (error) {
    next(error);
  }
};

// Update review
export const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, review_text } = req.body;
    const userId = req.user.id;

    if (rating && (rating < 1 || rating > 5)) {
      return next(new AppError('Rating must be between 1 and 5', 400));
    }

    const review = await executeQuery(
      'SELECT r.*, p.user_id FROM reviews r JOIN patients p ON r.patient_id = p.id WHERE r.id = ?',
      [id]
    );

    if (review.length === 0) {
      return next(new AppError('Review not found', 404));
    }

    if (review[0].user_id !== userId && req.user.role !== 'admin') {
      return next(new AppError('Access denied: Can only update your own reviews', 403));
    }

    await executeQuery(
      'UPDATE reviews SET rating = ?, review_text = ? WHERE id = ?',
      [rating || review[0].rating, review_text || review[0].review_text, id]
    );

    // Update doctor's average rating
    const avgRating = await executeQuery(
      'SELECT ROUND(AVG(rating), 2) as avg_rating, COUNT(*) as total FROM reviews WHERE doctor_id = ?',
      [review[0].doctor_id]
    );

    await executeQuery(
      'UPDATE doctors SET rating = ?, total_reviews = ? WHERE id = ?',
      [avgRating[0].avg_rating || 0, avgRating[0].total || 0, review[0].doctor_id]
    );

    logger.info(`✅ [REVIEW] Review ${id} updated`);
    res.json({ status: 'success', message: 'Review updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Delete review
export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await executeQuery('SELECT doctor_id FROM reviews WHERE id = ?', [id]);
    if (review.length === 0) {
      return next(new AppError('Review not found', 404));
    }

    const result = await executeQuery('DELETE FROM reviews WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return next(new AppError('Review not found', 404));
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

    logger.info(`🗑️ [REVIEW] Review ${id} deleted`);
    res.json({ status: 'success', message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};
