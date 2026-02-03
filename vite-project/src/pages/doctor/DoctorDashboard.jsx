import { useEffect, useState } from "react";
import { appointmentAPI, doctorAPI } from "../../api/api";
import { useAuth } from "../../Authcontext/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AvailabilityModal from "../../components/Modals/AvailabilityModal";
import { useNavigate } from "react-router-dom";

export default function DoctorDashboard({ title }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availabilityModal, setAvailabilityModal] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState("available");

  const fetchAvailabilityStatus = async () => {
    try {
      const availRes = await doctorAPI.getProfile();
      if (availRes.data && availRes.data.availability_status) {
        setAvailabilityStatus(availRes.data.availability_status);
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

        // Fetch availability status
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
    { icon: "👥", label: "Total Patients", value: appointments.length, change: "+24 this month" },
    { icon: "📅", label: "Appointments", value: appointments.length, change: `${appointments.length} total` },
    { icon: "⭐", label: "Rating", value: "4.9", change: "From 245 reviews" },
    { icon: "💰", label: "Earnings", value: `$${appointments.length * 50}`, change: "This month" },
  ];

  const quickActions = [
    { icon: "📝", label: "Add Notes", action: () => navigate("/doctor/appointments") },
    { icon: "💊", label: "Prescribe", action: () => navigate("/doctor/appointments") },
    { icon: "🔍", label: "Diagnose", action: () => navigate("/doctor/appointments") },
    { icon: "⚙️", label: "Availability", action: () => setAvailabilityModal(true) },
  ];

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

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-dark mb-2">Dr. Sarah Johnson's Dashboard</h1>
            <p className="text-gray-600">Cardiologist | 15+ years experience</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{stat.icon}</div>
                </div>
                <h3 className="text-gray-600 text-sm mb-1">{stat.label}</h3>
                <p className="text-3xl font-bold text-dark mb-2">{stat.value}</p>
                <p className="text-xs text-accent font-semibold">{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Today's Schedule */}
            <div className="md:col-span-2 bg-white p-6 rounded-xl shadow">
              <h2 className="text-2xl font-bold text-dark mb-6">Appointments</h2>
              {loading ? (
                <p>Loading...</p>
              ) : appointments.length > 0 ? (
                <div className="space-y-3">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-4 bg-background rounded-lg hover:shadow transition">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-2xl">👤</div>
                        <div>
                          <p className="font-semibold text-dark">{apt.patient_name || 'Patient'}</p>
                          <p className="text-sm text-gray-600">{apt.reason_for_visit || 'Consultation'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-dark">{apt.appointment_time}</p>
                        <span className={`text-xs px-2 py-1 rounded inline-block mt-1 ${
                          apt.status === "completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No appointments scheduled</p>
              )}
              <button className="w-full mt-4 py-2 border-2 border-accent text-accent rounded-lg hover:bg-background transition font-semibold">
                View Full Schedule
              </button>
            </div>

            {/* Availability Status */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-bold text-dark mb-6">Availability Status</h2>
              <div className={`p-4 bg-background rounded-lg border-l-4 ${
                availabilityStatus === 'available' ? 'border-green-500' :
                availabilityStatus === 'busy' ? 'border-yellow-500' : 'border-red-500'
              }`}>
                <p className="text-sm text-gray-600 mb-2">Status</p>
                <p className={`font-semibold ${
                  availabilityStatus === 'available' ? 'text-green-600' :
                  availabilityStatus === 'busy' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {availabilityStatus === 'available' && '🟢 Online & Accepting'}
                  {availabilityStatus === 'busy' && '🟡 Busy'}
                  {availabilityStatus === 'on_leave' && '🔴 On Leave'}
                </p>
                <button 
                  onClick={() => setAvailabilityModal(true)}
                  className="text-xs text-accent mt-2 font-semibold hover:underline"
                >
                  Change Status →
                </button>
              </div>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="grid md:grid-cols-4 gap-4 mt-8">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.action}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center"
              >
                <div className="text-3xl mb-3">{action.icon}</div>
                <p className="text-dark font-semibold">{action.label}</p>
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
