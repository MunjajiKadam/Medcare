import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { appointmentAPI, healthRecordAPI } from "../../api/api";
import { useAuth } from "../../Authcontext/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SkeletonCard from "../../components/SkeletonCard";
import EmptyState from "../../components/EmptyState";
import { formatTime12Hour } from "../../utils/timeFormat";
import { Calendar, Clock, Video, AlertCircle, Phone, Heart, Info, X } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [showSOSModal, setShowSOSModal] = useState(false);

  const quickActions = [
    { icon: "📅", label: "Book Appointment", path: "/patient/browse-doctors" },
    { icon: "💊", label: "My Prescriptions", path: "/patient/prescriptions" },
    { icon: "📋", label: "Health Records", path: "/patient/health-records" },
    { icon: "🚑", label: "Emergency Help", onClick: () => setShowSOSModal(true) },
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
      <div className="min-h-screen bg-background p-4 sm:p-6 relative">
        {/* SOS Floating Button */}
        <button
          onClick={() => setShowSOSModal(true)}
          className="fixed bottom-24 right-6 z-40 bg-red-600 text-white p-4 rounded-full shadow-2xl hover:bg-red-700 transition-all hover:scale-110 active:scale-95 group flex items-center gap-2 overflow-hidden max-w-[60px] hover:max-w-[200px]"
          aria-label="SOS Emergency"
        >
          <AlertCircle size={28} className="animate-pulse flex-shrink-0" />
          <span className="font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">SOS HELP</span>
        </button>

        {message && (
          <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg max-w-4xl mx-auto ${message.includes("✓") ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
            }`}>
            {message}
          </div>
        )}
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex items-center gap-4">
          <img
            src={user?.profile_image || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || "User") + "&background=random"}
            alt={user?.name || "User"}
            className="w-16 h-16 rounded-full object-cover border-2 border-green-400 bg-gray-100 dark:bg-gray-700"
            onError={e => { e.target.onerror = null; e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || "User") + "&background=random"; }}
          />
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark mb-2">Welcome Back, {user?.name || 'User'}! 👋</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Manage your health and appointments</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {quickActions.map((action, idx) => (
            action.onClick ? (
              <button
                key={idx}
                onClick={action.onClick}
                className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg sm:rounded-xl shadow dark:shadow-gray-900/50 hover:shadow-lg dark:hover:shadow-gray-900/70 transition text-center active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:ring-offset-gray-900"
              >
                <div className="text-2xl sm:text-3xl mb-1 sm:mb-2" role="img" aria-hidden="true">{action.icon}</div>
                <p className="font-semibold text-dark text-xs sm:text-sm">{action.label}</p>
              </button>
            ) : (
              <Link
                key={idx}
                to={action.path}
                className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg sm:rounded-xl shadow dark:shadow-gray-900/50 hover:shadow-lg dark:hover:shadow-gray-900/70 transition text-center active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:ring-offset-gray-900"
                aria-label={action.label}
              >
                <div className="text-2xl sm:text-3xl mb-1 sm:mb-2" role="img" aria-hidden="true">{action.icon}</div>
                <p className="font-semibold text-dark text-xs sm:text-sm">{action.label}</p>
              </Link>
            )
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow dark:shadow-gray-900/50">
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
                  <div key={apt.id} className="border-l-4 border-accent p-3 sm:p-4 bg-background dark:bg-gray-700 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                      <div className="flex-1">
                        <p className="font-semibold text-dark text-base sm:text-lg flex items-center gap-2">
                          {apt.doctor_name || apt.doctor}
                          {apt.is_virtual && <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1"><Video size={10} /> VIRTUAL</span>}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{apt.specialization}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 sm:px-3 py-1 rounded self-start ${apt.status === "confirmed" || apt.status === "scheduled" || apt.status === "Confirmed" ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" : "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300"
                        }`}>
                        {apt.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      <p className="text-xs sm:text-sm text-accent font-semibold flex items-center gap-1"><Calendar size={14} /> {apt.appointment_date}</p>
                      <p className="text-xs sm:text-sm text-accent font-semibold flex items-center gap-1"><Clock size={14} /> {formatTime12Hour(apt.appointment_time)}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {apt.is_virtual && apt.meeting_link && (
                        <a
                          href={apt.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm px-4 py-1.5 bg-green-600 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-green-700 transition active:scale-95"
                        >
                          <Video size={16} /> Join Virtual Meeting
                        </a>
                      )}
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
                        className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-1 border border-accent text-accent rounded hover:bg-background dark:hover:bg-gray-700 transition active:scale-95"
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
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow dark:shadow-gray-900/50">
            <h2 className="text-xl sm:text-2xl font-bold text-dark mb-4 sm:mb-6">Health Metrics</h2>
            <div className="space-y-4">
              {healthMetrics.length > 0 ? (
                healthMetrics.map((metric, idx) => (
                  <div key={idx} className="p-3 sm:p-4 bg-background dark:bg-gray-700 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{metric.record_type}</p>
                    <p className="text-lg sm:text-xl font-bold text-dark mb-1">{metric.record_value}</p>
                    <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                      ✓ {new Date(metric.record_date).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center py-6">No health records yet</p>
              )}
            </div>
          </div>
        </div>

        {/* SOS Modal */}
        {showSOSModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="bg-red-600 p-6 text-white text-center relative">
                <button
                  onClick={() => setShowSOSModal(false)}
                  className="absolute top-4 right-4 p-1 hover:bg-red-700 rounded-full transition"
                >
                  <X size={24} />
                </button>
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={40} className="animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold">EMERGENCY INFO</h2>
                <p className="text-white/80 text-sm mt-1">Show this to medical personal if needed</p>
              </div>

              <div className="p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border-l-4 border-red-500 shadow-sm">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Blood Group</p>
                    <p className="text-xl font-black text-red-600 dark:text-red-400">{user?.blood_group || 'O+'}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border-l-4 border-orange-500 shadow-sm">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Age</p>
                    <p className="text-xl font-black text-gray-800 dark:text-white">{user?.age || '25'}</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border-l-4 border-blue-500 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                    <Heart size={16} /> Critical Allergies
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{user?.allergies || 'Penicillin, Peanuts (Severe)'}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border-l-4 border-purple-500 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                    <Phone size={16} /> Emergency Contacts
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Spouse (Sarah)</span>
                      <a href="tel:1234567890" className="text-accent font-bold hover:underline">+1 (234) 567-890</a>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Sister (Jane)</span>
                      <a href="tel:0987654321" className="text-accent font-bold hover:underline">+1 (098) 765-432</a>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <a
                    href="tel:911"
                    className="flex items-center justify-center gap-2 w-full py-4 bg-red-600 text-white rounded-xl font-black text-lg hover:bg-red-700 shadow-lg shadow-red-500/30 transition-all active:scale-95"
                  >
                    <Phone size={24} fill="white" /> CALL 911 NOW
                  </a>
                  <p className="text-[10px] text-gray-500 mt-2">MedCare SOS: Your life matters.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
