# Database Schema Documentation

Complete database schema for the MedCare Healthcare Management System.

## Database Overview

**Database Name:** `medcare_db`  
**Type:** MySQL  
**Charset:** utf8mb4  
**Collation:** utf8mb4_unicode_ci

---

## Entity Relationship Diagram

```
┌─────────────┐
│    users    │
└──────┬──────┘
       │
       ├──────────────┬──────────────┐
       │              │              │
┌──────▼──────┐ ┌────▼─────┐ ┌─────▼──────┐
│   doctors   │ │ patients │ │   (admin)  │
└──────┬──────┘ └────┬─────┘ └────────────┘
       │             │
       │    ┌────────┴────────┐
       │    │                 │
┌──────▼────▼──────┐   ┌─────▼──────────┐
│  appointments    │   │ health_records │
└──────┬───────────┘   └────────────────┘
       │
       ├──────────┬─────────────┬────────────┐
       │          │             │            │
┌──────▼───┐ ┌───▼────────┐ ┌──▼─────────┐ ┌▼──────────┐
│diagnosis │ │prescription│ │consultation│ │notifications│
│          │ │            │ │   notes    │ └────────────┘
└──────────┘ └────────────┘ └────────────┘

┌──────────────┐   ┌──────────────────┐
│   reviews    │   │ doctor_time_slots│
└──────────────┘   └──────────────────┘
```

---

## Tables

### 1. users

Stores all system users (patients, doctors, and administrators).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| `name` | VARCHAR(255) | NOT NULL | User's full name |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User's email address |
| `password` | VARCHAR(255) | NOT NULL | Hashed password |
| `role` | ENUM | NOT NULL | User role: 'patient', 'doctor', 'admin' |
| `phone` | VARCHAR(20) | | Phone number |
| `profile_image` | VARCHAR(255) | | Profile image URL |
| `status` | ENUM | DEFAULT 'active' | Account status: 'active', 'inactive', 'suspended' |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

**Indexes:**
- PRIMARY: `id`
- UNIQUE: `email`
- INDEX: `role`, `status`

---

### 2. doctors

Extended information for doctor accounts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique doctor identifier |
| `user_id` | INT | UNIQUE, NOT NULL, FOREIGN KEY | Reference to users table |
| `specialization` | VARCHAR(100) | NOT NULL | Medical specialization |
| `license_number` | VARCHAR(100) | UNIQUE, NOT NULL | Medical license number |
| `experience_years` | INT | | Years of medical experience |
| `consultation_fee` | DECIMAL(10,2) | | Consultation fee amount |
| `bio` | TEXT | | Professional biography |
| `rating` | DECIMAL(3,2) | DEFAULT 0 | Average rating (0-5) |
| `total_reviews` | INT | DEFAULT 0 | Total number of reviews |
| `availability_status` | ENUM | DEFAULT 'available' | 'available', 'busy', 'on_leave' |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

**Foreign Keys:**
- `user_id` → `users(id)` ON DELETE CASCADE

**Indexes:**
- PRIMARY: `id`
- UNIQUE: `user_id`, `license_number`
- INDEX: `specialization`, `availability_status`

---

### 3. patients

Extended information for patient accounts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique patient identifier |
| `user_id` | INT | UNIQUE, NOT NULL, FOREIGN KEY | Reference to users table |
| `blood_type` | VARCHAR(5) | | Blood type (A+, B-, etc.) |
| `date_of_birth` | DATE | | Date of birth |
| `gender` | ENUM | | 'male', 'female', 'other' |
| `medical_history` | TEXT | | Past medical history |
| `allergies` | TEXT | | Known allergies |
| `emergency_contact` | VARCHAR(255) | | Emergency contact name |
| `emergency_phone` | VARCHAR(20) | | Emergency contact phone |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

**Foreign Keys:**
- `user_id` → `users(id)` ON DELETE CASCADE

**Indexes:**
- PRIMARY: `id`
- UNIQUE: `user_id`

---

### 4. appointments

Appointment bookings between patients and doctors.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique appointment identifier |
| `patient_id` | INT | NOT NULL, FOREIGN KEY | Reference to patients table |
| `doctor_id` | INT | NOT NULL, FOREIGN KEY | Reference to doctors table |
| `appointment_date` | DATE | NOT NULL | Appointment date |
| `appointment_time` | TIME | NOT NULL | Appointment time |
| `reason_for_visit` | VARCHAR(255) | | Reason for appointment |
| `symptoms` | TEXT | | Patient symptoms |
| `status` | ENUM | DEFAULT 'scheduled' | 'scheduled', 'confirmed', 'completed', 'cancelled', 'no_show' |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Booking timestamp |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

**Foreign Keys:**
- `patient_id` → `patients(id)` ON DELETE CASCADE
- `doctor_id` → `doctors(id)` ON DELETE CASCADE

**Indexes:**
- PRIMARY: `id`
- INDEX: `patient_id`, `doctor_id`, `appointment_date`, `status`
- COMPOSITE: (`doctor_id`, `appointment_date`, `appointment_time`)

---

### 5. prescriptions

Medical prescriptions created by doctors.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique prescription identifier |
| `appointment_id` | INT | FOREIGN KEY | Reference to appointments table |
| `doctor_id` | INT | NOT NULL, FOREIGN KEY | Reference to doctors table |
| `patient_id` | INT | NOT NULL, FOREIGN KEY | Reference to patients table |
| `medications` | TEXT | NOT NULL | Prescribed medications |
| `dosage` | VARCHAR(255) | | Medication dosage |
| `duration` | VARCHAR(100) | | Treatment duration |
| `instructions` | TEXT | | Usage instructions |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Prescription creation timestamp |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

**Foreign Keys:**
- `appointment_id` → `appointments(id)` ON DELETE SET NULL
- `doctor_id` → `doctors(id)` ON DELETE CASCADE
- `patient_id` → `patients(id)` ON DELETE CASCADE

**Indexes:**
- PRIMARY: `id`
- INDEX: `appointment_id`, `doctor_id`, `patient_id`

---

### 6. health_records

Patient health records and medical history.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique record identifier |
| `patient_id` | INT | NOT NULL, FOREIGN KEY | Reference to patients table |
| `record_type` | VARCHAR(100) | NOT NULL | Type of record |
| `record_value` | TEXT | | Record value/details |
| `record_date` | DATE | | Date of record |
| `notes` | TEXT | | Additional notes |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

**Foreign Keys:**
- `patient_id` → `patients(id)` ON DELETE CASCADE

**Indexes:**
- PRIMARY: `id`
- INDEX: `patient_id`, `record_type`, `record_date`

---

### 7. reviews

Patient reviews and ratings for doctors.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique review identifier |
| `doctor_id` | INT | NOT NULL, FOREIGN KEY | Reference to doctors table |
| `patient_id` | INT | NOT NULL, FOREIGN KEY | Reference to patients table |
| `rating` | INT | NOT NULL, CHECK (1-5) | Rating (1-5 stars) |
| `review_text` | TEXT | | Review content |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Review creation timestamp |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

**Foreign Keys:**
- `doctor_id` → `doctors(id)` ON DELETE CASCADE
- `patient_id` → `patients(id)` ON DELETE CASCADE

**Indexes:**
- PRIMARY: `id`
- INDEX: `doctor_id`, `patient_id`
- COMPOSITE: (`doctor_id`, `rating`)

---

### 8. doctor_time_slots

Doctor availability schedule.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique time slot identifier |
| `doctor_id` | INT | NOT NULL, FOREIGN KEY | Reference to doctors table |
| `day_of_week` | VARCHAR(20) | NOT NULL | Day of the week |
| `start_time` | TIME | NOT NULL | Start time |
| `end_time` | TIME | NOT NULL | End time |
| `is_available` | BOOLEAN | DEFAULT TRUE | Availability flag |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

**Foreign Keys:**
- `doctor_id` → `doctors(id)` ON DELETE CASCADE

**Indexes:**
- PRIMARY: `id`
- INDEX: `doctor_id`, `day_of_week`
- COMPOSITE: (`doctor_id`, `day_of_week`, `is_available`)

---

### 9. notifications

System notifications for users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique notification identifier |
| `user_id` | INT | NOT NULL, FOREIGN KEY | Reference to users table |
| `title` | VARCHAR(255) | NOT NULL | Notification title |
| `message` | TEXT | NOT NULL | Notification message |
| `type` | ENUM | DEFAULT 'general' | 'appointment', 'prescription', 'review', 'general', 'system' |
| `is_read` | BOOLEAN | DEFAULT FALSE | Read status |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Notification timestamp |

**Foreign Keys:**
- `user_id` → `users(id)` ON DELETE CASCADE

**Indexes:**
- PRIMARY: `id`
- INDEX: `user_id`, `is_read`, `created_at`
- COMPOSITE: (`user_id`, `is_read`)

---

### 10. consultation_notes

Doctor's notes from patient consultations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique note identifier |
| `appointment_id` | INT | NOT NULL, FOREIGN KEY | Reference to appointments table |
| `doctor_id` | INT | NOT NULL, FOREIGN KEY | Reference to doctors table |
| `notes` | TEXT | NOT NULL | Consultation notes |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Note creation timestamp |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

**Foreign Keys:**
- `appointment_id` → `appointments(id)` ON DELETE CASCADE
- `doctor_id` → `doctors(id)` ON DELETE CASCADE

**Indexes:**
- PRIMARY: `id`
- UNIQUE: `appointment_id`
- INDEX: `doctor_id`

---

### 11. diagnoses

Medical diagnoses for appointments.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique diagnosis identifier |
| `appointment_id` | INT | NOT NULL, FOREIGN KEY | Reference to appointments table |
| `doctor_id` | INT | NOT NULL, FOREIGN KEY | Reference to doctors table |
| `diagnosis_text` | TEXT | NOT NULL | Diagnosis details |
| `severity` | VARCHAR(50) | | Severity level |
| `notes` | TEXT | | Additional notes |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Diagnosis timestamp |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

**Foreign Keys:**
- `appointment_id` → `appointments(id)` ON DELETE CASCADE
- `doctor_id` → `doctors(id)` ON DELETE CASCADE

**Indexes:**
- PRIMARY: `id`
- UNIQUE: `appointment_id`
- INDEX: `doctor_id`

---

## Common Queries

### Get doctor with their appointments
```sql
SELECT d.*, u.name, u.email, COUNT(a.id) as appointment_count
FROM doctors d
JOIN users u ON d.user_id = u.id
LEFT JOIN appointments a ON d.id = a.doctor_id
WHERE d.id = ?
GROUP BY d.id;
```

### Get patient's upcoming appointments
```sql
SELECT a.*, d.specialization, u.name as doctor_name
FROM appointments a
JOIN doctors d ON a.doctor_id = d.id
JOIN users u ON d.user_id = u.id
WHERE a.patient_id = ? 
  AND a.appointment_date >= CURDATE()
  AND a.status != 'cancelled'
ORDER BY a.appointment_date, a.appointment_time;
```

### Calculate doctor's average rating
```sql
SELECT AVG(rating) as avg_rating, COUNT(*) as review_count
FROM reviews
WHERE doctor_id = ?;
```

---

## Database Maintenance

### Backup
```bash
mysqldump -u root -p medcare_db > backup_$(date +%Y%m%d).sql
```

### Restore
```bash
mysql -u root -p medcare_db < backup_20260204.sql
```

### Optimize Tables
```sql
OPTIMIZE TABLE appointments, prescriptions, notifications;
```

---

## Performance Considerations

- All foreign keys have indexes
- Composite indexes on frequently queried column combinations
- Regular index optimization recommended
- Consider partitioning large tables (appointments, notifications) by date

---

## Security

- Passwords stored as bcrypt hashes
- Sensitive data (medical history, allergies) in separate tables
- Cascading deletes to maintain referential integrity
- Regular backup schedule recommended
