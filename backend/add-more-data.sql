-- Data for admin pages using existing users
USE medcare_db;

-- Add appointments for existing doctors and patients
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason_for_visit, symptoms, status) VALUES
(1, 1, '2026-03-01', '10:00', 'Skin consultation', 'Acne problem', 'scheduled'),
(2, 2, '2026-03-02', '14:00', 'Pediatric checkup', 'Growth monitoring', 'scheduled'),
(3, 3, '2026-03-03', '09:30', 'Heart check', 'Chest pain', 'scheduled'),
(4, 1, '2026-03-05', '15:30', 'Follow-up', 'Previous treatment', 'scheduled'),
(1, 2, '2026-03-07', '11:00', 'General checkup', 'Routine examination', 'scheduled'),
(2, 3, '2026-03-08', '13:00', 'Blood pressure check', 'Hypertension follow-up', 'scheduled'),
(3, 1, '2026-03-10', '16:00', 'Skin biopsy', 'Mole examination', 'scheduled'),
(4, 2, '2026-03-12', '10:30', 'Child vaccination', 'Immunization', 'scheduled');

-- Add prescriptions for appointments
INSERT INTO prescriptions (appointment_id, doctor_id, patient_id, medications, dosage, duration, instructions) VALUES
(1, 1, 1, 'Benzoyl Peroxide', '2.5%', '60 days', 'Apply twice daily to affected areas'),
(2, 2, 2, 'Multivitamins', 'Daily dose', '30 days', 'Take with meals'),
(3, 3, 3, 'Aspirin', '100mg', '30 days', 'Take once daily in morning'),
(4, 1, 4, 'Cetirizine', '10mg', '30 days', 'Take as needed'),
(5, 2, 1, 'Tretinoin', '0.05%', '30 days', 'Apply at night only'),
(6, 3, 2, 'Vitamin D3', '400 IU', '60 days', 'Once daily with breakfast'),
(7, 1, 3, 'Hydrocortisone cream', '1%', '14 days', 'Apply 2-3 times daily'),
(8, 2, 4, 'Amoxicillin', '500mg', '7 days', 'Take three times daily');

-- Add health records
INSERT INTO health_records (patient_id, condition, blood_type, allergies, medications, notes) VALUES
(1, 'Acne', 'O+', 'None', 'Benzoyl Peroxide', 'Moderate acne, improving with treatment'),
(2, 'Healthy', 'A+', 'Codeine', 'Multivitamins', 'Regular checkups, no issues'),
(3, 'Hypertension', 'B+', 'Latex', 'Aspirin 100mg daily', 'BP well controlled'),
(4, 'Allergic Rhinitis', 'AB+', 'Sulfa', 'Cetirizine', 'Seasonal allergies');

-- Add reviews for doctors
INSERT INTO reviews (doctor_id, patient_id, rating, comment) VALUES
(1, 1, 5, 'Excellent dermatologist! Very knowledgeable.'),
(2, 2, 5, 'Best pediatrician! Very gentle with children.'),
(3, 3, 4, 'Good cardiologist, very experienced.'),
(1, 4, 4, 'Thorough examination, excellent service.'),
(2, 1, 5, 'Fantastic care! Highly recommended.'),
(3, 2, 5, 'Wonderful doctor!'),
(1, 3, 5, 'Amazing results with treatment!'),
(2, 4, 4, 'Professional and caring.');

-- Add doctor time slots
INSERT INTO doctor_time_slots (doctor_id, day_of_week, start_time, end_time, is_available) VALUES
-- Doctor 1 slots
(1, 'Monday', '09:00', '17:00', 1),
(1, 'Tuesday', '09:00', '17:00', 1),
(1, 'Wednesday', '10:00', '18:00', 1),
(1, 'Thursday', '09:00', '17:00', 1),
(1, 'Friday', '09:00', '15:00', 1),
(1, 'Saturday', '10:00', '13:00', 1),
-- Doctor 2 slots
(2, 'Monday', '08:00', '16:00', 1),
(2, 'Tuesday', '08:00', '16:00', 1),
(2, 'Wednesday', '08:00', '16:00', 1),
(2, 'Thursday', '08:00', '16:00', 1),
(2, 'Friday', '08:00', '14:00', 1),
(2, 'Saturday', '09:00', '12:00', 1),
-- Doctor 3 slots
(3, 'Monday', '10:00', '18:00', 1),
(3, 'Tuesday', '10:00', '18:00', 1),
(3, 'Wednesday', '14:00', '18:00', 1),
(3, 'Thursday', '10:00', '18:00', 1),
(3, 'Friday', '10:00', '16:00', 1),
(3, 'Saturday', '11:00', '15:00', 1);
