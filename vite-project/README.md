# MedCare Frontend

Modern, responsive React frontend for the MedCare Healthcare Management System built with Vite and Tailwind CSS.

## 📁 Project Structure

```
vite-project/
├── public/                  # Static assets
├── src/
│   ├── api/
│   │   ├── api.js          # API service functions
│   │   └── axios.js        # Axios configuration
│   ├── assets/             # Images, icons, etc.
│   ├── Authcontext/
│   │   └── AuthContext.jsx # Authentication context
│   ├── components/
│   │   ├── About.jsx
│   │   ├── EmptyState.jsx
│   │   ├── Footer.jsx
│   │   ├── FormInput.jsx
│   │   ├── Navbar.jsx
│   │   ├── NotificationBell.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── Services.jsx
│   │   ├── SkeletonCard.jsx
│   │   ├── Spinner.jsx
│   │   └── Modals/
│   │       ├── AddNotesModal.jsx
│   │       ├── AvailabilityModal.jsx
│   │       ├── DiagnoseModal.jsx
│   │       └── PrescribeModal.jsx
│   ├── pages/
│   │   ├── AllDoctors.jsx
│   │   ├── Home.jsx
│   │   ├── NotFound.jsx
│   │   ├── Unauthorized.jsx
│   │   ├── admin/         # Admin dashboard pages
│   │   ├── auth/          # Login/Register pages
│   │   ├── doctor/        # Doctor dashboard pages
│   │   └── patient/       # Patient pages
│   ├── utils/
│   │   └── buttonDelay.js # Utility functions
│   ├── App.css
│   ├── App.jsx            # Main app component with routes
│   ├── index.css          # Global styles
│   └── main.jsx           # Application entry point
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── eslint.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js v16 or higher
- npm or yarn

### Installation

```bash
cd vite-project
npm install
```

### Environment Setup

Create a `.env` file in the `vite-project` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## 🎨 Features

### Public Pages
- **Home** - Landing page with service overview
- **All Doctors** - Browse all available doctors
- **Login/Register** - User authentication

### Patient Dashboard
- **Browse Doctors** - Search and filter doctors by specialization
- **Doctor Profile** - View detailed doctor information
- **Book Appointment** - Schedule appointments with doctors
- **My Appointments** - View and manage appointments
- **My Prescriptions** - Access digital prescriptions
- **Health Records** - Manage personal health records
- **My Reviews** - Leave and manage doctor reviews
- **Profile** - Update personal information

### Doctor Dashboard
- **Dashboard** - Overview of appointments and stats
- **My Appointments** - Manage patient appointments
- **Patients** - View patient list and details
- **Prescriptions** - Create and manage prescriptions
- **Time Slots** - Set availability schedule
- **Reviews** - View patient feedback
- **Doctors** - View other doctors
- **Profile** - Update professional information

### Admin Dashboard
- **Dashboard** - System overview and statistics
- **Appointments** - Manage all appointments
- **Doctors** - Manage doctor accounts
- **Patients** - Manage patient accounts
- **Prescriptions** - Oversee all prescriptions
- **Health Records** - System-wide health records
- **Reviews** - Monitor and moderate reviews
- **Time Slots** - Manage doctor availability

## 🔐 Authentication

The app uses JWT-based authentication with the following features:
- Protected routes based on user roles
- Automatic token refresh
- Persistent login state
- Role-based access control

### User Roles
- **Patient** - Regular users booking appointments
- **Doctor** - Medical professionals
- **Admin** - System administrators

## 🎨 UI Components

### Reusable Components
- **Navbar** - Responsive navigation with role-based links
- **Footer** - Site footer with information
- **FormInput** - Reusable form input component
- **EmptyState** - Display when no data is available
- **Spinner** - Loading indicator
- **SkeletonCard** - Loading skeleton for cards
- **NotificationBell** - Real-time notification dropdown
- **ProtectedRoute** - Route wrapper for authentication

### Modal Components
- **PrescribeModal** - Create prescriptions
- **DiagnoseModal** - Add diagnosis
- **AddNotesModal** - Add consultation notes
- **AvailabilityModal** - Set doctor availability

## 📡 API Integration

All API calls are centralized in `src/api/api.js`:

```javascript
import * as api from './api/api';

// Example usage
const doctors = await api.getDoctors();
const appointment = await api.bookAppointment(data);
```

### API Service Functions
- Authentication: `login()`, `register()`, `getProfile()`, etc.
- Doctors: `getDoctors()`, `getDoctorById()`, etc.
- Appointments: `getAppointments()`, `bookAppointment()`, etc.
- Prescriptions: `getPrescriptions()`, `createPrescription()`, etc.
- Health Records: `getHealthRecords()`, `createHealthRecord()`, etc.
- Notifications: `getNotifications()`, `markAsRead()`, etc.
- Reviews: `getDoctorReviews()`, `createReview()`, etc.

## 🎨 Styling

### Tailwind CSS
The project uses Tailwind CSS for styling with custom configuration:

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',
      secondary: '#10b981',
      // ... custom colors
    }
  }
}
```

### Global Styles
Custom global styles are in `src/index.css`

## 🛠️ Technology Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM v7** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting

## 🔄 State Management

- **AuthContext** - Global authentication state
- **React Hooks** - Local component state (useState, useEffect)
- **React Router** - Navigation state

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🚀 Routing

Main routes defined in `App.jsx`:

```
/ - Home
/doctors - All Doctors
/login - Patient Login
/register - Register
/admin/login - Admin Login

/patient/* - Patient Dashboard Routes
/doctor/* - Doctor Dashboard Routes
/admin/* - Admin Dashboard Routes
```

## 🧪 Development Tips

### Hot Module Replacement
Vite provides instant HMR for fast development.

### Component Development
- Keep components small and focused
- Use props for reusability
- Implement proper error handling
- Add loading states

### API Calls
- Use try-catch for error handling
- Show loading indicators
- Display user-friendly error messages
- Implement proper validation

## 🔒 Security

- All sensitive routes are protected
- JWT tokens stored in localStorage
- Automatic logout on token expiration
- Role-based access control
- Input validation on forms

## 🎯 Performance Optimization

- Code splitting with React Router
- Lazy loading for routes
- Image optimization
- Minimal re-renders with proper state management
- Efficient API calls with proper dependencies

## 🐛 Common Issues

**API Connection Failed:**
- Check backend server is running
- Verify VITE_API_URL in .env
- Check CORS settings in backend

**Routes Not Working:**
- Ensure React Router is properly configured
- Check route paths match exactly
- Verify protected route permissions

**Styling Issues:**
- Run `npm run build` to rebuild Tailwind
- Check Tailwind configuration
- Clear browser cache

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)

## 🔜 Future Enhancements

- PWA support
- Real-time chat between doctor and patient
- Video consultation integration
- Push notifications
- Dark mode
- Multi-language support
- Accessibility improvements (WCAG compliance)
