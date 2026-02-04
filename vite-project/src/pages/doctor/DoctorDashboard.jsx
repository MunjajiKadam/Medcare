import { useEffect, useState } from "react";
import { appointmentAPI, doctorAPI } from "../../api/api";
import { useAuth } from "../../Authcontext/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AvailabilityModal from "../../components/Modals/AvailabilityModal";
import { useNavigate } from "react-router-dom";
import { formatTime12Hour } from "../../utils/timeFormat";

export default function DoctorDashboard({ title }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [appointments, setAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availabilityModal, setAvailabilityModal] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState("available");

  const fetchAvailabilityStatus = async () => {
    try {
      const availRes = await doctorAPI.getProfile();
      if (availRes.data) {
        if (mounted) setDoctorProfile(availRes.data);
        if (availRes.data.availability_status) {
          if (mounted) setAvailabilityStatus(availRes.data.availability_status);
        }
      }
    } catch (err) {
      console.error('Failed to fetch availability status:', err);
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        console.log('📊 [DOCTOR DASHBOARD] Fetching doctor appointments...');
        const aRes = await appointmentAPI.getAppointments();
        console.log('✅ [DOCTOR DASHBOARD] Appointments data received:', aRes.data);
        const appts = aRes.data.appointments || [];
        if (mounted) setAppointments(appts.slice(0, 4));

        // Fetch availability status and profile
        await fetchAvailabilityStatus();
      } catch (err) {
        console.error('Failed to load doctor appointments', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, [user]);

  const stats = [
    { icon: "👥", label: "Total Patients", value: appointments.length, change: `${appointments.length} appointments` },
    { icon: "📅", label: "Appointments", value: appointments.length, change: `${appointments.length} total` },
    { icon: "⭐", label: "Rating", value: doctorProfile?.rating || "0", change: `From ${doctorProfile?.total_reviews || 0} reviews` },
    { icon: "💰", label: "Consultation Fee", value: `$${doctorProfile?.consultation_fee || 0}`, change: "Per visit" },
  ];

  const quickActions = [
    { icon: "📝", label: "Add Notes", action: () => navigate("/doctor/appointments") },
    { icon: "💊", label: "Prescribe", action: () => navigate("/doctor/appointments") },
    { icon: "📬", label: "Send Notification", action: () => navigate("/doctor/send-notification") },
    { icon: "⏰", label: "Time Slots", action: () => navigate("/doctor/time-slots") },
    { icon: "⚙️", label: "Availability", action: () => setAvailabilityModal(true) },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-4 px-3 sm:px-4 py-2 bg-white dark:bg-gray-800 border-2 border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white transition font-semibold text-sm active:scale-95 shadow-md dark:shadow-gray-900/50"
          >
            ← Back
          </button>

          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">
              {doctorProfile?.name ? `Dr. ${doctorProfile.name}'s Dashboard` : 'Doctor Dashboard'}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              {doctorProfile?.specialization || 'Physician'} 
              {doctorProfile?.experience_years ? ` | ${doctorProfile.experience_years}+ years experience` : ''}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-lg dark:shadow-gray-900/50 hover:shadow-xl dark:hover:shadow-gray-900/70 transition border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between mb-2 sm:mb-4">
                  <div className="text-2xl sm:text-3xl">{stat.icon}</div>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">{stat.label}</h3>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">{stat.value}</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Today's Schedule */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Appointments</h2>
              {loading ? (
                <p className="text-gray-600 dark:text-gray-400">Loading...</p>
              ) : appointments.length > 0 ? (
                <div className="space-y-3">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow dark:hover:shadow-gray-900/30 transition border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1">
                        <div className="text-xl sm:text-2xl">👤</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">{apt.patient_name || 'Patient'}</p>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{apt.reason_for_visit || 'Consultation'}</p>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
                        <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{formatTime12Hour(apt.appointment_time)}</p>
                        <span className={`text-xs px-2 py-1 rounded inline-block ${
                          apt.status === "completed" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">No appointments scheduled</p>
              )}
              <button className="w-full mt-4 py-2 border-2 border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-700 transition font-semibold text-sm sm:text-base active:scale-95">
                View Full Schedule
              </button>
            </div>

            {/* Availability Status */}
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Availability Status</h2>
              <div className={`p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 ${
                availabilityStatus === 'available' ? 'border-green-500' :
                availabilityStatus === 'busy' ? 'border-yellow-500' : 'border-red-500'
              }`}>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">Status</p>
                <p className={`font-semibold text-sm sm:text-base ${
                  availabilityStatus === 'available' ? 'text-green-600 dark:text-green-400' :
                  availabilityStatus === 'busy' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {availabilityStatus === 'available' && '🟢 Online & Accepting'}
                  {availabilityStatus === 'busy' && '🟡 Busy'}
                  {availabilityStatus === 'on_leave' && '🔴 On Leave'}
                </p>
                <button 
                  onClick={() => setAvailabilityModal(true)}
                  className="text-xs text-purple-600 dark:text-purple-400 mt-2 font-semibold hover:underline"
                >
                  Change Status →
                </button>
              </div>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.action}
                className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-lg dark:shadow-gray-900/50 hover:shadow-xl dark:hover:shadow-gray-900/70 transition text-center active:scale-95 border border-gray-200 dark:border-gray-700"
              >
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{action.icon}</div>
                <p className="text-gray-900 dark:text-white font-semibold text-xs sm:text-sm lg:text-base">{action.label}</p>
              </button>
            ))}
          </div>

          {/* Availability Modal */}
          <AvailabilityModal 
            isOpen={availabilityModal}
            onClose={() => setAvailabilityModal(false)}
            onSuccess={async (updatedStatus) => {
              setAvailabilityStatus(updatedStatus);
              await fetchAvailabilityStatus(); // Refresh from server to ensure consistency
              setAvailabilityModal(false);
            }}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
