import { useEffect, useState } from "react";
import { appointmentAPI, doctorAPI } from "../../api/api";
import { useAuth } from "../../Authcontext/AuthContext";

import { useNavigate } from "react-router-dom";

export default function DoctorDashboard({ title }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        console.log('📊 [DOCTOR DASHBOARD] Fetching doctor appointments...');
        const aRes = await appointmentAPI.getAppointments();
        console.log('✅ [DOCTOR DASHBOARD] Appointments data received:', aRes.data);
        const appts = aRes.data.appointments || [];
        if (mounted) setAppointments(appts.slice(0, 4));
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

  return (
    <div className="min-h-screen bg-background p-6">
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

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold text-dark mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full p-3 bg-accent text-white rounded-lg hover:opacity-90 transition font-semibold">
              📝 Add Notes
            </button>
            <button className="w-full p-3 bg-secondary text-dark rounded-lg hover:opacity-90 transition font-semibold">
              💊 Prescribe
            </button>
            <button className="w-full p-3 bg-primary text-dark rounded-lg hover:opacity-90 transition font-semibold">
              🔍 Diagnose
            </button>
            <button className="w-full p-3 border-2 border-accent text-accent rounded-lg hover:bg-background transition font-semibold">
              ⚙️ Availability
            </button>
          </div>

          {/* Availability Status */}
          <div className="mt-6 p-4 bg-background rounded-lg border-l-4 border-green-500">
            <p className="text-sm text-gray-600 mb-2">Status</p>
            <p className="font-semibold text-green-600">🟢 Online & Accepting</p>
            <button className="text-xs text-accent mt-2 font-semibold">Change Status →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
