import React from "react";
import './index.css'
import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Authcontext/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";

/* ===== Public Pages ===== */
import Home from "./pages/Home";
import Doctors from "./pages/doctor/Doctors";
import AllDoctors from "./pages/AllDoctors";
import Services from "./components/Services";
import About from "./components/About";

/* ===== Auth Pages ===== */
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminLogin from "./pages/auth/AdminLogin";

/* ===== User Pages ===== */
import UserDashboard from "./pages/patient/UserDashboard";
import BookAppointment from "./pages/patient/BookAppointment";
import UserAppointments from "./pages/patient/Appointments";
import UserProfile from "./pages/patient/Profile";
import BrowseDoctors from "./pages/patient/BrowseDoctors";
import DoctorProfile from "./pages/patient/DoctorProfile";
import UserPrescriptions from "./pages/patient/Prescriptions";
import UserHealthRecords from "./pages/patient/HealthRecords";
import UserReviews from "./pages/patient/Reviews";
import UserSettings from "./pages/patient/Settings";

/* ===== Doctor Pages ===== */
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/Appointments";
import DoctorProfilePage from "./pages/doctor/Profile";
import DoctorPatients from "./pages/doctor/Patients";
import DoctorPrescriptions from "./pages/doctor/Prescriptions";
import DoctorReviews from "./pages/doctor/Reviews";
import DoctorTimeSlots from "./pages/doctor/TimeSlots";
import DoctorSettings from "./pages/doctor/Settings";
import DoctorSendNotification from "./pages/doctor/SendNotification";

/* ===== Admin Pages ===== */
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDoctors from "./pages/admin/Doctors";
import AdminPatients from "./pages/admin/Patients";
import AdminAppointments from "./pages/admin/Appointments";
import AdminHealthRecords from "./pages/admin/HealthRecords";
import AdminPrescriptions from "./pages/admin/Prescriptions";
import AdminReviews from "./pages/admin/Reviews";
import AdminTimeSlots from "./pages/admin/TimeSlots";
import AdminSettings from "./pages/admin/Settings";


/* ===== System Pages ===== */
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* ================= PUBLIC ================= */}
            <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<AllDoctors />} />
          <Route path="/all-doctors" element={<AllDoctors />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />

          {/* ================= AUTH ================= */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ================= PATIENT ================= */}
          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute requiredRole="patient">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/book/:doctorId"
            element={
              <ProtectedRoute requiredRole="patient">
                <BookAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/appointments"
            element={
              <ProtectedRoute requiredRole="patient">
                <UserAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/profile"
            element={
              <ProtectedRoute requiredRole="patient">
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/browse-doctors"
            element={
              <ProtectedRoute requiredRole="patient">
                <BrowseDoctors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/doctor/:doctorId"
            element={
              <ProtectedRoute requiredRole="patient">
                <DoctorProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/prescriptions"
            element={
              <ProtectedRoute requiredRole="patient">
                <UserPrescriptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/health-records"
            element={
              <ProtectedRoute requiredRole="patient">
                <UserHealthRecords />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/reviews"
            element={
              <ProtectedRoute requiredRole="patient">
                <UserReviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/settings"
            element={
              <ProtectedRoute requiredRole="patient">
                <UserSettings />
              </ProtectedRoute>
            }
          />

          {/* ================= DOCTOR ================= */}
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/appointments"
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/profile"
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/patients"
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorPatients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/prescriptions"
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorPrescriptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/reviews"
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorReviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/time-slots"
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorTimeSlots />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/settings"
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/send-notification"
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorSendNotification />
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN ================= */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/doctors"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDoctors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/patients"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPatients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/health-records"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminHealthRecords />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/prescriptions"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPrescriptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminReviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/time-slots"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminTimeSlots />
              </ProtectedRoute>
            }
          />          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminSettings />
              </ProtectedRoute>
            }
          />
          {/* ================= SYSTEM ================= */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </AuthProvider>
  );
}

export default App;
