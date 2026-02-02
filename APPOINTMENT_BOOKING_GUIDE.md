# Patient Appointment Booking - Implementation Guide

## Overview
Complete implementation of patient appointment booking with doctors, including multi-step form, API integration, and confirmation.

---

## Frontend Implementation

### File: `src/pages/user/BookAppointment.jsx`

#### Features Implemented:
1. **Multi-Step Form (3 Steps)**
   - Step 1: Select Date (Next 7 days)
   - Step 2: Select Time (9 AM - 5 PM)
   - Step 3: Enter Appointment Details

2. **Doctor Information Display**
   - Fetches doctor details via API
   - Shows name, specialization, consultation fee
   - Loading state while fetching

3. **Date Selection**
   - Generates next 7 days
   - Shows day name and date
   - Prevents past date selection

4. **Time Selection**
   - Generates 1-hour intervals (9:00 - 16:00)
   - Shows in 24-hour format
   - Fetches available slots from backend

5. **Appointment Details**
   - Reason dropdown with predefined options
   - Symptoms/description textarea
   - Appointment summary preview

6. **Confirmation**
   - Success page with appointment details
   - Links to view appointments
   - Back to dashboard option

7. **Error Handling**
   - Display error messages
   - Validation for required fields
   - Loading states for submissions

---

## Backend Implementation

### Appointment Creation Flow

#### Endpoint: `POST /api/appointments`
**Authorization:** Bearer token (Patient only)

**Request Body:**
```json
{
  "doctor_id": 1,
  "appointment_date": "2026-02-15",
  "appointment_time": "14:00",
  "reason_for_visit": "General Checkup",
  "symptoms": "Mild fever"
}
```

**Response:**
```json
{
  "message": "Appointment created successfully",
  "appointmentId": 5
}
```

#### File: `backend/controllers/appointmentController.js`

**Function:** `createAppointment`

**Validation:**
1. Patient record exists
2. Doctor exists
3. No duplicate appointments at same time
4. Date is valid and future

**Process:**
1. Get patient ID from JWT token
2. Fetch patient record from patients table
3. Verify doctor exists
4. Check for duplicate appointments
5. Insert appointment with status='scheduled'
6. Return appointment ID

---

## API Integration

### File: `src/api/api.js`

```javascript
// Appointment API
export const appointmentAPI = {
  createAppointment: (data) => axios.post('/appointments', data),
  getAppointments: () => axios.get('/appointments'),
  updateAppointment: (id, data) => axios.put(`/appointments/${id}`, data),
  cancelAppointment: (id) => axios.delete(`/appointments/${id}`)
};

// Time Slot API
export const timeSlotAPI = {
  getTimeSlots: (params) => axios.get('/time-slots', { params })
};

// Doctor API
export const doctorAPI = {
  getDoctorById: (id) => axios.get(`/doctors/${id}`)
};
```

---

## User Flow

### 1. Patient Navigates to Book Appointment
```
Patient Dashboard → Browse Doctors → Select Doctor → "Book Appointment"
```

### 2. URL Routing
```
/user/book/:doctorId
```
- Doctor ID passed as URL parameter
- Fetched via `useParams()`

### 3. Step 1: Select Date
```
- Display next 7 days
- User selects one date
- Date stored in state
- Time options reset
- Click "Next: Select Time"
```

### 4. Step 2: Select Time
```
- Display available time slots (1-hour intervals)
- User selects time
- Time stored in state
- Click "Next: Details"
```

### 5. Step 3: Enter Details
```
- User selects reason from dropdown
- User enters symptoms (optional)
- Preview appointment summary
- Click "Confirm & Book"
```

### 6. API Submission
```
POST /api/appointments
{
  doctor_id: parseInt(doctorId),
  appointment_date: selectedDate,
  appointment_time: selectedTime,
  reason_for_visit: reason,
  symptoms: symptoms
}
```

### 7. Success Confirmation
```
- Show success message
- Display appointment details
- Options to:
  - View My Appointments
  - Back to Dashboard
```

---

## Data Flow Diagram

```
Patient Component (BookAppointment.jsx)
    ↓
useParams() → Get doctorId from URL
    ↓
useEffect() → Fetch Doctor Details (doctorAPI.getDoctorById)
    ↓
Display Doctor Info
    ↓
Step 1: Select Date
    ↓
useEffect() → Fetch Time Slots (timeSlotAPI.getTimeSlots)
    ↓
Step 2: Select Time
    ↓
Step 3: Enter Details
    ↓
POST /api/appointments (appointmentAPI.createAppointment)
    ↓
Backend: appointmentController.createAppointment
    ↓
Validate → Database Insert → Response
    ↓
Success Page
```

---

## Component Structure

```jsx
BookAppointment Component
├── State
│   ├── step (1-3)
│   ├── selectedDate
│   ├── selectedTime
│   ├── reason
│   ├── symptoms
│   ├── doctor
│   ├── timeSlots
│   ├── loading
│   ├── error
│   ├── submitting
│   └── confirmed
├── Effects
│   ├── fetchDoctor() - Get doctor details
│   └── fetchTimeSlots() - Get available slots
├── Handlers
│   └── handleBookAppointment() - Submit booking
└── JSX
    ├── Navbar
    ├── Loading State
    ├── Success State
    ├── Form (Steps 1-3)
    └── Footer
```

---

## Status Codes & Errors

### Success (201)
```json
{
  "message": "Appointment created successfully",
  "appointmentId": 5
}
```

### Errors

**400 Bad Request**
```json
{
  "message": "Appointment already exists for this time"
}
```

**404 Not Found**
```json
{
  "message": "Doctor not found"
}
```

**500 Server Error**
```json
{
  "message": "Server error",
  "error": "Error details"
}
```

---

## Form Validation

### Client-Side (Frontend)
- Date required before moving to step 2
- Time required before moving to step 3
- Reason required before submission
- Date cannot be in past
- Future dates only (next 7 days)

### Server-Side (Backend)
- Patient record must exist
- Doctor must exist
- No duplicate appointments at same date/time
- Date format validation (YYYY-MM-DD)
- Time format validation (HH:MM)

---

## Testing Credentials

### Patient
```
Email: manju@example.com
Password: patient123
```

### Testing Steps
1. Login as patient
2. Go to Dashboard
3. Click "Book Appointment"
4. Click "Browse Doctors" or go to `/user/browse-doctors`
5. Click "Book Appointment" on a doctor card
6. Fill in the multi-step form
7. Confirm booking
8. Check "My Appointments" to see booked appointment

---

## Database Schema

### appointments Table
```sql
CREATE TABLE appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  reason_for_visit VARCHAR(255),
  symptoms TEXT,
  status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);
```

### doctor_time_slots Table
```sql
CREATE TABLE doctor_time_slots (
  id INT PRIMARY KEY AUTO_INCREMENT,
  doctor_id INT NOT NULL,
  day_of_week VARCHAR(10),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);
```

---

## Features Implemented

✅ Multi-step appointment booking form
✅ Doctor information display with loading
✅ Date selection (next 7 days)
✅ Time slot selection (1-hour intervals)
✅ Appointment details entry (reason, symptoms)
✅ Form validation (client & server)
✅ Error handling and display
✅ Success confirmation page
✅ API integration
✅ Navigation between steps
✅ Responsive design
✅ Loading states
✅ Accessibility

---

## Future Enhancements

- SMS/Email confirmation notifications
- Calendar view for available slots
- Rescheduling existing appointments
- Cancellation with reason
- Doctor availability based on actual schedule
- Payment integration (if consultation fees apply)
- Automatic appointment reminders
- Video consultation link generation
- Telemedicine integration

---

## Troubleshooting

### Issue: "Doctor not found" error
- Verify doctor ID in URL
- Check doctor exists in database
- Confirm GET /api/doctors/:id endpoint

### Issue: Time slots not loading
- Check GET /api/time-slots endpoint
- Verify doctor has time slots created
- Check query parameters format

### Issue: Appointment not saved
- Verify POST /api/appointments endpoint
- Check JWT token is valid
- Confirm patient record exists
- Check database connection

### Issue: Date not selectable
- Ensure date is in future
- Check date format (YYYY-MM-DD)
- Verify no validation errors

---

## API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/doctors/:id` | Fetch doctor details |
| GET | `/api/time-slots?doctor_id=id` | Fetch available time slots |
| POST | `/api/appointments` | Create appointment |
| GET | `/api/appointments` | Get user appointments |

---

**Status:** ✅ **COMPLETE**
Patient appointment booking is fully implemented with frontend UI, backend API, validation, and error handling.
