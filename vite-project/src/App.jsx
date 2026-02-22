import React, { Suspense, lazy } from 'react';
import './index.css'
import './App.css'

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./Authcontext/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";

/* ===== Public Pages ===== */
const Home = lazy(() => import("./pages/Home"));
const AllDoctors = lazy(() => import("./pages/AllDoctors"));
const Services = lazy(() => import("./components/Services"));
const About = lazy(() => import("./components/About"));

/* ===== Auth Pages ===== */
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const AdminLogin = lazy(() => import("./pages/auth/AdminLogin"));

/* ===== User Pages ===== */
const UserDashboard = lazy(() => import("./pages/patient/UserDashboard"));
const BookAppointment = lazy(() => import("./pages/patient/BookAppointment"));
const UserAppointments = lazy(() => import("./pages/patient/Appointments"));
const UserProfile = lazy(() => import("./pages/patient/Profile"));
const BrowseDoctors = lazy(() => import("./pages/patient/BrowseDoctors"));
const DoctorProfile = lazy(() => import("./pages/patient/DoctorProfile"));
const UserPrescriptions = lazy(() => import("./pages/patient/Prescriptions"));
const UserHealthRecords = lazy(() => import("./pages/patient/HealthRecords"));
const UserReviews = lazy(() => import("./pages/patient/Reviews"));
const UserSettings = lazy(() => import("./pages/patient/Settings"));
const HealthSummary = lazy(() => import("./pages/patient/HealthSummary"));

/* ===== Doctor Pages ===== */
const DoctorDashboard = lazy(() => import("./pages/doctor/DoctorDashboard"));
const DoctorAppointments = lazy(() => import("./pages/doctor/Appointments"));
const DoctorProfilePage = lazy(() => import("./pages/doctor/Profile"));
const DoctorPatients = lazy(() => import("./pages/doctor/Patients"));
const DoctorPrescriptions = lazy(() => import("./pages/doctor/Prescriptions"));
const DoctorReviews = lazy(() => import("./pages/doctor/Reviews"));
const DoctorTimeSlots = lazy(() => import("./pages/doctor/TimeSlots"));
const DoctorSettings = lazy(() => import("./pages/doctor/Settings"));
const DoctorSendNotification = lazy(() => import("./pages/doctor/SendNotification"));

/* ===== Admin Pages ===== */
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminDoctors = lazy(() => import("./pages/admin/Doctors"));
const AdminPatients = lazy(() => import("./pages/admin/Patients"));
const AdminAppointments = lazy(() => import("./pages/admin/Appointments"));
const AdminHealthRecords = lazy(() => import("./pages/admin/HealthRecords"));
const AdminPrescriptions = lazy(() => import("./pages/admin/Prescriptions"));
const AdminReviews = lazy(() => import("./pages/admin/Reviews"));
const AdminTimeSlots = lazy(() => import("./pages/admin/TimeSlots"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));

/* ===== System Pages ===== */
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PaymentPage = lazy(() => import("./pages/Payment"));

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
          }>
            <Routes>
              {/* ================= PUBLIC ================= */}
              <Route path="/" element={<Home />} />
              <Route path="/doctors" element={<AllDoctors />} />
              <Route path="/all-doctors" element={<AllDoctors />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/payment" element={<PaymentPage />} />

              {/* ================= AUTH ================= */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* ================= PATIENT ================= */}
              <Route path="/patient/dashboard" element={<ProtectedRoute requiredRole="patient"><UserDashboard /></ProtectedRoute>} />
              <Route path="/patient/book/:doctorId" element={<ProtectedRoute requiredRole="patient"><BookAppointment /></ProtectedRoute>} />
              <Route path="/patient/appointments" element={<ProtectedRoute requiredRole="patient"><UserAppointments /></ProtectedRoute>} />
              <Route path="/patient/profile" element={<ProtectedRoute requiredRole="patient"><UserProfile /></ProtectedRoute>} />
              <Route path="/patient/browse-doctors" element={<ProtectedRoute requiredRole="patient"><BrowseDoctors /></ProtectedRoute>} />
              <Route path="/patient/doctor/:doctorId" element={<ProtectedRoute requiredRole="patient"><DoctorProfile /></ProtectedRoute>} />
              <Route path="/patient/prescriptions" element={<ProtectedRoute requiredRole="patient"><UserPrescriptions /></ProtectedRoute>} />
              <Route path="/patient/health-records" element={<ProtectedRoute requiredRole="patient"><UserHealthRecords /></ProtectedRoute>} />
              <Route path="/patient/health-summary" element={<ProtectedRoute requiredRole="patient"><HealthSummary /></ProtectedRoute>} />
              <Route path="/patient/reviews" element={<ProtectedRoute requiredRole="patient"><UserReviews /></ProtectedRoute>} />
              <Route path="/patient/settings" element={<ProtectedRoute requiredRole="patient"><UserSettings /></ProtectedRoute>} />

              {/* ================= DOCTOR ================= */}
              <Route path="/doctor/dashboard" element={<ProtectedRoute requiredRole="doctor"><DoctorDashboard /></ProtectedRoute>} />
              <Route path="/doctor/appointments" element={<ProtectedRoute requiredRole="doctor"><DoctorAppointments /></ProtectedRoute>} />
              <Route path="/doctor/profile" element={<ProtectedRoute requiredRole="doctor"><DoctorProfilePage /></ProtectedRoute>} />
              <Route path="/doctor/patients" element={<ProtectedRoute requiredRole="doctor"><DoctorPatients /></ProtectedRoute>} />
              <Route path="/doctor/prescriptions" element={<ProtectedRoute requiredRole="doctor"><DoctorPrescriptions /></ProtectedRoute>} />
              <Route path="/doctor/reviews" element={<ProtectedRoute requiredRole="doctor"><DoctorReviews /></ProtectedRoute>} />
              <Route path="/doctor/time-slots" element={<ProtectedRoute requiredRole="doctor"><DoctorTimeSlots /></ProtectedRoute>} />
              <Route path="/doctor/settings" element={<ProtectedRoute requiredRole="doctor"><DoctorSettings /></ProtectedRoute>} />
              <Route path="/doctor/send-notification" element={<ProtectedRoute requiredRole="doctor"><DoctorSendNotification /></ProtectedRoute>} />

              {/* ================= ADMIN ================= */}
              <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/doctors" element={<ProtectedRoute requiredRole="admin"><AdminDoctors /></ProtectedRoute>} />
              <Route path="/admin/patients" element={<ProtectedRoute requiredRole="admin"><AdminPatients /></ProtectedRoute>} />
              <Route path="/admin/appointments" element={<ProtectedRoute requiredRole="admin"><AdminAppointments /></ProtectedRoute>} />
              <Route path="/admin/health-records" element={<ProtectedRoute requiredRole="admin"><AdminHealthRecords /></ProtectedRoute>} />
              <Route path="/admin/prescriptions" element={<ProtectedRoute requiredRole="admin"><AdminPrescriptions /></ProtectedRoute>} />
              <Route path="/admin/reviews" element={<ProtectedRoute requiredRole="admin"><AdminReviews /></ProtectedRoute>} />
              <Route path="/admin/time-slots" element={<ProtectedRoute requiredRole="admin"><AdminTimeSlots /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><AdminSettings /></ProtectedRoute>} />

              {/* ================= SYSTEM ================= */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
