import { useEffect, useState } from "react";
import { doctorAPI, appointmentAPI, patientAPI } from "../../api/api";

import { useNavigate } from "react-router-dom";

export default function AdminDashboard({ title }) {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ patients: 0, doctors: 0, appointments: 0, revenue: 0 });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        console.log('📊 [ADMIN DASHBOARD] Fetching dashboard stats...');
        const [dRes, aRes, pRes] = await Promise.all([
          doctorAPI.getAllDoctors(),
          appointmentAPI.getAppointments(),
          patientAPI.getAllPatients(),
        ]);
        console.log('✅ [ADMIN DASHBOARD] Doctors data:', dRes.data);
        console.log('✅ [ADMIN DASHBOARD] Appointments data:', aRes.data);
        console.log('✅ [ADMIN DASHBOARD] Patients data:', pRes.data);
        const doctors = dRes.data.doctors || [];
        const appointments = aRes.data.appointments || [];
        const patients = pRes.data.patients || [];
        
        if (mounted) {
          setCounts({
            patients: patients.length,
            doctors: doctors.length,
            appointments: appointments.length,
            revenue: appointments.length * 50
          });
          setRecentAppointments(appointments.slice(0, 3));
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load admin dashboard', err);
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  const stats = [
    { icon: "👥", label: "Total Users", value: counts.patients, change: "+12% from last month" },
    { icon: "👨‍⚕️", label: "Total Doctors", value: counts.doctors, change: "+8% from last month" },
    { icon: "📅", label: "Total Appointments", value: counts.appointments, change: "+25% from last month" },
    { icon: "💰", label: "Revenue", value: `$${counts.revenue}`, change: "+18% from last month" },
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
        <h1 className="text-4xl font-bold text-dark mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">{stat.icon}</div>
              <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{stat.label}</h3>
            <p className="text-3xl font-bold text-dark">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold text-dark mb-4">Recent Appointments</h2>
          {loading ? (
            <p>Loading...</p>
          ) : recentAppointments.length > 0 ? (
            <div className="space-y-4">
              {recentAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-4 bg-background rounded-lg">
                  <div>
                    <p className="font-semibold text-dark">{apt.patient_name || 'Patient'}</p>
                    <p className="text-sm text-gray-600">{apt.doctor_name || 'Doctor'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{apt.appointment_date}</p>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      apt.status === "completed" || apt.status === "Completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No recent appointments</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold text-dark mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button onClick={() => navigate('/admin/doctors')} className="w-full p-3 bg-accent text-white rounded-lg hover:opacity-90 transition font-semibold">
              👨‍⚕️ Manage Doctors
            </button>
            <button onClick={() => navigate('/admin/appointments')} className="w-full p-3 bg-secondary text-dark rounded-lg hover:opacity-90 transition font-semibold">
              📋 View Appointments
            </button>
            <button onClick={() => navigate('/admin/patients')} className="w-full p-3 bg-primary text-dark rounded-lg hover:opacity-90 transition font-semibold">
              👥 Manage Patients
            </button>
            <button onClick={() => navigate('/admin/health-records')} className="w-full p-3 border-2 border-secondary text-secondary rounded-lg hover:bg-background transition font-semibold">
              📋 Health Records
            </button>
            <button onClick={() => navigate('/admin/prescriptions')} className="w-full p-3 border-2 border-accent text-accent rounded-lg hover:bg-background transition font-semibold">
              💊 Prescriptions
            </button>
            <button onClick={() => navigate('/admin/reviews')} className="w-full p-3 border-2 border-primary text-primary rounded-lg hover:bg-background transition font-semibold">
              ⭐ Reviews
            </button>
            <button onClick={() => navigate('/admin/time-slots')} className="w-full p-3 border-2 border-gray-400 text-gray-600 rounded-lg hover:bg-background transition font-semibold">
              ⏰ Time Slots
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
