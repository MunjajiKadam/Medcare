-- MedCare Dummy Data for Admin Dashboard
-- Insert sample data for testing admin pages

-- ==================== DOCTORS ====================
INSERT INTO doctors (user_id, specialization, phone, license_number, experience, bio, status) VALUES
(2, 'Cardiology', '9876543210', 'LIC001', 10, 'Expert in heart diseases', 'active'),
(3, 'Orthopedics', '9876543211', 'LIC002', 8, 'Specialist in bone and joint issues', 'active');

-- ==================== PATIENTS ====================
INSERT INTO patients (user_id, date_of_birth, blood_type, phone, emergency_contact, medical_history, status) VALUES
(4, '1990-05-15', 'O+', '9123456789', '9123456780', 'No known allergies', 'active'),
(5, '1985-08-22', 'B+', '9123456790', '9123456781', 'Diabetic', 'active');

-- ==================== APPOINTMENTS ====================
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status, notes) VALUES
(4, 2, '2026-02-10', '10:00:00', 'Chest pain checkup', 'confirmed', 'Patient reported chest pain'),
(5, 3, '2026-02-11', '14:30:00', 'Knee pain consultation', 'pending', 'Follow-up from previous injury'),
(4, 3, '2026-02-12', '11:00:00', 'Regular checkup', 'completed', 'Patient doing well');

-- ==================== HEALTH RECORDS ====================
INSERT INTO health_records (patient_id, record_type, record_value, record_date, notes) VALUES
(4, 'Blood Pressure', '120/80 mmHg', '2026-02-01', 'Normal'),
(4, 'Glucose Level', '95 mg/dL', '2026-02-01', 'Normal'),
(5, 'Blood Pressure', '140/90 mmHg', '2026-02-01', 'Slightly elevated'),
(5, 'Glucose Level', '180 mg/dL', '2026-02-01', 'Diabetic range');

-- ==================== PRESCRIPTIONS ====================
INSERT INTO prescriptions (patient_id, doctor_id, medication_name, dosage, duration, instructions, status) VALUES
(4, 2, 'Aspirin', '75mg', '30 days', 'Take one tablet daily after meals', 'active'),
(4, 2, 'Atorvastatin', '20mg', '60 days', 'Take one tablet at night', 'active'),
(5, 3, 'Metformin', '500mg', '90 days', 'Take twice daily', 'active'),
(5, 3, 'Paracetamol', '500mg', '7 days', 'Take as needed for pain', 'completed');

-- ==================== REVIEWS ====================
INSERT INTO reviews (patient_id, doctor_id, rating, comment, status) VALUES
(4, 2, 5, 'Dr. is very professional and caring. Explained everything clearly.', 'published'),
(5, 3, 4, 'Great service. Would have given 5 stars but had to wait a bit.', 'published'),
(4, 3, 5, 'Excellent treatment. Pain relief was immediate.', 'published');

-- ==================== DOCTOR TIME SLOTS ====================
INSERT INTO doctor_time_slots (doctor_id, day_of_week, start_time, end_time, is_available) VALUES
(2, 'Monday', '09:00:00', '12:00:00', true),
(2, 'Monday', '14:00:00', '17:00:00', true),
(2, 'Wednesday', '09:00:00', '12:00:00', true),
(2, 'Friday', '14:00:00', '17:00:00', true),
(3, 'Tuesday', '10:00:00', '13:00:00', true),
(3, 'Tuesday', '15:00:00', '18:00:00', true),
(3, 'Thursday', '10:00:00', '13:00:00', true);

-- ==================== SUMMARY ====================
-- Doctors: 2 (Dr. Manjudoctor - Cardiology, + 1 Orthopedist)
-- Patients: 2 (Manju patient, + 1 other)
-- Appointments: 3
-- Health Records: 4
-- Prescriptions: 4
-- Reviews: 3
-- Time Slots: 7

COMMIT;
