import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { appointmentAPI } from "../../api/api";

export default function Appointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      console.log("📤 [DOCTOR APPOINTMENTS] Fetching doctor appointments from API...");
      const response = await appointmentAPI.getAppointments();
      console.log("✅ [DOCTOR APPOINTMENTS] Doctor appointments received from backend:", response.data);
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error("❌ [DOCTOR APPOINTMENTS] Error loading appointments:", error);
      setMessage("Error: " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p>Loading appointments...</p></div>;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-white border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition font-semibold text-sm"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-dark mb-2">Doctor Appointments</h1>
        <p className="text-gray-600 mb-6">View and manage patient appointments</p>

        {message && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {message}
          </div>
        )}

        {appointments.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600">No appointments scheduled.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {appointments.map((apt) => (
              <div key={apt.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-secondary hover:shadow-lg transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-dark">{apt.patient_name || "Patient"}</h3>
                    <p className="text-sm text-gray-600">📅 {new Date(apt.appointment_date).toLocaleDateString()} at {apt.appointment_time}</p>
                    <p className="text-sm text-gray-600 mt-2">📝 {apt.reason_for_visit || "General checkup"}</p>
                    {apt.symptoms && <p className="text-sm text-gray-600">🩹 {apt.symptoms}</p>}
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    apt.status === "scheduled" ? "bg-blue-100 text-blue-700" :
                    apt.status === "completed" ? "bg-green-100 text-green-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {apt.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
