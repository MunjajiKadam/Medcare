# MedCare Application - Routes & Pages Documentation

## Complete Route Structure

### Public Routes
- **/** - Home Page
- **/about** - About MedCare
- **/services** - Services Page
- **/all-doctors** or **/doctors** - Browse All Doctors
- **/login** - Patient/User Login
- **/register** - Patient Registration
- **/admin/login** - Admin Login
- **/unauthorized** - Access Denied Page
- **/\*** - 404 Not Found Page

---

## User/Patient Routes

### Dashboard & Overview
- **GET /user/dashboard** - Patient Dashboard with quick stats and upcoming appointments
  - Components: Quick actions, Upcoming appointments, Health metrics
  - Protected: Requires 'patient' role

### Appointments
- **GET /user/appointments** - View all patient appointments
  - Filter by: All, Scheduled, Completed, Cancelled
  - Actions: Cancel appointment, View details
  - Protected: Requires 'patient' role

- **GET /user/book/:doctorId** - Book appointment with specific doctor
  - Steps: Select date/time, Enter reason, Confirm booking
  - Protected: Requires 'patient' role

- **GET /user/browse-doctors** - Browse and search doctors
  - Features: Search by name, Filter by specialty, View doctor details
  - Protected: Requires 'patient' role

### Health & Medical
- **GET /user/health-records** - View and manage health records
  - Features: Add new record, View past records, Edit records
  - Protected: Requires 'patient' role

- **GET /user/prescriptions** - View prescriptions
  - Display: Medications, Dosage, Duration, Doctor info
  - Protected: Requires 'patient' role

- **GET /user/reviews** - Write and view doctor reviews
  - Features: View own reviews, Write new review, Rate doctors
  - Protected: Requires 'patient' role

### Profile & Settings
- **GET /user/profile** - View and edit patient profile
  - Fields: Name, Email, Blood Type, DOB, Gender, Medical History, Allergies
  - Protected: Requires 'patient' role

- **GET /user/settings** - Account settings and preferences
  - Features: Change password, Notification settings, Account deletion
  - Protected: Requires 'patient' role

---

## Doctor Routes

### Dashboard
- **GET /doctor/dashboard** - Doctor Dashboard
  - Stats: Total appointments, Upcoming appointments, Patient count
  - Components: Quick actions, Recent appointments
  - Protected: Requires 'doctor' role

### Appointments
- **GET /doctor/appointments** - View doctor's appointments
  - Features: Manage appointments, View patient details, Mark as completed
  - Filter by: All, Scheduled, Completed
  - Protected: Requires 'doctor' role

### Profile & Management
- **GET /doctor/profile** - View and edit doctor profile
  - Fields: Specialization, License number, Consultation fee, Bio
  - Protected: Requires 'doctor' role

- **GET /doctor/doctors** - Browse other doctors (if needed)
  - Protected: Requires 'doctor' role

---

## Admin Routes

### Dashboard
- **GET /admin/dashboard** - Admin Dashboard with overview
  - Stats: Total users, Total doctors, Total appointments, Revenue
  - Components: User metrics, Recent activities, System status
  - Protected: Requires 'admin' role

### User Management
- **GET /admin/patients** - Manage all patients
  - Features: View list, Edit patient info, Delete patients, Export data
  - Columns: Name, Email, Blood Type, Phone, Status, Actions
  - Protected: Requires 'admin' role

- **GET /admin/doctors** - Manage all doctors
  - Features: Add doctor, Edit info, Delete doctor, Verify credentials
  - Columns: Name, Specialization, License, Experience, Rating, Actions
  - Protected: Requires 'admin' role

### Appointment Management
- **GET /admin/appointments** - Manage all appointments
  - Features: View appointments, Cancel appointment, Reschedule
  - Filters: By status, By doctor, By patient, By date range
  - Protected: Requires 'admin' role

### Medical Records
- **GET /admin/health-records** - Manage all health records
  - Features: View all records, Add records for patients, Edit, Delete
  - Protected: Requires 'admin' role

- **GET /admin/prescriptions** - Manage all prescriptions
  - Features: View prescriptions, Add prescription, Edit, Delete
  - Protected: Requires 'admin' role

### System Management
- **GET /admin/reviews** - Manage doctor reviews
  - Features: View all reviews, Delete inappropriate reviews, Monitor ratings
  - Protected: Requires 'admin' role

- **GET /admin/time-slots** - Manage doctor time slots
  - Features: Add time slots, Edit availability, Delete slots
  - Protected: Requires 'admin' role

---

## API Endpoints (Backend)

### Authentication
- `POST /api/auth/register` - Register new patient
- `POST /api/auth/login` - Patient login
- `POST /api/auth/admin-login` - Admin login
- `POST /api/auth/logout` - Logout

### Patient Routes
- `GET /api/patients` - Get all patients (Admin)
- `GET /api/patients/:id` - Get patient details
- `PUT /api/patients/:id` - Update patient profile
- `DELETE /api/patients/:id` - Delete patient (Admin)

### Doctor Routes
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor details
- `POST /api/doctors` - Create doctor (Admin)
- `PUT /api/doctors/:id` - Update doctor (Admin/Self)
- `DELETE /api/doctors/:id` - Delete doctor (Admin)

### Appointment Routes
- `GET /api/appointments` - Get user's appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Health Records
- `GET /api/health-records` - Get patient's health records
- `POST /api/health-records` - Add health record
- `PUT /api/health-records/:id` - Update health record
- `DELETE /api/health-records/:id` - Delete health record

### Prescriptions
- `GET /api/prescriptions` - Get patient's prescriptions
- `POST /api/prescriptions` - Create prescription
- `PUT /api/prescriptions/:id` - Update prescription
- `DELETE /api/prescriptions/:id` - Delete prescription

### Reviews
- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Time Slots
- `GET /api/time-slots` - Get doctor's time slots
- `POST /api/time-slots` - Create time slot
- `PUT /api/time-slots/:id` - Update time slot
- `DELETE /api/time-slots/:id` - Delete time slot

---

## Page Components Summary

### Common Components
- **Navbar** - Navigation bar with auth status
- **Footer** - Footer with links
- **ProtectedRoute** - Route protection based on role

### User Pages (9 total)
1. UserDashboard.jsx - Main user dashboard
2. Appointments.jsx - Manage appointments
3. BookAppointment.jsx - Book new appointment
4. BrowseDoctors.jsx - Search and browse doctors
5. HealthRecords.jsx - Manage health records
6. Prescriptions.jsx - View prescriptions
7. Reviews.jsx - Write and view reviews
8. Profile.jsx - Edit profile
9. Settings.jsx - Account settings

### Doctor Pages (4 total)
1. DoctorDashboard.jsx - Doctor dashboard
2. Appointments.jsx - Manage appointments
3. Profile.jsx - Edit doctor profile
4. Doctors.jsx - Browse other doctors

### Admin Pages (8 total)
1. AdminDashboard.jsx - Admin overview
2. Patients.jsx - Manage patients
3. Doctors.jsx - Manage doctors
4. Appointments.jsx - Manage all appointments
5. HealthRecords.jsx - Manage health records
6. Prescriptions.jsx - Manage prescriptions
7. Reviews.jsx - Manage reviews
8. TimeSlots.jsx - Manage time slots

### Public Pages (5 total)
1. Home.jsx - Landing page
2. AllDoctors.jsx - Browse all doctors
3. About.jsx - About page
4. Services.jsx - Services page
5. NotFound.jsx - 404 page

### Auth Pages (3 total)
1. Login.jsx - Patient login
2. Register.jsx - Patient registration
3. AdminLogin.jsx - Admin login

---

## File Structure

```
src/
├── pages/
│   ├── Home.jsx
│   ├── AllDoctors.jsx
│   ├── NotFound.jsx
│   ├── Unauthorized.jsx
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── Appointments.jsx
│   │   ├── Doctors.jsx
│   │   ├── HealthRecords.jsx
│   │   ├── Patients.jsx
│   │   ├── Prescriptions.jsx
│   │   ├── Reviews.jsx
│   │   └── TimeSlots.jsx
│   ├── auth/
│   │   ├── AdminLogin.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── doctor/
│   │   ├── Appointments.jsx
│   │   ├── DoctorDashboard.jsx
│   │   ├── Doctors.jsx
│   │   └── Profile.jsx
│   └── user/
│       ├── Appointments.jsx
│       ├── BookAppointment.jsx
│       ├── BrowseDoctors.jsx
│       ├── HealthRecords.jsx
│       ├── Prescriptions.jsx
│       ├── Profile.jsx
│       ├── Reviews.jsx
│       ├── Settings.jsx
│       └── UserDashboard.jsx
├── components/
│   ├── About.jsx
│   ├── Footer.jsx
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   └── Services.jsx
├── Authcontext/
│   └── AuthContext.jsx
├── api/
│   ├── api.js
│   └── axios.js
├── App.jsx
└── main.jsx
```

---

## Role-Based Access Control

### Public (No Login Required)
- Home, About, Services, All Doctors
- Login, Register, Admin Login
- Unauthorized, Not Found

### Patient (Requires 'patient' role)
- Dashboard, Appointments, Book Appointment
- Browse Doctors, Health Records, Prescriptions
- Reviews, Profile, Settings

### Doctor (Requires 'doctor' role)
- Dashboard, Appointments, Profile
- Browse Other Doctors

### Admin (Requires 'admin' role)
- Dashboard, All Patients, All Doctors
- All Appointments, Health Records
- Prescriptions, Reviews, Time Slots

---

## Navigation Flow

```
Home → 
├── Public (About, Services, Browse Doctors)
├── Login/Register → 
│   ├── Patient → User Dashboard
│   └── Doctor → Doctor Dashboard
├── Admin Login → Admin Dashboard
└── Unauthorized (403) / Not Found (404)
```
