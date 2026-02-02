# MedCare Backend API - Complete Routes Documentation

## Base URL
```
http://localhost:5000/api
```

---

## 🔐 Authentication Routes

### Register New Patient
```
POST /api/auth/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient",
  "phone": "9876543210"
}
```
**Response:** Token + User data

---

### Patient Login
```
POST /api/auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123",
  "role": "patient"
}
```
**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

---

### Change Password
```
POST /api/auth/change-password
Authorization: Bearer <token>
```
**Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```
**Response:**
```json
{
  "message": "Password changed successfully"
}
```

---

### Logout
```
POST /api/auth/logout
```
**Response:**
```json
{
  "message": "Logout successful"
}
```

---

## 👤 Patient Routes

### Get Own Patient Profile
```
GET /api/patients/profile
Authorization: Bearer <token>
```
**Response:**
```json
{
  "patient": {
    "id": 1,
    "user_id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "blood_type": "O+",
    "date_of_birth": "1990-05-15",
    "gender": "male",
    "medical_history": "No major issues",
    "allergies": "Penicillin",
    "emergency_contact": "Jane Doe",
    "emergency_phone": "9876543211"
  }
}
```

---

### Update Own Patient Profile
```
PUT /api/patients/profile
Authorization: Bearer <token>
```
**Body:**
```json
{
  "blood_type": "O+",
  "date_of_birth": "1990-05-15",
  "gender": "male",
  "medical_history": "No major issues",
  "allergies": "Penicillin",
  "emergency_contact": "Jane Doe",
  "emergency_phone": "9876543211"
}
```
**Response:**
```json
{
  "message": "Patient profile updated successfully"
}
```

---

### Get Patient by ID (Admin/Self)
```
GET /api/patients/:id
Authorization: Bearer <token>
```
**Response:** Patient object

---

### Get All Patients (Admin Only)
```
GET /api/patients
Authorization: Bearer <token>
```
**Response:**
```json
{
  "patients": [
    { patient_object_1 },
    { patient_object_2 }
  ]
}
```

---

### Delete Patient (Admin Only)
```
DELETE /api/patients/:id
Authorization: Bearer <token>
```
**Response:**
```json
{
  "message": "Patient deleted successfully"
}
```

---

## 📅 Appointment Routes

### Create Appointment
```
POST /api/appointments
Authorization: Bearer <token>
```
**Body:**
```json
{
  "doctor_id": 1,
  "appointment_date": "2026-02-15",
  "appointment_time": "14:00",
  "reason": "General checkup",
  "symptoms": "Mild fever"
}
```
**Response:**
```json
{
  "message": "Appointment booked successfully",
  "appointmentId": 1
}
```

---

### Get My Appointments
```
GET /api/appointments
Authorization: Bearer <token>
```
**Response:**
```json
{
  "appointments": [
    {
      "id": 1,
      "patient_id": 1,
      "doctor_id": 1,
      "appointment_date": "2026-02-15",
      "appointment_time": "14:00",
      "reason": "General checkup",
      "symptoms": "Mild fever",
      "status": "scheduled",
      "notes": null,
      "doctor": {
        "id": 1,
        "name": "Dr. Smith",
        "specialization": "Cardiology"
      }
    }
  ]
}
```

---

### Get Appointment by ID
```
GET /api/appointments/:id
Authorization: Bearer <token>
```
**Response:** Appointment object

---

### Update Appointment
```
PUT /api/appointments/:id
Authorization: Bearer <token>
```
**Body:**
```json
{
  "status": "completed",
  "notes": "Patient doing well"
}
```
**Response:**
```json
{
  "message": "Appointment updated successfully"
}
```

---

### Cancel Appointment
```
DELETE /api/appointments/:id
Authorization: Bearer <token>
```
**Response:**
```json
{
  "message": "Appointment cancelled successfully"
}
```

---

## 📋 Health Records Routes

### Get My Health Records
```
GET /api/health-records
Authorization: Bearer <token>
```
**Response:**
```json
{
  "records": [
    {
      "id": 1,
      "patient_id": 1,
      "condition": "Hypertension",
      "blood_type": "O+",
      "allergies": "Penicillin",
      "medications": "Atenolol 50mg",
      "notes": "Monitor BP regularly",
      "created_at": "2026-02-01T10:00:00Z"
    }
  ]
}
```

---

### Create Health Record
```
POST /api/health-records
Authorization: Bearer <token>
```
**Body:**
```json
{
  "condition": "Hypertension",
  "blood_type": "O+",
  "allergies": "Penicillin",
  "medications": "Atenolol 50mg",
  "notes": "Monitor BP regularly"
}
```
**Response:**
```json
{
  "message": "Health record created successfully",
  "recordId": 1
}
```

---

### Get Health Record by ID
```
GET /api/health-records/:id
Authorization: Bearer <token>
```
**Response:** Health record object

---

### Update Health Record
```
PUT /api/health-records/:id
Authorization: Bearer <token>
```
**Body:**
```json
{
  "condition": "Hypertension",
  "blood_type": "O+",
  "allergies": "Penicillin",
  "medications": "Atenolol 50mg",
  "notes": "Updated notes"
}
```
**Response:**
```json
{
  "message": "Health record updated successfully"
}
```

---

### Delete Health Record
```
DELETE /api/health-records/:id
Authorization: Bearer <token>
```
**Response:**
```json
{
  "message": "Health record deleted successfully"
}
```

---

## 💊 Prescription Routes

### Get My Prescriptions
```
GET /api/prescriptions
Authorization: Bearer <token>
```
**Response:**
```json
{
  "prescriptions": [
    {
      "id": 1,
      "patient_id": 1,
      "doctor_id": 1,
      "medications": "Aspirin, Atorvastatin",
      "dosage": "100mg, 20mg",
      "duration": "30 days",
      "instructions": "Take once daily after meals",
      "created_at": "2026-02-01T10:00:00Z",
      "doctor": {
        "id": 1,
        "name": "Dr. Smith"
      }
    }
  ]
}
```

---

### Get Prescription by ID
```
GET /api/prescriptions/:id
Authorization: Bearer <token>
```
**Response:** Prescription object

---

### Create Prescription (Doctor Only)
```
POST /api/prescriptions
Authorization: Bearer <token>
```
**Body:**
```json
{
  "patient_id": 1,
  "medications": "Aspirin",
  "dosage": "100mg",
  "duration": "30 days",
  "instructions": "Take once daily after meals"
}
```
**Response:**
```json
{
  "message": "Prescription created successfully",
  "prescriptionId": 1
}
```

---

### Update Prescription
```
PUT /api/prescriptions/:id
Authorization: Bearer <token>
```
**Body:** Same as create

**Response:**
```json
{
  "message": "Prescription updated successfully"
}
```

---

### Delete Prescription
```
DELETE /api/prescriptions/:id
Authorization: Bearer <token>
```
**Response:**
```json
{
  "message": "Prescription deleted successfully"
}
```

---

## ⭐ Review Routes

### Get All Reviews
```
GET /api/reviews
```
**Response:**
```json
{
  "reviews": [
    {
      "id": 1,
      "doctor_id": 1,
      "patient_id": 1,
      "rating": 5,
      "review_text": "Excellent doctor!",
      "patient_name": "John Doe",
      "doctor_name": "Dr. Smith",
      "created_at": "2026-02-01T10:00:00Z"
    }
  ]
}
```

---

### Get Reviews for Doctor
```
GET /api/reviews/doctor/:doctorId
```
**Response:** Array of reviews for the doctor

---

### Create Review
```
POST /api/reviews
Authorization: Bearer <token>
```
**Body:**
```json
{
  "doctor_id": 1,
  "rating": 5,
  "review_text": "Excellent doctor!"
}
```
**Response:**
```json
{
  "message": "Review created successfully",
  "reviewId": 1
}
```

---

### Update Review
```
PUT /api/reviews/:id
Authorization: Bearer <token>
```
**Body:**
```json
{
  "rating": 4,
  "review_text": "Good doctor"
}
```
**Response:**
```json
{
  "message": "Review updated successfully"
}
```

---

### Delete Review
```
DELETE /api/reviews/:id
Authorization: Bearer <token>
```
**Response:**
```json
{
  "message": "Review deleted successfully"
}
```

---

## 👨‍⚕️ Doctor Routes

### Get All Doctors
```
GET /api/doctors
```
**Response:**
```json
{
  "doctors": [
    {
      "id": 1,
      "user_id": 2,
      "name": "Dr. Smith",
      "email": "smith@medcare.com",
      "phone": "9876543210",
      "specialization": "Cardiology",
      "license_number": "LIC001",
      "experience_years": 10,
      "consultation_fee": 500,
      "rating": 4.8,
      "availability_status": "available"
    }
  ]
}
```

---

### Get Doctor by ID
```
GET /api/doctors/:id
```
**Response:** Doctor object

---

### Create Doctor (Admin Only)
```
POST /api/doctors
Authorization: Bearer <token>
```
**Body:**
```json
{
  "name": "Dr. Smith",
  "email": "smith@medcare.com",
  "password": "password123",
  "phone": "9876543210",
  "specialization": "Cardiology",
  "license_number": "LIC001",
  "experience_years": 10,
  "consultation_fee": 500
}
```

---

### Update Doctor Profile
```
PUT /api/doctors/:id
Authorization: Bearer <token>
```
**Body:**
```json
{
  "specialization": "Cardiology",
  "experience_years": 11,
  "consultation_fee": 550,
  "bio": "Expert cardiologist",
  "availability_status": "available"
}
```
**Response:**
```json
{
  "message": "Doctor profile updated successfully"
}
```

---

### Delete Doctor (Admin Only)
```
DELETE /api/doctors/:id
Authorization: Bearer <token>
```

---

## ⏰ Time Slots Routes

### Get Doctor's Time Slots
```
GET /api/time-slots?doctor_id=:id
Authorization: Bearer <token>
```
**Response:**
```json
{
  "slots": [
    {
      "id": 1,
      "doctor_id": 1,
      "day_of_week": "Monday",
      "start_time": "09:00",
      "end_time": "17:00",
      "is_available": true
    }
  ]
}
```

---

### Create Time Slot (Admin/Doctor)
```
POST /api/time-slots
Authorization: Bearer <token>
```
**Body:**
```json
{
  "doctor_id": 1,
  "day_of_week": "Monday",
  "start_time": "09:00",
  "end_time": "17:00"
}
```

---

### Update Time Slot
```
PUT /api/time-slots/:id
Authorization: Bearer <token>
```
**Body:**
```json
{
  "start_time": "09:30",
  "end_time": "17:30",
  "is_available": true
}
```

---

### Delete Time Slot
```
DELETE /api/time-slots/:id
Authorization: Bearer <token>
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid credentials or token expired"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error",
  "error": "Error message (development only)"
}
```

---

## 🔒 Authorization Header Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ✅ Common Status Codes

- **200** - OK (successful GET, PUT, DELETE)
- **201** - Created (successful POST)
- **400** - Bad Request (validation error)
- **401** - Unauthorized (no token or invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found (resource doesn't exist)
- **500** - Server Error

---

## 🧪 Test Credentials

### Patient
```
Email: manju@example.com
Password: patient123
```

### Doctor
```
Email: manjudoctor@example.com
Password: doctor123
```

### Admin
```
Email: admin@example.com
Password: admin123
```

---

## 📝 Notes

1. All protected endpoints require JWT token in Authorization header
2. Patient can only access their own data (profile, appointments, health records, prescriptions, reviews)
3. Doctor can access patient appointments and create prescriptions
4. Admin can access all data
5. Timestamps are in ISO 8601 format
6. All timestamps use UTC timezone
