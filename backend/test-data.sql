-- Test Data for MedCare Application

-- IMPORTANT: Passwords MUST be hashed with bcrypt before inserting!
-- Use online bcrypt generator: https://bcrypt-generator.com/
-- Or use Node.js: const bcrypt = require('bcryptjs'); bcrypt.hashSync('password123', 10)

-- Hashed password: "admin123" = $2a$10$HMbh9xPVE5T1.uJ2yPKSUOY9KyZDLMzrA8Cv0iKg2N4L2VJ0EIPQ2
-- Hashed password: "doctor123" = $2a$10$GVvJ/ixKnRDhP5xDvXQvGOwTb7D5iHa9OJ5Rb2Kt5E8xN9H8K0L6O
-- Hashed password: "patient123" = $2a$10$L5nYrQs8E9j5D2kK3vP0F.YeKmWvXrT4I7nP2jQ9s8e6vX3hY1N4C

-- ADMIN
INSERT INTO users (name, email, password, role, phone, status)
VALUES
('Admin MedCare', 'admin@medcare.com', '$2a$10$HMbh9xPVE5T1.uJ2yPKSUOY9KyZDLMzrA8Cv0iKg2N4L2VJ0EIPQ2', 'admin', '9999999999', 'active');

-- DOCTORS
INSERT INTO users (name, email, password, role, phone, status)
VALUES
('Dr. John Smith', 'john@medcare.com', '$2a$10$GVvJ/ixKnRDhP5xDvXQvGOwTb7D5iHa9OJ5Rb2Kt5E8xN9H8K0L6O', 'doctor', '8888888888', 'active'),
('Dr. Emily Brown', 'emily@medcare.com', '$2a$10$GVvJ/ixKnRDhP5xDvXQvGOwTb7D5iHa9OJ5Rb2Kt5E8xN9H8K0L6O', 'doctor', '7777777777', 'active');

-- PATIENTS
INSERT INTO users (name, email, password, role, phone, status)
VALUES
('Rahul Sharma', 'rahul@gmail.com', '$2a$10$L5nYrQs8E9j5D2kK3vP0F.YeKmWvXrT4I7nP2jQ9s8e6vX3hY1N4C', 'patient', '6666666666', 'active'),
('Anita Verma', 'anita@gmail.com', '$2a$10$L5nYrQs8E9j5D2kK3vP0F.YeKmWvXrT4I7nP2jQ9s8e6vX3hY1N4C', 'patient', '5555555555', 'active');

-- Doctor Profiles (link to users created above)
INSERT INTO doctors (user_id, specialization, license_number, experience_years, consultation_fee, bio, rating, total_reviews, availability_status)
VALUES
(2, 'Cardiologist', 'LIC-CARD-001', 10, 600, 'Experienced heart specialist with 10+ years of experience', 4.8, 52, 'available'),
(3, 'Dermatologist', 'LIC-DERM-002', 8, 500, 'Expert in skin care and dermatology', 4.9, 48, 'available');

-- Patient Profiles (link to users created above)
INSERT INTO patients (user_id, blood_type, date_of_birth, gender, medical_history, allergies, emergency_contact, emergency_phone)
VALUES
(4, 'O+', '1995-05-12', 'male', 'High BP', 'Dust allergy', 'Suresh Sharma', '9991112222'),
(5, 'A+', '1998-09-20', 'female', 'Diabetes', 'None', 'Raj Verma', '8882223333');

-- Sample Appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason_for_visit, symptoms, status)
VALUES
(1, 1, '2026-02-05', '10:00:00', 'General Checkup', 'Chest pain', 'scheduled'),
(2, 2, '2026-02-06', '14:30:00', 'Skin Consultation', 'Skin rash', 'scheduled');

-- Sample Reviews
INSERT INTO reviews (doctor_id, patient_id, rating, review_text)
VALUES
(1, 1, 5, 'Dr. John is very professional and caring. Highly recommended!'),
(2, 2, 5, 'Great dermatologist. Very attentive to patient needs.');

-- Sample Doctor Time Slots
INSERT INTO doctor_time_slots (doctor_id, day_of_week, start_time, end_time, is_available)
VALUES
(1, 'Monday', '09:00:00', '12:00:00', TRUE),
(1, 'Monday', '14:00:00', '17:00:00', TRUE),
(2, 'Tuesday', '10:00:00', '13:00:00', TRUE),
(2, 'Tuesday', '15:00:00', '18:00:00', TRUE);

-- Test Credentials:
-- Admin: admin@medcare.com / admin123
-- Doctor: john@medcare.com / doctor123
-- Patient: rahul@gmail.com / patient123
