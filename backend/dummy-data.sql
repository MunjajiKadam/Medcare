-- Dummy/Fake Data for MedCare Database
-- This file contains sample data for testing admin pages

USE medcare_db;

-- Insert Users (Patients, Doctors, Admin)
INSERT INTO users (name, email, password, role, phone, status) VALUES
('Admin User', 'admin@medcare.com', '$2a$10$HMbh9xPVE5T1.uJ2yPKSUOY9KyZDLMzrA8Cv0iKg2N4L2VJ0EIPQ2', 'admin', '9876543210', 'active'),
('Dr. Rajesh Kumar', 'rajesh@medcare.com', '$2a$10$GVvJ/ixKnRDhP5xDvXQvGOwTb7D5iHa9OJ5Rb2Kt5E8xN9H8K0L6O', 'doctor', '9123456789', 'active'),
('Dr. Priya Sharma', 'priya@medcare.com', '$2a$10$GVvJ/ixKnRDhP5xDvXQvGOwTb7D5iHa9OJ5Rb2Kt5E8xN9H8K0L6O', 'doctor', '9123456790', 'active'),
('Dr. Amit Patel', 'amit@medcare.com', '$2a$10$GVvJ/ixKnRDhP5xDvXQvGOwTb7D5iHa9OJ5Rb2Kt5E8xN9H8K0L6O', 'doctor', '9123456791', 'active'),
('Manju Patient', 'manju@example.com', '$2a$10$L5nYrQs8E9j5D2kK3vP0F.YeKmWvXrT4I7nP2jQ9s8e6vX3hY1N4C', 'patient', '8765432109', 'active'),
('Ravi Gupta', 'ravi@example.com', '$2a$10$L5nYrQs8E9j5D2kK3vP0F.YeKmWvXrT4I7nP2jQ9s8e6vX3hY1N4C', 'patient', '8765432110', 'active'),
('Neha Singh', 'neha@example.com', '$2a$10$L5nYrQs8E9j5D2kK3vP0F.YeKmWvXrT4I7nP2jQ9s8e6vX3hY1N4C', 'patient', '8765432111', 'active'),
('Vikram Nair', 'vikram@example.com', '$2a$10$L5nYrQs8E9j5D2kK3vP0F.YeKmWvXrT4I7nP2jQ9s8e6vX3hY1N4C', 'patient', '8765432112', 'active'),
('Anjali Verma', 'anjali@example.com', '$2a$10$L5nYrQs8E9j5D2kK3vP0F.YeKmWvXrT4I7nP2jQ9s8e6vX3hY1N4C', 'patient', '8765432113', 'active'),
('Dr. Sanjay Reddy', 'sanjay@medcare.com', '$2a$10$GVvJ/ixKnRDhP5xDvXQvGOwTb7D5iHa9OJ5Rb2Kt5E8xN9H8K0L6O', 'doctor', '9123456792', 'active');

-- Insert Doctors
INSERT INTO doctors (user_id, specialization, license_number, experience_years, consultation_fee, rating, availability_status) VALUES
(2, 'Cardiology', 'LIC001', 12, 500.00, 4.8, 'available'),
(3, 'Neurology', 'LIC002', 8, 450.00, 4.6, 'available'),
(4, 'Orthopedics', 'LIC003', 10, 400.00, 4.5, 'available'),
(10, 'General Medicine', 'LIC004', 15, 300.00, 4.9, 'available');

-- Insert Patients
INSERT INTO patients (user_id, blood_type, date_of_birth, gender, medical_history, allergies) VALUES
(5, 'O+', '1990-05-15', 'female', 'No major history', 'Penicillin'),
(6, 'A+', '1985-08-20', 'male', 'Hypertension', 'None'),
(7, 'B+', '1992-03-10', 'female', 'Diabetes Type 2', 'Aspirin'),
(8, 'AB+', '1988-12-25', 'male', 'No major history', 'None'),
(9, 'O-', '1995-07-30', 'female', 'Thyroid issues', 'Iodine');

-- Insert Appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, symptoms, status) VALUES
(1, 2, '2026-02-10', '10:00', 'Heart checkup', 'Chest pain', 'scheduled'),
(2, 3, '2026-02-12', '14:30', 'Headache consultation', 'Severe headache', 'scheduled'),
(3, 4, '2026-02-15', '11:00', 'Knee pain', 'Right knee pain', 'completed'),
(4, 1, '2026-02-18', '15:00', 'General checkup', 'Regular checkup', 'scheduled'),
(5, 2, '2026-02-20', '09:00', 'Blood pressure monitoring', 'Hypertension follow-up', 'completed'),
(1, 4, '2026-02-22', '16:00', 'General consultation', 'Fever, cough', 'scheduled'),
(2, 1, '2026-02-25', '13:00', 'Heart monitoring', 'Palpitations', 'scheduled'),
(3, 3, '2026-02-28', '10:30', 'Migraine treatment', 'Chronic migraines', 'completed');

-- Insert Prescriptions
INSERT INTO prescriptions (appointment_id, doctor_id, patient_id, medications, dosage, duration, instructions) VALUES
(1, 2, 1, 'Aspirin, Atorvastatin', '100mg, 20mg', '30 days', 'Take once daily after meals'),
(2, 3, 2, 'Ibuprofen, Paracetamol', '400mg, 500mg', '7 days', 'Take as needed for pain'),
(3, 4, 3, 'Glucosamine, Calcium', '1500mg, 1000mg', '60 days', 'Take daily with water'),
(4, 1, 4, 'Amoxicillin', '500mg', '10 days', 'Take three times daily'),
(5, 2, 5, 'Metoprolol', '50mg', '30 days', 'Take once daily in morning'),
(6, 4, 1, 'Cough syrup, Paracetamol', 'As per label, 500mg', '5 days', 'Take as needed'),
(7, 1, 2, 'Aspirin', '100mg', '30 days', 'Take once daily'),
(8, 3, 3, 'Sumatriptan', '50mg', '30 days', 'Take at onset of migraine');

-- Insert Health Records
INSERT INTO health_records (patient_id, condition, blood_type, allergies, medications, notes) VALUES
(1, 'Hypertension', 'O+', 'Penicillin', 'Atenolol 50mg daily', 'Stable, monitor BP regularly'),
(2, 'Type 2 Diabetes', 'A+', 'None', 'Metformin 500mg twice daily', 'Fasting glucose: 120 mg/dL'),
(3, 'Hypothyroidism', 'B+', 'Aspirin', 'Levothyroxine 75mcg daily', 'TSH levels normal'),
(4, 'Asthma', 'AB+', 'None', 'Albuterol inhaler', 'Mild, well controlled'),
(5, 'Healthy', 'O-', 'Iodine', 'None', 'No known conditions');

-- Insert Reviews
INSERT INTO reviews (doctor_id, patient_id, rating, comment) VALUES
(2, 1, 5, 'Excellent doctor! Very attentive and caring. Highly recommended!'),
(3, 2, 4, 'Good consultation. Doctor listened to all concerns carefully.'),
(4, 3, 5, 'Outstanding service. Very professional and knowledgeable.'),
(1, 4, 4, 'Great doctor. Explained everything clearly.'),
(2, 5, 5, 'Best cardiologist in town! Very experienced.'),
(3, 1, 4, 'Good neurologist. Recommended by many patients.'),
(4, 2, 5, 'Orthopedic specialist. Very skilled in treatment.'),
(1, 3, 4, 'Good general physician. Friendly and helpful.');

-- Insert Doctor Time Slots
INSERT INTO doctor_time_slots (doctor_id, day_of_week, start_time, end_time, is_available) VALUES
(2, 'Monday', '09:00', '17:00', 1),
(2, 'Tuesday', '09:00', '17:00', 1),
(2, 'Wednesday', '09:00', '17:00', 1),
(2, 'Thursday', '09:00', '17:00', 1),
(2, 'Friday', '09:00', '14:00', 1),
(3, 'Monday', '10:00', '18:00', 1),
(3, 'Tuesday', '10:00', '18:00', 1),
(3, 'Wednesday', '14:00', '18:00', 1),
(3, 'Thursday', '10:00', '18:00', 1),
(3, 'Friday', '10:00', '16:00', 1),
(4, 'Monday', '08:00', '16:00', 1),
(4, 'Tuesday', '08:00', '16:00', 1),
(4, 'Wednesday', '08:00', '16:00', 1),
(4, 'Thursday', '08:00', '16:00', 1),
(4, 'Friday', '08:00', '14:00', 1),
(1, 'Monday', '11:00', '19:00', 1),
(1, 'Tuesday', '11:00', '19:00', 1),
(1, 'Wednesday', '11:00', '19:00', 1),
(1, 'Thursday', '11:00', '19:00', 1),
(1, 'Friday', '11:00', '17:00', 1);
