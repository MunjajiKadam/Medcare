-- Dummy Data for MedCare Application
-- Adding Patient: manju and Doctor: manjudoctor

-- Use the medcare database
USE medcare_db;

-- PATIENT: MANJU
-- Password: manju123 (hashed)
INSERT INTO users (name, email, password, role, phone, status)
VALUES ('Manju', 'manju@gmail.com', '$2a$10$L5nYrQs8E9j5D2kK3vP0F.YeKmWvXrT4I7nP2jQ9s8e6vX3hY1N4C', 'patient', '9876543210', 'active');

-- Get the user_id for manju (should be the last inserted id)
-- Then add patient profile for manju
INSERT INTO patients (user_id, blood_type, date_of_birth, gender, medical_history, allergies, emergency_contact, emergency_phone)
VALUES ((SELECT MAX(id) FROM users WHERE email = 'manju@gmail.com'), 'B+', '1992-03-15', 'male', 'None', 'Penicillin', 'Ramesh Kumar', '9876543211');

-- DOCTOR: MANJUDOCTOR
-- Password: manjudoctor123 (hashed)
INSERT INTO users (name, email, password, role, phone, status)
VALUES ('Dr. Manju Doctor', 'manjudoctor@medcare.com', '$2a$10$GVvJ/ixKnRDhP5xDvXQvGOwTb7D5iHa9OJ5Rb2Kt5E8xN9H8K0L6O', 'doctor', '9988776655', 'active');

-- Get the user_id for manjudoctor and add doctor profile
INSERT INTO doctors (user_id, specialization, license_number, experience_years, consultation_fee, bio, rating, total_reviews, availability_status)
VALUES ((SELECT MAX(id) FROM users WHERE email = 'manjudoctor@medcare.com'), 'General Practitioner', 'LIC-GP-MANJU-001', 12, 400, 'Highly experienced general practitioner with 12 years in the field. Specializes in preventive healthcare.', 4.7, 45, 'available');

-- Add doctor availability/time slots
INSERT INTO doctor_time_slots (doctor_id, day_of_week, start_time, end_time, is_available)
VALUES
((SELECT doctors.id FROM doctors JOIN users ON doctors.user_id = users.id WHERE users.email = 'manjudoctor@medcare.com'), 'Monday', '09:00:00', '12:00:00', TRUE),
((SELECT doctors.id FROM doctors JOIN users ON doctors.user_id = users.id WHERE users.email = 'manjudoctor@medcare.com'), 'Monday', '14:00:00', '17:00:00', TRUE),
((SELECT doctors.id FROM doctors JOIN users ON doctors.user_id = users.id WHERE users.email = 'manjudoctor@medcare.com'), 'Wednesday', '10:00:00', '13:00:00', TRUE),
((SELECT doctors.id FROM doctors JOIN users ON doctors.user_id = users.id WHERE users.email = 'manjudoctor@medcare.com'), 'Friday', '09:00:00', '12:00:00', TRUE),
((SELECT doctors.id FROM doctors JOIN users ON doctors.user_id = users.id WHERE users.email = 'manjudoctor@medcare.com'), 'Friday', '15:00:00', '18:00:00', TRUE);

-- Add a sample appointment between manju and manjudoctor
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason_for_visit, symptoms, status)
SELECT 
  patients.id,
  doctors.id,
  '2026-02-10',
  '10:30:00',
  'Routine Checkup',
  'General health checkup',
  'scheduled'
FROM patients 
JOIN users u1 ON patients.user_id = u1.id
JOIN doctors ON doctors.id IN (SELECT doctors.id FROM doctors JOIN users ON doctors.user_id = users.id WHERE users.email = 'manjudoctor@medcare.com')
WHERE u1.email = 'manju@gmail.com'
LIMIT 1;

-- Add a sample health record for manju
INSERT INTO health_records (patient_id, record_type, record_date, description, observations)
VALUES 
((SELECT patients.id FROM patients JOIN users ON patients.user_id = users.id WHERE users.email = 'manju@gmail.com'), 'General Checkup', '2026-02-01', 'Annual health checkup', 'Blood Pressure: 120/80, Temperature: 98.6F, Weight: 75kg');

-- Add a sample review from manju to manjudoctor
INSERT INTO reviews (doctor_id, patient_id, rating, review_text)
SELECT 
  doctors.id,
  patients.id,
  5,
  'Dr. Manju is very professional and listens carefully. Excellent consultation experience!'
FROM doctors
JOIN users ON doctors.user_id = users.id
JOIN patients ON patients.id = (SELECT id FROM patients LIMIT 1)
WHERE users.email = 'manjudoctor@medcare.com'
LIMIT 1;

-- Login Credentials:
-- Patient: manju@gmail.com / manju123
-- Doctor: manjudoctor@medcare.com / manjudoctor123
