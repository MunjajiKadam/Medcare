import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { appointmentAPI } from "../../api/api";
import { useAuth } from "../../Authcontext/AuthContext";
import { formatTime12Hour } from "../../utils/timeFormat";

export default function Appointments() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await logout();
      navigate("/admin/login");
    }
  };
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      console.log("📤 [ADMIN APPOINTMENTS] Fetching all appointments from API...");
      const response = await appointmentAPI.getAllAppointmentsAdmin();
      console.log("✅ [ADMIN APPOINTMENTS] Appointments received from backend:", response.data);
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error("❌ [ADMIN APPOINTMENTS] Error loading appointments:", error);
      setMessage("Error: " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = filterStatus === "all" 
    ? appointments 
    : appointments.filter(a => a.status === filterStatus);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p>Loading appointments...</p></div>;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition font-semibold text-sm"
          >
            ← Back
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold text-sm flex items-center gap-2"
          >
            <span>🚪</span>
            Logout
          </button>
        </div>

        <h1 className="text-3xl font-bold text-dark mb-2">📅 All Appointments</h1>
        <p className="text-gray-600 mb-6">Manage all patient appointments</p>

        {message && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {message}
          </div>
        )}

        <div className="mb-6 flex gap-2">
          {["all", "scheduled", "completed", "cancelled"].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterStatus === status
                  ? "bg-accent text-white"
                  : "bg-white border-2 border-accent text-accent hover:bg-background"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600">No appointments found.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAppointments.map((apt) => (
              <div key={apt.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-secondary">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-dark">{apt.patient_name || "Patient"} → {apt.doctor_name || "Doctor"}</h3>
                    <p className="text-sm text-gray-600">📅 {new Date(apt.appointment_date).toLocaleDateString()} at {formatTime12Hour(apt.appointment_time)}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    apt.status === "scheduled" ? "bg-blue-100 text-blue-700" :
                    apt.status === "completed" ? "bg-green-100 text-green-700" :
                    apt.status === "cancelled" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {apt.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">📝 {apt.reason_for_visit || "General checkup"}</p>
                {apt.symptoms && <p className="text-sm text-gray-600">🩹 {apt.symptoms}</p>}
              </div>
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-gray-600">Total Appointments: {filteredAppointments.length}</p>
      </div>
    </div>
  );
}
