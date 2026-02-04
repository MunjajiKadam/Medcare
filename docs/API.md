# MedCare API Documentation

Complete API reference for the MedCare Healthcare Management System.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

### Success Response
```json
{
  "data": { ... },
  "message": "Success message"
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

## Status Codes

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient",
  "phone": "1234567890"
}
```

**Response:** `201 Created`
```json
{
  "message": "Registration successful"
}
```

---

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

---

### Admin Login
```http
POST /api/auth/admin/login
```

**Request Body:**
```json
{
  "email": "admin@medcare.com",
  "password": "admin123"
}
```

**Response:** Same as regular login

---

### Get Profile
```http
GET /api/auth/profile
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "patient",
  "phone": "1234567890",
  "profile_image": null
}
```

---

### Update Profile
```http
PUT /api/auth/profile
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "9876543210",
  "profile_image": "https://example.com/image.jpg"
}
```

**Response:** `200 OK`
```json
{
  "message": "Profile updated successfully"
}
```

---

## Doctor Endpoints

### Get All Doctors
```http
GET /api/doctors
```

**Query Parameters:**
- `specialization` (optional) - Filter by specialization

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Dr. Sarah Johnson",
    "email": "sarah@medcare.com",
    "specialization": "Dermatology",
    "experience_years": 10,
    "consultation_fee": 150.00,
    "rating": 4.5,
    "total_reviews": 25,
    "availability_status": "available"
  }
]
```

---

### Get Doctor by ID
```http
GET /api/doctors/:id
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Dr. Sarah Johnson",
  "email": "sarah@medcare.com",
  "specialization": "Dermatology",
  "license_number": "DRM12345",
  "experience_years": 10,
  "consultation_fee": 150.00,
  "bio": "Experienced dermatologist...",
  "rating": 4.5,
  "total_reviews": 25,
  "availability_status": "available"
}
```

---

### Update Doctor
```http
PUT /api/doctors/:id
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "bio": "Updated bio",
  "consultation_fee": 200.00,
  "availability_status": "available"
}
```

**Response:** `200 OK`

---

## Appointment Endpoints

### Get Appointments
```http
GET /api/appointments
```

**Headers:** `Authorization: Bearer <token>`

**Response:** Returns appointments based on user role
- Patients: Their own appointments
- Doctors: Their appointments with patients
- Admins: All appointments

```json
[
  {
    "id": 1,
    "patient_name": "John Doe",
    "doctor_name": "Dr. Sarah Johnson",
    "appointment_date": "2026-03-15",
    "appointment_time": "10:00",
    "reason_for_visit": "Skin consultation",
    "status": "scheduled"
  }
]
```

---

### Book Appointment
```http
POST /api/appointments
```

**Headers:** `Authorization: Bearer <token>` (Patient only)

**Request Body:**
```json
{
  "doctor_id": 1,
  "appointment_date": "2026-03-15",
  "appointment_time": "10:00",
  "reason_for_visit": "Skin consultation",
  "symptoms": "Acne problem"
}
```

**Response:** `201 Created`
```json
{
  "message": "Appointment booked successfully",
  "appointmentId": 1
}
```

---

### Update Appointment Status
```http
PUT /api/appointments/:id/status
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "completed"
}
```

**Allowed Status Values:**
- `scheduled`
- `confirmed`
- `completed`
- `cancelled`
- `no_show`

**Response:** `200 OK`

---

## Prescription Endpoints

### Get Prescriptions
```http
GET /api/prescriptions
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "appointment_id": 1,
    "doctor_name": "Dr. Sarah Johnson",
    "patient_name": "John Doe",
    "medications": "Benzoyl Peroxide",
    "dosage": "2.5%",
    "duration": "60 days",
    "instructions": "Apply twice daily",
    "created_at": "2026-02-04T10:00:00Z"
  }
]
```

---

### Create Prescription
```http
POST /api/prescriptions
```

**Headers:** `Authorization: Bearer <token>` (Doctor only)

**Request Body:**
```json
{
  "appointment_id": 1,
  "patient_id": 5,
  "medications": "Benzoyl Peroxide",
  "dosage": "2.5%",
  "duration": "60 days",
  "instructions": "Apply twice daily to affected areas"
}
```

**Response:** `201 Created`

---

## Health Record Endpoints

### Get Patient Health Records
```http
GET /api/health-records/patient/:patientId
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "patient_id": 5,
    "record_type": "Blood Type",
    "record_value": "O+",
    "record_date": "2026-02-01"
  }
]
```

---

### Create Health Record
```http
POST /api/health-records
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "patient_id": 5,
  "record_type": "Blood Pressure",
  "record_value": "120/80",
  "record_date": "2026-02-04"
}
```

**Response:** `201 Created`

---

## Notification Endpoints

### Get User Notifications
```http
GET /api/notifications
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Appointment Confirmed",
    "message": "Your appointment with Dr. Sarah Johnson has been confirmed",
    "type": "appointment",
    "is_read": false,
    "created_at": "2026-02-04T10:00:00Z"
  }
]
```

---

### Get Unread Count
```http
GET /api/notifications/unread-count
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "count": 5
}
```

---

### Mark as Read
```http
PUT /api/notifications/:id/read
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### Mark All as Read
```http
PUT /api/notifications/mark-all-read
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

## Review Endpoints

### Get Doctor Reviews
```http
GET /api/reviews/doctor/:doctorId
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "patient_name": "John Doe",
    "rating": 5,
    "review_text": "Excellent doctor!",
    "created_at": "2026-02-01T10:00:00Z"
  }
]
```

---

### Create Review
```http
POST /api/reviews
```

**Headers:** `Authorization: Bearer <token>` (Patient only)

**Request Body:**
```json
{
  "doctor_id": 1,
  "rating": 5,
  "review_text": "Excellent doctor! Very professional."
}
```

**Response:** `201 Created`

---

## Time Slot Endpoints

### Get Doctor Time Slots
```http
GET /api/time-slots/doctor/:doctorId
```

**Query Parameters:**
- `date` (optional) - Filter by specific date

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "day_of_week": "Monday",
    "start_time": "09:00",
    "end_time": "17:00",
    "is_available": true
  }
]
```

---

### Create Time Slot
```http
POST /api/time-slots
```

**Headers:** `Authorization: Bearer <token>` (Doctor only)

**Request Body:**
```json
{
  "day_of_week": "Monday",
  "start_time": "09:00",
  "end_time": "17:00",
  "is_available": true
}
```

**Response:** `201 Created`

---

## Diagnosis Endpoints

### Get Diagnosis for Appointment
```http
GET /api/diagnoses/appointment/:appointmentId
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "id": 1,
  "appointment_id": 1,
  "diagnosis_text": "Acne vulgaris",
  "severity": "Moderate",
  "created_at": "2026-02-04T10:00:00Z"
}
```

---

### Create Diagnosis
```http
POST /api/diagnoses
```

**Headers:** `Authorization: Bearer <token>` (Doctor only)

**Request Body:**
```json
{
  "appointment_id": 1,
  "diagnosis_text": "Acne vulgaris",
  "severity": "Moderate",
  "notes": "Prescribing topical treatment"
}
```

**Response:** `201 Created`

---

## Consultation Notes Endpoints

### Get Notes for Appointment
```http
GET /api/consultation-notes/appointment/:appointmentId
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "id": 1,
  "appointment_id": 1,
  "notes": "Patient presents with acne...",
  "created_at": "2026-02-04T10:00:00Z"
}
```

---

### Create Consultation Notes
```http
POST /api/consultation-notes
```

**Headers:** `Authorization: Bearer <token>` (Doctor only)

**Request Body:**
```json
{
  "appointment_id": 1,
  "notes": "Patient presents with moderate acne. Recommended topical treatment."
}
```

**Response:** `201 Created`

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| AUTH_001 | Invalid credentials | Email or password incorrect |
| AUTH_002 | Token expired | JWT token has expired |
| AUTH_003 | Unauthorized | Missing authentication token |
| AUTH_004 | Forbidden | Insufficient permissions |
| VAL_001 | Validation error | Request data validation failed |
| DB_001 | Database error | Database operation failed |
| RES_001 | Resource not found | Requested resource doesn't exist |

---

## Rate Limiting

Currently not implemented. Future versions will include:
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## Versioning

Current API version: `v1`

Future versions will be accessible via `/api/v2`, `/api/v3`, etc.

---

## Support

For API support, contact: api-support@medcare.com
