import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { appointmentAPI, healthRecordAPI } from "../../api/api";
import { useAuth } from "../../Authcontext/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [healthMetrics, setHealthMetrics] = useState([]);
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
      }
    };
    load();
    return () => (mounted = false);
  }, [user]);

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-dark mb-2">Welcome Back, {user?.name || 'User'}! 👋</h1>
        <p className="text-gray-600">Manage your health and appointments</p>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {quickActions.map((action, idx) => (
          <Link
            key={idx}
            to={action.path}
            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition text-center"
          >
            <div className="text-3xl mb-2">{action.icon}</div>
            <p className="font-semibold text-dark text-sm">{action.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-dark">Upcoming Appointments</h2>
            <button 
              onClick={() => navigate('/patient/browse-doctors')}
              className="text-accent font-semibold hover:text-accent/80 transition"
            >
              Book New →
            </button>
          </div>

          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((apt) => (
                <div key={apt.id} className="border-l-4 border-accent p-4 bg-background rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-dark text-lg">{apt.doctor_name || apt.doctor}</p>
                      <p className="text-sm text-gray-600">{apt.specialization}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded ${
                      apt.status === "confirmed" || apt.status === "scheduled" || apt.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-sm text-accent font-semibold">📅 {apt.appointment_date} {apt.appointment_time ? `at ${apt.appointment_time}` : ''}</p>
                  <div className="flex gap-2 mt-3">
                    <button 
                      onClick={() => navigate(`/patient/book/${apt.doctor_id}`)}
                      className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:opacity-90 transition"
                    >
                      📅 Book Another
                    </button>
                    <button 
                      onClick={() => navigate('/patient/appointments')}
                      className="text-sm px-3 py-1 border border-accent text-accent rounded hover:bg-background transition"
                    >
                      View All
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No upcoming appointments</p>
              <button
                onClick={() => navigate('/patient/browse-doctors')}
                className="px-6 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition font-semibold"
              >
                📅 Book an Appointment
              </button>
            </div>
          )}
        </div>

        {/* Health Metrics */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold text-dark mb-6">Health Metrics</h2>
          <div className="space-y-4">
            {healthMetrics.length > 0 ? (
              healthMetrics.map((metric, idx) => (
                <div key={idx} className="p-4 bg-background rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">{metric.record_type}</p>
                  <p className="text-xl font-bold text-dark mb-1">{metric.record_value}</p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    ✓ {new Date(metric.record_date).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-6">No health records yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
