-- Additional Dummy Data for MedCare Database
-- This file contains more sample data for all admin pages

USE medcare_db;

-- Add more Users (Doctors and Patients)
INSERT INTO users (name, email, password, role, phone, status) VALUES
('Dr. Ananya Desai', 'ananya@medcare.com', '$2a$10$GVvJ/ixKnRDhP5xDvXQvGOwTb7D5iHa9OJ5Rb2Kt5E8xN9H8K0L6O', 'doctor', '9123456793', 'active'),
('Dr. Vikrant Singh', 'vikrant@medcare.com', '$2a$10$GVvJ/ixKnRDhP5xDvXQvGOwTb7D5iHa9OJ5Rb2Kt5E8xN9H8K0L6O', 'doctor', '9123456794', 'active'),
('Priya Mishra', 'priya.mishra@example.com', '$2a$10$L5nYrQs8E9j5D2kK3vP0F.YeKmWvXrT4I7nP2jQ9s8e6vX3hY1N4C', 'patient', '8765432114', 'active'),
('Arjun Kumar', 'arjun.kumar@example.com', '$2a$10$L5nYrQs8E9j5D2kK3vP0F.YeKmWvXrT4I7nP2jQ9s8e6vX3hY1N4C', 'patient', '8765432115', 'active'),
('Deepa Sharma', 'deepa.sharma@example.com', '$2a$10$L5nYrQs8E9j5D2kK3vP0F.YeKmWvXrT4I7nP2jQ9s8e6vX3hY1N4C', 'patient', '8765432116', 'active'),
('Rohan Patel', 'rohan.patel@example.com', '$2a$10$L5nYrQs8E9j5D2kK3vP0F.YeKmWvXrT4I7nP2jQ9s8e6vX3hY1N4C', 'patient', '8765432117', 'active');

-- Add more Doctors
INSERT INTO doctors (user_id, specialization, license_number, experience_years, consultation_fee, rating, availability_status) VALUES
(11, 'Dermatology', 'LIC005', 7, 350.00, 4.7, 'available'),
(12, 'Pediatrics', 'LIC006', 9, 400.00, 4.8, 'available');

-- Add more Patients
INSERT INTO patients (user_id, blood_type, date_of_birth, gender, medical_history, allergies) VALUES
(13, 'A-', '1998-02-14', 'female', 'No major history', 'None'),
(14, 'B-', '1991-06-22', 'male', 'Migraine', 'Codeine'),
(15, 'AB-', '1993-11-05', 'female', 'No major history', 'Latex'),
(16, 'O+', '1987-09-18', 'male', 'Asthma', 'Sulfa');

-- Add more Appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, symptoms, status) VALUES
(6, 2, '2026-03-01', '10:00', 'Skin consultation', 'Acne problem', 'scheduled'),
(7, 3, '2026-03-02', '14:00', 'Pediatric checkup', 'Growth monitoring', 'scheduled'),
(8, 1, '2026-03-03', '09:30', 'Follow-up', 'Previous treatment', 'scheduled'),
(9, 4, '2026-03-05', '15:30', 'Allergy consultation', 'Seasonal allergies', 'scheduled'),
(5, 2, '2026-03-07', '11:00', 'Skin check', 'Rash on arms', 'scheduled'),
(1, 3, '2026-03-08', '13:00', 'Child vaccination', 'Routine checkup', 'scheduled'),
(2, 4, '2026-03-10', '16:00', 'Bone density scan', 'Osteoporosis screening', 'scheduled'),
(3, 1, '2026-03-12', '10:30', 'Heart rhythm check', 'Arrhythmia', 'scheduled'),
(4, 2, '2026-03-14', '14:30', 'Skin biopsy', 'Mole examination', 'scheduled'),
(6, 3, '2026-03-15', '09:00', 'Vaccination', 'Immunization', 'scheduled');

-- Add more Prescriptions
INSERT INTO prescriptions (appointment_id, doctor_id, patient_id, medications, dosage, duration, instructions) VALUES
(9, 2, 6, 'Benzoyl Peroxide, Salicylic Acid', '2.5%, 2%', '60 days', 'Apply twice daily to affected areas'),
(10, 3, 7, 'Multivitamins, Calcium', 'Daily dose, 500mg', '30 days', 'Take with meals'),
(11, 1, 8, 'Lisinopril', '10mg', '30 days', 'Take once daily in morning'),
(12, 4, 9, 'Cetirizine, Loratadine', '10mg, 10mg', '30 days', 'Take as needed for allergies'),
(13, 2, 5, 'Tretinoin', '0.05%', '30 days', 'Apply at night only'),
(14, 3, 1, 'Vitamin D3', '400 IU', '60 days', 'Once daily with breakfast'),
(15, 4, 2, 'Alendronate', '70mg', '4 weeks', 'Once weekly with full glass of water'),
(16, 1, 3, 'Digoxin', '250mcg', '30 days', 'Take as prescribed'),
(17, 2, 4, 'Hydrocortisone cream', '1%', '14 days', 'Apply 2-3 times daily'),
(18, 3, 6, 'Amoxicillin-Clavulanic Acid', '500mg', '7 days', 'Take three times daily');

-- Add more Health Records
INSERT INTO health_records (patient_id, condition, blood_type, allergies, medications, notes) VALUES
(6, 'Acne', 'A-', 'None', 'Benzoyl Peroxide', 'Moderate acne, improving with treatment'),
(7, 'Healthy', 'B-', 'Codeine', 'None', 'Regular checkups, no issues'),
(8, 'Hypertension', 'AB-', 'Latex', 'Lisinopril 10mg daily', 'BP well controlled, monitor regularly'),
(9, 'Allergic Rhinitis', 'O+', 'Sulfa', 'Cetirizine', 'Seasonal allergies, antihistamines help');

-- Add more Reviews
INSERT INTO reviews (doctor_id, patient_id, rating, comment) VALUES
(5, 6, 5, 'Dr. Ananya is excellent! Very knowledgeable about dermatology.'),
(6, 7, 5, 'Best pediatrician! Very gentle with children.'),
(2, 8, 4, 'Good cardiologist, very experienced.'),
(3, 9, 4, 'Thorough examination, explained everything well.'),
(5, 5, 5, 'Fantastic treatment! Skin improved significantly.'),
(6, 1, 5, 'Wonderful doctor for kids!'),
(4, 2, 4, 'Professional and caring.'),
(1, 3, 5, 'Excellent care, highly recommended.'),
(5, 4, 5, 'Amazing results with treatment!'),
(3, 6, 4, 'Good doctor, very helpful.');

-- Add more Doctor Time Slots
INSERT INTO doctor_time_slots (doctor_id, day_of_week, start_time, end_time, is_available) VALUES
-- Dr. Ananya Desai (doctor_id 5)
(5, 'Monday', '10:00', '18:00', 1),
(5, 'Tuesday', '10:00', '18:00', 1),
(5, 'Wednesday', '14:00', '20:00', 1),
(5, 'Thursday', '10:00', '18:00', 1),
(5, 'Friday', '10:00', '16:00', 1),
(5, 'Saturday', '11:00', '15:00', 1),
-- Dr. Vikrant Singh (doctor_id 6)
(6, 'Monday', '09:00', '17:00', 1),
(6, 'Tuesday', '09:00', '17:00', 1),
(6, 'Wednesday', '09:00', '17:00', 1),
(6, 'Thursday', '09:00', '17:00', 1),
(6, 'Friday', '09:00', '14:00', 1),
(6, 'Saturday', '10:00', '13:00', 1);
