import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { appointmentAPI } from "../../api/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SkeletonCard from "../../components/SkeletonCard";
import EmptyState from "../../components/EmptyState";
import { formatTime12Hour } from "../../utils/timeFormat";

export default function Appointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all");
  const [buttonLoading, setButtonLoading] = useState(null);
  const [canClick, setCanClick] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      console.log("📤 [USER APPOINTMENTS] Fetching user appointments from API...");
      const response = await appointmentAPI.getAppointments();
      console.log("✅ [USER APPOINTMENTS] Appointments received from backend:", response.data);
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error("❌ [USER APPOINTMENTS] Error loading appointments:", error);
      setMessage("Error loading appointments: " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    if (confirm("Cancel this appointment?")) {
      try {
        console.log(`📤 [USER APPOINTMENTS] Cancelling appointment ID: ${id}`);
        await appointmentAPI.cancelAppointment(id);
        console.log("✅ [USER APPOINTMENTS] Appointment cancelled successfully");
        setMessage("✓ Appointment cancelled!");
        fetchAppointments();
      } catch (error) {
        console.error("❌ [USER APPOINTMENTS] Error cancelling appointment:", error);
        setMessage("✗ Error: " + error.response?.data?.message);
      }
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-64 mb-6 animate-pulse"></div>
          <div className="space-y-4">
            <SkeletonCard type="appointment" />
            <SkeletonCard type="appointment" />
            <SkeletonCard type="appointment" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-4 px-3 sm:px-4 py-2 bg-white border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition font-semibold text-sm active:scale-95"
          >
            ← Back
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-dark mb-4 sm:mb-6">📅 My Appointments</h1>
        
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes("✓") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        {appointments.length === 0 ? (
          <EmptyState
            icon="📅"
            title="No Appointments Yet"
            description="You haven't scheduled any appointments. Browse our qualified doctors and book your first appointment today!"
            actionLabel="🔍 Browse Doctors"
            onAction={() => navigate('/patient/browse-doctors')}
          />
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid gap-4 sm:gap-6">
              {appointments.map((apt) => (
                <div key={apt.id} className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border-l-4 border-accent">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-dark">{apt.doctor_name}</h3>
                      <p className="text-sm sm:text-base text-secondary font-semibold">{apt.specialization}</p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold self-start ${
                      apt.status === "scheduled" ? "bg-blue-100 text-blue-700" :
                      apt.status === "completed" ? "bg-green-100 text-green-700" :
                      apt.status === "cancelled" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {apt.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">📅 Date & Time</p>
                      <p className="text-sm sm:text-base font-semibold">{new Date(apt.appointment_date).toLocaleDateString()} at {formatTime12Hour(apt.appointment_time)}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">📝 Reason</p>
                      <p className="text-sm sm:text-base font-semibold">{apt.reason_for_visit || "General checkup"}</p>
                    </div>
                  </div>

                  {apt.symptoms && (
                    <div className="mb-4">
                      <p className="text-xs sm:text-sm text-gray-600">🩹 Symptoms</p>
                      <p className="text-sm sm:text-base text-gray-700">{apt.symptoms}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    {apt.status === "scheduled" && (
                      <div className="space-y-2 sm:space-y-3">
                        <button
                          onClick={() => navigate(`/patient/book/${apt.doctor_id}`)}
                          className="w-full px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition font-semibold text-xs sm:text-sm active:scale-95"
                        >
                          📅 Book Another with {apt.doctor_name}
                        </button>
                        <button
                          onClick={() => cancelAppointment(apt.id)}
                          className="w-full px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:opacity-90 transition font-semibold text-xs sm:text-sm active:scale-95"
                        >
                          ❌ Cancel Appointment
                        </button>
                      </div>
                    )}
                    {apt.status === "completed" && (
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <button
                          onClick={() => navigate(`/patient/book/${apt.doctor_id}`)}
                          className="flex-1 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:opacity-90 transition font-semibold text-xs sm:text-sm active:scale-95"
                        >
                          📅 Book Follow-up
                        </button>
                        <button
                          onClick={() => navigate(`/patient/doctor/${apt.doctor_id}`)}
                          className="flex-1 px-3 sm:px-4 py-2 bg-secondary text-white rounded-lg hover:opacity-90 transition font-semibold text-xs sm:text-sm active:scale-95"
                        >
                          👁️ View Profile
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Book Another Appointment Button */}
            <div className="bg-gradient-to-r from-accent to-blue-600 rounded-lg p-4 sm:p-6 text-white text-center">
              <h2 className="text-lg sm:text-xl font-bold mb-2">Need Another Appointment?</h2>
              <p className="text-sm sm:text-base mb-4">Browse our doctors and book your next appointment</p>
              <button
                onClick={() => navigate('/patient/browse-doctors')}
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-accent rounded-lg hover:opacity-90 transition font-bold text-sm sm:text-base active:scale-95"
              >
                🔍 Browse All Doctors
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
      <Footer />
    </>
  );
}
