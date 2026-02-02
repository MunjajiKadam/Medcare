import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { appointmentAPI } from "../../api/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

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

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p>Loading appointments...</p></div>;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-white border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition font-semibold text-sm"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-dark mb-6">📅 My Appointments</h1>
        
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes("✓") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        {appointments.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600 mb-6">No appointments scheduled.</p>
            <button
              onClick={() => navigate('/patient/browse-doctors')}
              className="px-6 py-3 bg-accent text-white rounded-lg hover:opacity-90 transition font-semibold"
            >
              📅 Book an Appointment
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-6">
              {appointments.map((apt) => (
                <div key={apt.id} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-accent">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-dark">{apt.doctor_name}</h3>
                      <p className="text-secondary font-semibold">{apt.specialization}</p>
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

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">📅 Date & Time</p>
                      <p className="font-semibold">{new Date(apt.appointment_date).toLocaleDateString()} at {apt.appointment_time}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">📝 Reason</p>
                      <p className="font-semibold">{apt.reason_for_visit || "General checkup"}</p>
                    </div>
                  </div>

                  {apt.symptoms && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">🩹 Symptoms</p>
                      <p className="text-gray-700">{apt.symptoms}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    {apt.status === "scheduled" && (
                      <div>
                        <p className="text-sm text-gray-600 mb-3">ℹ️ To cancel or reschedule, please contact the clinic directly</p>
                        <button
                          onClick={() => navigate(`/patient/book/${apt.doctor_id}`)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition font-semibold text-sm"
                        >
                          📅 Book Another with {apt.doctor_name}
                        </button>
                      </div>
                    )}
                    {apt.status === "completed" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/patient/book/${apt.doctor_id}`)}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:opacity-90 transition font-semibold text-sm"
                        >
                          📅 Book Follow-up
                        </button>
                        <button
                          onClick={() => navigate(`/patient/doctor/${apt.doctor_id}`)}
                          className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:opacity-90 transition font-semibold text-sm"
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
            <div className="bg-gradient-to-r from-accent to-blue-600 rounded-lg p-6 text-white text-center">
              <h2 className="text-xl font-bold mb-2">Need Another Appointment?</h2>
              <p className="mb-4">Browse our doctors and book your next appointment</p>
              <button
                onClick={() => navigate('/patient/browse-doctors')}
                className="px-8 py-3 bg-white text-accent rounded-lg hover:opacity-90 transition font-bold"
              >
                🔍 Browse All Doctors
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
