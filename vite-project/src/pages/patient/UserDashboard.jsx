import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { appointmentAPI, healthRecordAPI } from "../../api/api";
import { useAuth } from "../../Authcontext/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SkeletonCard from "../../components/SkeletonCard";
import EmptyState from "../../components/EmptyState";
import { formatTime12Hour } from "../../utils/timeFormat";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const quickActions = [
    { icon: "📅", label: "Book Appointment", path: "/patient/browse-doctors" },
    { icon: "💊", label: "My Prescriptions", path: "/patient/prescriptions" },
    { icon: "📋", label: "Health Records", path: "/patient/health-records" },
    { icon: "⭐", label: "My Reviews", path: "/patient/reviews" },
    { icon: "👤", label: "Edit Profile", path: "/patient/profile" },
    { icon: "⚙️", label: "Settings", path: "/patient/settings" },
  ];

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        console.log('📊 [USER DASHBOARD] Fetching user dashboard data...');
        const res = await appointmentAPI.getAppointments();
        console.log('✅ [USER DASHBOARD] Appointments data received:', res.data);
        const appts = res.data.appointments || res.data || [];
        if (mounted) setUpcomingAppointments(appts.slice(0, 5));

        const hr = await healthRecordAPI.getHealthRecords();
        console.log('✅ [USER DASHBOARD] Health records data received:', hr.data);
        const records = hr.data.records || hr.data || [];
        if (mounted) setHealthMetrics(records.slice(0, 3));
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, [user]);

  const cancelAppointment = async (id) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      try {
        setCancellingId(id);
        console.log(`📤 [USER DASHBOARD] Cancelling appointment ID: ${id}`);
        await appointmentAPI.cancelAppointment(id);
        console.log("✅ [USER DASHBOARD] Appointment cancelled successfully");
        setMessage("✓ Appointment cancelled!");
        
        // Remove from list and refresh
        setUpcomingAppointments(upcomingAppointments.filter(apt => apt.id !== id));
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        console.error("❌ [USER DASHBOARD] Error cancelling appointment:", error);
        setMessage("✗ Error: " + error.response?.data?.message);
        setTimeout(() => setMessage(""), 3000);
      } finally {
        setCancellingId(null);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background p-4 sm:p-6">
        {message && (
          <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg max-w-4xl mx-auto ${
            message.includes("✓") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark mb-2">Welcome Back, {user?.name || 'User'}! 👋</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage your health and appointments</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {quickActions.map((action, idx) => (
          <Link
            key={idx}
            to={action.path}
            className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow hover:shadow-lg transition text-center active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            aria-label={action.label}
          >
            <div className="text-2xl sm:text-3xl mb-1 sm:mb-2" role="img" aria-hidden="true">{action.icon}</div>
            <p className="font-semibold text-dark text-xs sm:text-sm">{action.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-dark">Upcoming Appointments</h2>
            <button 
              onClick={() => navigate('/patient/browse-doctors')}
              className="text-accent font-semibold hover:text-accent/80 transition text-sm sm:text-base px-2 py-1 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded"
              aria-label="Book new appointment"
            >
              <span className="hidden sm:inline">Book New →</span>
              <span className="sm:hidden">+ New</span>
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              <SkeletonCard type="appointment" />
              <SkeletonCard type="appointment" />
            </div>
          ) : upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((apt) => (
                <div key={apt.id} className="border-l-4 border-accent p-3 sm:p-4 bg-background rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                    <div className="flex-1">
                      <p className="font-semibold text-dark text-base sm:text-lg">{apt.doctor_name || apt.doctor}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{apt.specialization}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 sm:px-3 py-1 rounded self-start ${
                      apt.status === "confirmed" || apt.status === "scheduled" || apt.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-accent font-semibold">📅 {apt.appointment_date} {apt.appointment_time ? `at ${formatTime12Hour(apt.appointment_time)}` : ''}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button 
                      onClick={() => navigate(`/patient/book/${apt.doctor_id}`)}
                      className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-1 bg-blue-600 text-white rounded hover:opacity-90 transition active:scale-95"
                    >
                      <span className="hidden sm:inline">📅 Book Another</span>
                      <span className="sm:hidden">📅 Book</span>
                    </button>
                    <button 
                      onClick={() => cancelAppointment(apt.id)}
                      disabled={cancellingId === apt.id}
                      className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-1 bg-red-600 text-white rounded hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
                    >
                      {cancellingId === apt.id ? "Cancelling..." : "❌ Cancel"}
                    </button>
                    <button 
                      onClick={() => navigate('/patient/appointments')}
                      className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-1 border border-accent text-accent rounded hover:bg-background transition active:scale-95"
                    >
                      <span className="hidden sm:inline">View All</span>
                      <span className="sm:hidden">All</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="📅"
              title="No Upcoming Appointments"
              description="You don't have any scheduled appointments. Book one with our qualified doctors today!"
              actionLabel="Browse Doctors"
              onAction={() => navigate('/patient/browse-doctors')}
            />
          )}
        </div>

        {/* Health Metrics */}
        <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow">
          <h2 className="text-xl sm:text-2xl font-bold text-dark mb-4 sm:mb-6">Health Metrics</h2>
          <div className="space-y-4">
            {healthMetrics.length > 0 ? (
              healthMetrics.map((metric, idx) => (
                <div key={idx} className="p-3 sm:p-4 bg-background rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">{metric.record_type}</p>
                  <p className="text-lg sm:text-xl font-bold text-dark mb-1">{metric.record_value}</p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    ✓ {new Date(metric.record_date).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm sm:text-base text-gray-600 text-center py-6">No health records yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
