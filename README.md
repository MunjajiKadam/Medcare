# MedCare - Healthcare Management System

A comprehensive healthcare management system that connects patients with doctors, enabling appointment scheduling, prescriptions, health records management, and more.

## 🌟 Features

### For Patients
- Browse and search for doctors by specialization
- View detailed doctor profiles with ratings and reviews
- Book appointments with available time slots
- View and manage appointments
- Access digital prescriptions
- Maintain health records
- Leave reviews and ratings for doctors
- Real-time notifications

### For Doctors
- Manage personal profile and availability
- View and manage patient appointments
- Create and manage prescriptions
- Add consultation notes and diagnoses
- Access patient health records
- View patient reviews
- Set availability schedules
- Real-time notifications

### For Administrators
- Manage users (patients, doctors, admins)
- Oversee all appointments and prescriptions
- Monitor system health records
- Manage doctor time slots
- View and moderate reviews
- System-wide notifications

## 🏗️ Project Structure

```
MedCare/
├── backend/              # Node.js/Express backend
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Authentication middleware
│   ├── routes/          # API routes
│   ├── migrations/      # Database migrations
│   ├── scripts/         # Utility scripts
│   ├── database.sql     # Database schema
│   ├── final-data.sql   # Seed data
│   └── server.js        # Main server file
│
└── vite-project/        # React frontend
    ├── src/
    │   ├── api/         # API client
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   ├── Authcontext/ # Authentication context
    │   └── utils/       # Utility functions
    └── public/          # Static assets
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MedCare
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd vite-project
   npm install
   ```

4. **Database Setup**
   - Create a MySQL database
   - Import the schema: `mysql -u root -p < backend/database.sql`
   - Import seed data: `mysql -u root -p < backend/final-data.sql`
   - Or use the setup script: `node backend/scripts/setupDatabase.mjs`

5. **Environment Configuration**
   
   Create `.env` file in backend directory:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=medcare_db
   JWT_SECRET=your_jwt_secret_key
   ```

6. **Run the Application**
   
   Terminal 1 (Backend):
   ```bash
   cd backend
   npm start
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd vite-project
   npm run dev
   ```

7. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## 🔑 Default Login Credentials

### Admin
- Email: `admin@medcare.com`
- Password: `admin123`

### Doctor
- Email: `doctor@medcare.com`
- Password: `doctor123`

### Patient
- Email: `patient@medcare.com`
- Password: `patient123`

## 📚 Documentation

- [Backend Documentation](backend/README.md)
- [Frontend Documentation](vite-project/README.md)
- [API Documentation](docs/API.md)
- [Database Schema](docs/DATABASE.md)

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **CORS**: cors middleware

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Linting**: ESLint

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control (RBAC)
- Protected routes for authenticated users
- SQL injection prevention
- CORS configuration

## 📝 License

This project is licensed under the ISC License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@medcare.com or open an issue in the repository.

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed for scalability and maintainability
- Focus on user experience and security
