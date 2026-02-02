-- Data for admin pages using correct IDs
USE medcare_db;

-- Add appointments (using correct doctor and patient IDs)
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason_for_visit, symptoms, status) VALUES
(5, 5, '2026-03-01', '10:00', 'Skin consultation', 'Acne problem', 'scheduled'),
(6, 6, '2026-03-02', '14:00', 'Pediatric checkup', 'Growth monitoring', 'scheduled'),
(7, 7, '2026-03-03', '09:30', 'Heart check', 'Chest pain', 'scheduled'),
(5, 6, '2026-03-05', '15:30', 'Follow-up', 'Previous treatment', 'scheduled'),
(6, 7, '2026-03-07', '11:00', 'General checkup', 'Routine examination', 'scheduled'),
(7, 5, '2026-03-08', '13:00', 'Blood pressure check', 'Hypertension follow-up', 'scheduled'),
(5, 7, '2026-03-10', '16:00', 'Skin biopsy', 'Mole examination', 'scheduled'),
(6, 5, '2026-03-12', '10:30', 'Child vaccination', 'Immunization', 'scheduled');

-- Add prescriptions
INSERT INTO prescriptions (appointment_id, doctor_id, patient_id, medications, dosage, duration, instructions) VALUES
(11, 5, 5, 'Benzoyl Peroxide', '2.5%', '60 days', 'Apply twice daily to affected areas'),
(12, 6, 6, 'Multivitamins', 'Daily dose', '30 days', 'Take with meals'),
(13, 7, 7, 'Aspirin', '100mg', '30 days', 'Take once daily in morning'),
(14, 6, 5, 'Cetirizine', '10mg', '30 days', 'Take as needed'),
(15, 7, 6, 'Tretinoin', '0.05%', '30 days', 'Apply at night only'),
(16, 5, 7, 'Vitamin D3', '400 IU', '60 days', 'Once daily with breakfast'),
(17, 7, 5, 'Hydrocortisone cream', '1%', '14 days', 'Apply 2-3 times daily'),
(18, 5, 6, 'Amoxicillin', '500mg', '7 days', 'Take three times daily');

-- Add health records
INSERT INTO health_records (patient_id, record_type, record_value, record_date) VALUES
(5, 'Blood Type', 'O+', '2026-02-01'),
(5, 'Condition', 'Acne', '2026-02-01'),
(5, 'Allergies', 'None', '2026-02-01'),
(6, 'Blood Type', 'A+', '2026-02-01'),
(6, 'Condition', 'Healthy', '2026-02-01'),
(6, 'Allergies', 'Codeine', '2026-02-01'),
(7, 'Blood Type', 'B+', '2026-02-01'),
(7, 'Condition', 'Hypertension', '2026-02-01'),
(7, 'Allergies', 'Latex', '2026-02-01');

-- Add reviews for doctors
INSERT INTO reviews (doctor_id, patient_id, rating, review_text) VALUES
(5, 5, 5, 'Excellent dermatologist! Very knowledgeable.'),
(6, 6, 5, 'Best pediatrician! Very gentle with children.'),
(7, 7, 4, 'Good cardiologist, very experienced.'),
(6, 5, 4, 'Thorough examination, excellent service.'),
(7, 6, 5, 'Fantastic care! Highly recommended.'),
(5, 7, 5, 'Wonderful doctor!'),
(6, 7, 5, 'Amazing results with treatment!'),
(7, 5, 4, 'Professional and caring.');

-- Add doctor time slots
INSERT INTO doctor_time_slots (doctor_id, day_of_week, start_time, end_time, is_available) VALUES
-- Doctor 5 slots
(5, 'Monday', '09:00', '17:00', 1),
(5, 'Tuesday', '09:00', '17:00', 1),
(5, 'Wednesday', '10:00', '18:00', 1),
(5, 'Thursday', '09:00', '17:00', 1),
(5, 'Friday', '09:00', '15:00', 1),
(5, 'Saturday', '10:00', '13:00', 1),
-- Doctor 6 slots
(6, 'Monday', '08:00', '16:00', 1),
(6, 'Tuesday', '08:00', '16:00', 1),
(6, 'Wednesday', '08:00', '16:00', 1),
(6, 'Thursday', '08:00', '16:00', 1),
(6, 'Friday', '08:00', '14:00', 1),
(6, 'Saturday', '09:00', '12:00', 1),
-- Doctor 7 slots
(7, 'Monday', '10:00', '18:00', 1),
(7, 'Tuesday', '10:00', '18:00', 1),
(7, 'Wednesday', '14:00', '18:00', 1),
(7, 'Thursday', '10:00', '18:00', 1),
(7, 'Friday', '10:00', '16:00', 1),
(7, 'Saturday', '11:00', '15:00', 1);
