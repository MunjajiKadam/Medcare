# MedCare Backend

REST API for the MedCare Healthcare Management System built with Node.js and Express.

## 📁 Directory Structure

```
backend/
├── config/
│   └── database.js                 # MySQL database configuration
├── controllers/
│   ├── appointmentController.js    # Appointment management logic
│   ├── authController.js           # Authentication logic
│   ├── availabilityController.js   # Doctor availability logic
│   ├── consultationNotesController.js
│   ├── diagnosisController.js
│   ├── doctorController.js
│   ├── healthRecordController.js
│   ├── notificationController.js
│   ├── patientController.js
│   ├── prescriptionController.js
│   ├── reviewController.js
│   └── timeSlotController.js
├── middleware/
│   └── authMiddleware.js           # JWT authentication middleware
├── routes/
│   ├── appointmentRoutes.js
│   ├── authRoutes.js
│   ├── availabilityRoutes.js
│   ├── consultationNotesRoutes.js
│   ├── diagnosisRoutes.js
│   ├── doctorRoutes.js
│   ├── healthRecordRoutes.js
│   ├── notificationRoutes.js
│   ├── patientRoutes.js
│   ├── prescriptionRoutes.js
│   ├── reviewRoutes.js
│   └── timeSlotRoutes.js
├── migrations/
│   └── add_notifications.sql       # Notification table migration
├── scripts/
│   └── setupDatabase.mjs           # Database setup automation
├── database.sql                    # Complete database schema
├── final-data.sql                  # Seed data for testing
├── package.json
└── server.js                       # Main application entry point
```

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=medcare_db
JWT_SECRET=your_jwt_secret_key_here
```

### Database Setup

**Option 1: Manual Setup**
```bash
mysql -u root -p < database.sql
mysql -u root -p medcare_db < final-data.sql
mysql -u root -p medcare_db < migrations/add_notifications.sql
```

**Option 2: Automated Setup**
```bash
node scripts/setupDatabase.mjs
```

### Running the Server

**Development Mode** (with auto-reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /admin/login` - Admin login
- `GET /profile` - Get user profile (protected)
- `PUT /profile` - Update user profile (protected)

### Doctor Routes (`/api/doctors`)
- `GET /` - Get all doctors
- `GET /:id` - Get doctor by ID
- `GET /:id/profile` - Get detailed doctor profile
- `PUT /:id` - Update doctor (protected)
- `DELETE /:id` - Delete doctor (admin only)

### Patient Routes (`/api/patients`)
- `GET /` - Get all patients (admin/doctor)
- `GET /:id` - Get patient by ID
- `PUT /:id` - Update patient (protected)
- `DELETE /:id` - Delete patient (admin only)

### Appointment Routes (`/api/appointments`)
- `GET /` - Get appointments (role-based)
- `GET /:id` - Get appointment by ID
- `POST /` - Create appointment (patient)
- `PUT /:id` - Update appointment
- `PUT /:id/status` - Update appointment status
- `DELETE /:id` - Cancel appointment

### Prescription Routes (`/api/prescriptions`)
- `GET /` - Get prescriptions (role-based)
- `GET /:id` - Get prescription by ID
- `POST /` - Create prescription (doctor)
- `PUT /:id` - Update prescription (doctor)
- `DELETE /:id` - Delete prescription (doctor/admin)

### Health Record Routes (`/api/health-records`)
- `GET /` - Get health records
- `GET /patient/:patientId` - Get patient's health records
- `POST /` - Create health record
- `PUT /:id` - Update health record
- `DELETE /:id` - Delete health record

### Notification Routes (`/api/notifications`)
- `GET /` - Get user notifications
- `GET /unread-count` - Get unread notification count
- `PUT /:id/read` - Mark notification as read
- `PUT /mark-all-read` - Mark all notifications as read
- `DELETE /:id` - Delete notification

### Review Routes (`/api/reviews`)
- `GET /doctor/:doctorId` - Get doctor reviews
- `POST /` - Create review (patient)
- `PUT /:id` - Update review
- `DELETE /:id` - Delete review

### Time Slot Routes (`/api/time-slots`)
- `GET /doctor/:doctorId` - Get doctor's time slots
- `POST /` - Create time slot (doctor)
- `PUT /:id` - Update time slot
- `DELETE /:id` - Delete time slot

### Availability Routes (`/api/availability`)
- `GET /doctor/:doctorId` - Get doctor availability
- `POST /` - Set availability (doctor)
- `PUT /:id` - Update availability

### Consultation Notes Routes (`/api/consultation-notes`)
- `GET /appointment/:appointmentId` - Get notes for appointment
- `POST /` - Create consultation notes (doctor)
- `PUT /:id` - Update notes
- `DELETE /:id` - Delete notes

### Diagnosis Routes (`/api/diagnoses`)
- `GET /appointment/:appointmentId` - Get diagnosis for appointment
- `POST /` - Create diagnosis (doctor)
- `PUT /:id` - Update diagnosis
- `DELETE /:id` - Delete diagnosis

## 🔐 Authentication & Authorization

The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Roles
- **Patient**: Can book appointments, view prescriptions, manage health records
- **Doctor**: Can manage appointments, create prescriptions, add notes
- **Admin**: Full system access, user management

## 🗄️ Database Schema

### Main Tables
- `users` - All system users (patients, doctors, admins)
- `doctors` - Doctor-specific information
- `patients` - Patient-specific information
- `appointments` - Appointment bookings
- `prescriptions` - Medical prescriptions
- `health_records` - Patient health history
- `reviews` - Doctor reviews and ratings
- `doctor_time_slots` - Doctor availability schedule
- `notifications` - System notifications
- `consultation_notes` - Doctor notes from consultations
- `diagnoses` - Medical diagnoses

## 🛠️ Dependencies

### Production
- `express` - Web framework
- `mysql2` - MySQL database driver
- `cors` - CORS middleware
- `dotenv` - Environment variable management
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication

### Development
- `nodemon` - Auto-reload during development

## 📝 Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message here"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🧪 Testing

Test the API using:
- Postman
- Thunder Client (VS Code extension)
- cURL
- Frontend application

## 📊 Logging

The server logs:
- Database connection status
- Server startup information
- Request errors
- Database query errors

## 🔧 Maintenance

### Database Migrations

To add new database changes:
1. Create SQL file in `migrations/` directory
2. Run migration manually or update `setupDatabase.mjs`

### Backup

Regular database backups recommended:
```bash
mysqldump -u root -p medcare_db > backup_$(date +%Y%m%d).sql
```

## 🚨 Troubleshooting

**Database connection issues:**
- Verify MySQL is running
- Check `.env` credentials
- Ensure database exists

**JWT errors:**
- Verify JWT_SECRET is set
- Check token expiration
- Ensure proper Authorization header format

## 📈 Performance Optimization

- Database indexes on frequently queried columns
- Connection pooling for database
- Prepared statements for SQL queries
- Response caching where appropriate

## 🔜 Future Enhancements

- Rate limiting
- API documentation with Swagger
- Comprehensive logging system
- Unit and integration tests
- WebSocket for real-time features
- File upload for medical documents
