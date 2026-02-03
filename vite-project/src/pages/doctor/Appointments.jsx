import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { appointmentAPI } from "../../api/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AddNotesModal from "../../components/Modals/AddNotesModal";
import PrescribeModal from "../../components/Modals/PrescribeModal";
import DiagnoseModal from "../../components/Modals/DiagnoseModal";

export default function Appointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);
  
  // Modal states
  const [notesModal, setNotesModal] = useState({ isOpen: false, appointmentId: null, patientId: null });
  const [prescribeModal, setPrescribeModal] = useState({ isOpen: false, appointmentId: null, patientId: null });
  const [diagnoseModal, setDiagnoseModal] = useState({ isOpen: false, appointmentId: null, patientId: null });

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

  const markAsComplete = async (aptId) => {
    try {
      setUpdatingId(aptId);
      console.log(`📤 [DOCTOR APPOINTMENTS] Marking appointment ${aptId} as complete...`);
      await appointmentAPI.updateAppointment(aptId, { status: 'completed' });
      console.log("✅ [DOCTOR APPOINTMENTS] Appointment marked as complete");
      setMessage("✓ Appointment marked as complete!");
      fetchAppointments();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("❌ [DOCTOR APPOINTMENTS] Error updating appointment:", error);
      setMessage("✗ Error: " + error.response?.data?.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === "all") return true;
    return apt.status === filter;
  });

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background flex items-center justify-center"><p>Loading appointments...</p></div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
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
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes("✓") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-6">
          {["all", "scheduled", "completed"].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === status
                  ? "bg-accent text-white"
                  : "bg-white text-dark border-2 border-gray-300 hover:border-accent"
              }`}
            >
              {status === "all" ? "All Appointments" : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600">No {filter !== "all" ? filter : ""} appointments scheduled.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAppointments.map((apt) => (
              <div key={apt.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-secondary hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-dark">{apt.patient_name || "Patient"}</h3>
                    <p className="text-sm text-gray-600">📅 {new Date(apt.appointment_date).toLocaleDateString()} at {apt.appointment_time}</p>
                    <p className="text-sm text-gray-600 mt-2">📝 {apt.reason_for_visit || "General checkup"}</p>
                    {apt.symptoms && <p className="text-sm text-gray-600">🩹 {apt.symptoms}</p>}
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${
                    apt.status === "scheduled" ? "bg-blue-100 text-blue-700" :
                    apt.status === "completed" ? "bg-green-100 text-green-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {apt.status.toUpperCase()}
                  </span>
                </div>

                {/* Action Buttons */}
                {apt.status === "scheduled" && (
                  <div className="flex gap-2 mt-4 flex-wrap">
                    <button
                      onClick={() => markAsComplete(apt.id)}
                      disabled={updatingId === apt.id}
                      className="flex-1 min-w-32 py-2 bg-green-600 text-white rounded-lg hover:opacity-90 transition font-semibold disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                    >
                      {updatingId === apt.id ? "Updating..." : "✅ Mark Complete"}
                    </button>
                    <button 
                      onClick={() => setPrescribeModal({ isOpen: true, appointmentId: apt.id, patientId: apt.patient_id })}
                      className="flex-1 min-w-32 py-2 bg-green-500 text-white rounded-lg hover:opacity-90 transition font-semibold text-sm"
                    >
                      💊 Prescribe
                    </button>
                    <button 
                      onClick={() => setDiagnoseModal({ isOpen: true, appointmentId: apt.id, patientId: apt.patient_id })}
                      className="flex-1 min-w-32 py-2 bg-purple-600 text-white rounded-lg hover:opacity-90 transition font-semibold text-sm"
                    >
                      🔍 Diagnose
                    </button>
                    <button 
                      onClick={() => setNotesModal({ isOpen: true, appointmentId: apt.id, patientId: apt.patient_id })}
                      className="flex-1 min-w-32 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition font-semibold text-sm"
                    >
                      📝 Add Notes
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* Modals */}
      <AddNotesModal 
        isOpen={notesModal.isOpen}
        appointmentId={notesModal.appointmentId}
        patientId={notesModal.patientId}
        onClose={() => setNotesModal({ isOpen: false, appointmentId: null, patientId: null })}
        onSuccess={fetchAppointments}
      />
      <PrescribeModal 
        isOpen={prescribeModal.isOpen}
        appointmentId={prescribeModal.appointmentId}
        patientId={prescribeModal.patientId}
        onClose={() => setPrescribeModal({ isOpen: false, appointmentId: null, patientId: null })}
        onSuccess={fetchAppointments}
      />
      <DiagnoseModal 
        isOpen={diagnoseModal.isOpen}
        appointmentId={diagnoseModal.appointmentId}
        patientId={diagnoseModal.patientId}
        onClose={() => setDiagnoseModal({ isOpen: false, appointmentId: null, patientId: null })}
        onSuccess={fetchAppointments}
      />

      <Footer />
    </>
  );
}
