# MedCare Healthcare Application - Integration Complete ✓

## **System Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                   MEDCARE APPLICATION                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐         ┌──────────────────────┐  │
│  │   FRONTEND (React)   │         │  BACKEND (Node.js)   │  │
│  │  Port: 5173          │         │  Port: 5000          │  │
│  ├──────────────────────┤         ├──────────────────────┤  │
│  │ • Home               │────────▶│ • Auth API           │  │
│  │ • Login/Register     │◀────────│ • Appointment API    │  │
│  │ • Dashboards         │         │ • Doctor API         │  │
│  │ • Appointments       │         │                      │  │
│  │ • Doctor Browser     │         └──────────────────────┘  │
│  │ • Profiles           │                  │                │
│  └──────────────────────┘                  │                │
│           │                                 │                │
│           │ (Axios HTTP)                    ▼                │
│           │                    ┌──────────────────────────┐  │
│           │                    │  MySQL Database          │  │
│           │                    │  (medcare_db)            │  │
│           │                    ├──────────────────────────┤  │
│           │                    │ • users                  │  │
│           │                    │ • doctors                │  │
│           │                    │ • patients               │  │
│           │                    │ • appointments           │  │
│           │                    │ • prescriptions          │  │
│           │                    │ • health_records         │  │
│           │                    │ • reviews                │  │
│           │                    │ • doctor_time_slots      │  │
│           │                    └──────────────────────────┘  │
│           └────────────────────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## **API Endpoints (Running at http://localhost:5000/api)**

### **Authentication Endpoints**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login with email, password, role
- `POST /auth/logout` - User logout

### **Doctor Endpoints**
- `GET /doctors` - Get all doctors
- `GET /doctors/:id` - Get doctor by ID
- `GET /doctors/specialty/:specialization` - Filter doctors by specialty
- `GET /doctors/:id/reviews` - Get doctor reviews
- `GET /doctors/profile/:id` - Get doctor profile (protected)
- `PUT /doctors/profile/:id` - Update doctor profile (protected)

### **Appointment Endpoints**
- `POST /appointments` - Create appointment
- `GET /appointments` - Get all appointments (role-based)
- `GET /appointments/:id` - Get appointment by ID
- `PUT /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Cancel appointment

---

## **Frontend Structure**

### **API Configuration**
- **File**: `src/api/axios.js`
- **Base URL**: `http://localhost:5000/api`
- **Features**:
  - Automatic token attachment to all requests
  - Auto-logout on 401 (Unauthorized)
  - CORS enabled

### **API Services**
- **File**: `src/api/api.js`
- **Exports**: `doctorAPI`, `appointmentAPI`
- **Usage**: Import and use for API calls

### **Authentication Context**
- **File**: `src/Authcontext/AuthContext.jsx`
- **Features**:
  - Real API integration (no more mocks)
  - Token-based authentication (JWT)
  - localStorage persistence
  - Automatic token refresh in requests
  - Role-based access control

### **Protected Routes**
- **File**: `src/components/ProtectedRoute.jsx`
- **Features**:
  - Authentication check
  - Role-based access control
  - Automatic redirects

---

## **Backend Structure**

### **Configuration**
- **Database**: `config/database.js` - MySQL connection pool
- **Environment**: `.env` - Configuration variables

### **Middleware**
- **Authentication**: `middleware/authMiddleware.js`
  - `authMiddleware` - Verify JWT token
  - `roleMiddleware` - Check user role

### **Controllers**
- **Auth**: `controllers/authController.js`
  - User registration with password hashing (bcrypt)
  - User login with token generation (JWT)
  - Logout
- **Doctor**: `controllers/doctorController.js`
  - Get all/single doctors
  - Filter by specialization
  - Get reviews
- **Appointment**: `controllers/appointmentController.js`
  - Create/get/update/cancel appointments
  - Role-based queries (patient/doctor/admin)

### **Routes**
- `routes/authRoutes.js` - Auth endpoints
- `routes/doctorRoutes.js` - Doctor endpoints
- `routes/appointmentRoutes.js` - Appointment endpoints

---

## **Database Schema**

### **Tables Created**
1. **users** - All users (patient, doctor, admin)
2. **doctors** - Doctor-specific data
3. **patients** - Patient-specific data
4. **appointments** - Appointment records
5. **prescriptions** - Doctor prescriptions
6. **health_records** - Patient health metrics
7. **reviews** - Doctor reviews
8. **doctor_time_slots** - Doctor availability

---

## **Running the Application**

### **Terminal 1 - Backend**
```bash
cd C:\Users\Dell\Desktop\MedCare\backend
node server.js
# Running on http://localhost:5000
```

### **Terminal 2 - Frontend**
```bash
cd C:\Users\Dell\Desktop\MedCare\vite-project
npm run dev
# Running on http://localhost:5173
```

### **Test Endpoints**
```bash
# Health check
curl http://localhost:5000/api/health

# Get all doctors
curl http://localhost:5000/api/doctors

# Get all appointments (requires token)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/appointments
```

---

## **Authentication Flow**

1. **Register**: User fills form → API creates user in DB → JWT token returned → Redirects to dashboard
2. **Login**: User enters credentials → API validates → JWT token returned → Redirects to role-specific dashboard
3. **Protected Routes**: Frontend checks token → Attaches to requests → API validates → Returns data or 401
4. **Logout**: Frontend clears token → User redirected to login

---

## **Key Features Integrated**

✅ Real database integration (MySQL)
✅ JWT token-based authentication
✅ Password encryption (bcrypt)
✅ Role-based access control (RBAC)
✅ Automatic token management
✅ Auto-logout on unauthorized
✅ CORS configured
✅ Error handling
✅ Protected routes on frontend
✅ Protected endpoints on backend

---

## **Next Steps**

1. **Test Authentication**:
   - Go to http://localhost:5173/register
   - Create account (patient/doctor/admin)
   - Verify data in MySQL database

2. **Test API Endpoints**:
   - Try booking appointments
   - Browse doctors
   - Get appointments

3. **Additional Features** (Optional):
   - Add prescription management
   - Add health records
   - Add doctor reviews
   - Add time slot management

---

**Everything is now connected and ready to use! 🚀**
-- ADMIN
INSERT INTO users (name, email, password, role, phone)
VALUES
('Admin', 'admin@medcare.com', 'admin123', 'admin', '9999999999');

-- DOCTOR USERS
INSERT INTO users (name, email, password, role, phone)
VALUES
('Dr John Smith', 'john@medcare.com', 'doctor123', 'doctor', '8888888888'),
('Dr Emily Brown', 'emily@medcare.com', 'doctor123', 'doctor', '7777777777');

-- PATIENT USERS
INSERT INTO users (name, email, password, role, phone)
VALUES
('Rahul Sharma', 'rahul@gmail.com', 'patient123', 'patient', '6666666666'),
('Anita Verma', 'anita@gmail.com', 'patient123', 'patient', '5555555555');


INSERT INTO doctors
(user_id, specialization, license_number, experience_years, consultation_fee, bio)
VALUES
(2, 'Cardiologist', 'LIC-CARD-001', 10, 600, 'Experienced heart specialist'),
(3, 'Dermatologist', 'LIC-DERM-002', 8, 500, 'Skin care and dermatology expert');


INSERT INTO patients
(user_id, blood_type, date_of_birth, gender, medical_history, allergies, emergency_contact, emergency_phone)
VALUES
(4, 'O+', '1995-05-12', 'male', 'High BP', 'Dust', 'Suresh Sharma', '9991112222'),
(5, 'A+', '1998-09-20', 'female', 'Diabetes', 'None', 'Raj Verma', '8882223333');
// All imported and ready to use:
doctorAPI, appointmentAPI, patientAPI, 
healthRecordAPI, prescriptionAPI, 
reviewAPI, timeSlotAPI




-- ADMIN (password: admin123)
INSERT INTO users (name, email, password, role, phone, status)
VALUES (
  'Admin MedCare',
  'admin@medcare.com',
  '$2a$10$HMbh9xPVE5T1.uJ2yPKSUOY9KyZDLMzrA8Cv0iKg2N4L2VJ0EIPQ2',
  'admin',
  '9999999999',
  'active'
);

-- DOCTORS (password: doctor123)
INSERT INTO users (name, email, password, role, phone, status)
VALUES
(
  'Dr. John Smith',
  'john@medcare.com',
  '$2a$10$GVvJ/ixKnRDhP5xDvXQvGOwTb7D5iHa9OJ5Rb2Kt5E8xN9H8K0L6O',
  'doctor',
  '8888888888',
  'active'
),
(
  'Dr. Emily Brown',
  'emily@medcare.com',
  '$2a$10$GVvJ/ixKnRDhP5xDvXQvGOwTb7D5iHa9OJ5Rb2Kt5E8xN9H8K0L6O',
  'doctor',
  '7777777777',
  'active'
);

-- PATIENTS (password: patient123)
INSERT INTO users (name, email, password, role, phone, status)
VALUES
(
  'Rahul Sharma',
  'rahul@gmail.com',
  '$2a$10$L5nYrQs8E9j5D2kK3vP0F.YeKmWvXrT4I7nP2jQ9s8e6vX3hY1N4C',
  'patient',
  '6666666666',
  'active'
),
(
  'Anita Verma',
  'anita@gmail.com',
  '$2a$10$L5nYrQs8E9j5D2kK3vP0F.YeKmWvXrT4I7nP2jQ9s8e6vX3hY1N4C',
  'patient',
  '5555555555',
  'active'
);
