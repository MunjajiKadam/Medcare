-- Create Database
CREATE DATABASE IF NOT EXISTS medcare_db;
USE medcare_db;

-- Users Table (for all roles)
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('patient', 'doctor', 'admin') NOT NULL,
  phone VARCHAR(20),
  profile_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active'
);

-- Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE NOT NULL,
  specialization VARCHAR(100) NOT NULL,
  license_number VARCHAR(100) UNIQUE NOT NULL,
  experience_years INT,
  consultation_fee DECIMAL(10, 2),
  bio TEXT,
  rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  availability_status ENUM('available', 'busy', 'on_leave') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Patients Table
CREATE TABLE IF NOT EXISTS patients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE NOT NULL,
  blood_type VARCHAR(5),
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other'),
  medical_history TEXT,
  allergies TEXT,
  emergency_contact VARCHAR(255),
  emergency_phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  reason_for_visit VARCHAR(255),
  symptoms TEXT,
  status ENUM('scheduled', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
  notes TEXT,
  prescription_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- Prescriptions Table
CREATE TABLE IF NOT EXISTS prescriptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  appointment_id INT NOT NULL,
  doctor_id INT NOT NULL,
  patient_id INT NOT NULL,
  medications TEXT NOT NULL,
  dosage TEXT,
  duration VARCHAR(100),
  instructions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Health Records Table
CREATE TABLE IF NOT EXISTS health_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT NOT NULL,
  record_type VARCHAR(100),
  record_value VARCHAR(255),
  record_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  doctor_id INT NOT NULL,
  patient_id INT NOT NULL,
  rating INT CHECK(rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Time Slots Table
CREATE TABLE IF NOT EXISTS doctor_time_slots (
  id INT PRIMARY KEY AUTO_INCREMENT,
  doctor_id INT NOT NULL,
  day_of_week VARCHAR(10),
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- Consultation Notes Table
CREATE TABLE IF NOT EXISTS consultation_notes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  appointment_id INT NOT NULL,
  doctor_id INT NOT NULL,
  patient_id INT NOT NULL,
  notes TEXT NOT NULL,
  vitals JSON,
  observations TEXT,
  follow_up TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Diagnoses Table
CREATE TABLE IF NOT EXISTS diagnoses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  appointment_id INT NOT NULL,
  doctor_id INT NOT NULL,
  patient_id INT NOT NULL,
  diagnosis TEXT NOT NULL,
  icd_code VARCHAR(20),
  severity ENUM('mild', 'moderate', 'severe') DEFAULT 'mild',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Doctor Availability Status History Table
CREATE TABLE IF NOT EXISTS availability_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  doctor_id INT NOT NULL,
  status ENUM('available', 'busy', 'on_leave') NOT NULL,
  start_date DATETIME,
  end_date DATETIME,
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_role ON users(role);
CREATE INDEX idx_doctor_user ON doctors(user_id);
CREATE INDEX idx_doctor_specialization ON doctors(specialization);
CREATE INDEX idx_patient_user ON patients(user_id);
CREATE INDEX idx_appointment_patient ON appointments(patient_id);
CREATE INDEX idx_appointment_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointment_date ON appointments(appointment_date);
CREATE INDEX idx_prescription_appointment ON prescriptions(appointment_id);
CREATE INDEX idx_health_records_patient ON health_records(patient_id);
CREATE INDEX idx_reviews_doctor ON reviews(doctor_id);
CREATE INDEX idx_time_slots_doctor ON doctor_time_slots(doctor_id);
CREATE INDEX idx_consultation_notes_appointment ON consultation_notes(appointment_id);
CREATE INDEX idx_consultation_notes_doctor ON consultation_notes(doctor_id);
CREATE INDEX idx_diagnoses_appointment ON diagnoses(appointment_id);
CREATE INDEX idx_diagnoses_doctor ON diagnoses(doctor_id);
CREATE INDEX idx_availability_history_doctor ON availability_history(doctor_id);
