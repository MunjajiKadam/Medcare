import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { doctorAPI, appointmentAPI, patientAPI } from "../api/api";
import { useAuth } from "../Authcontext/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [counts, setCounts] = useState({ patients: 0, doctors: 0, appointments: 0 });
  const [loading, setLoading] = useState(true);

  // Redirect logged-in users to their dashboard
  useEffect(() => {
    if (user) {
      if (user.role === "patient") {
        navigate("/patient/dashboard");
      } else if (user.role === "doctor") {
        navigate("/doctor/dashboard");
      } else if (user.role === "admin") {
        navigate("/admin/dashboard");
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        console.log('🏥 [HOME PAGE] Fetching stats from backend...');
        const [dRes, aRes, pRes] = await Promise.all([
          doctorAPI.getAllDoctors(),
          appointmentAPI.getAppointments(),
          patientAPI.getAllPatients(),
        ]);

        console.log('✅ [HOME PAGE] Doctors data received:', dRes.data);
        console.log('✅ [HOME PAGE] Appointments data received:', aRes.data);
        console.log('✅ [HOME PAGE] Patients data received:', pRes.data);

        const doctors = dRes.data.doctors || dRes.data || [];
        const appointments = aRes.data.appointments || aRes.data || [];
        const patients = (pRes.data.patients) ? pRes.data.patients : (pRes.data || []);

        if (mounted) {
          setCounts({ doctors: doctors.length, appointments: appointments.length, patients: patients.length });
        }
      } catch (err) {
        console.error('Failed to load home stats', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-background min-h-[70vh] sm:min-h-[80vh] flex items-center py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark mb-4 sm:mb-6">
              Your Health, <span className="text-accent">Our Priority</span>
            </h1>
            <p className="text-gray-600 mb-6 text-base sm:text-lg">
              Connect with trusted healthcare professionals and book appointments at your convenience. Quality healthcare is just a click away.
            </p>
            <div className="flex gap-3 sm:gap-4 flex-wrap">
              <a href="/doctors" className="px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-dark rounded-lg font-semibold hover:shadow-lg transition text-sm sm:text-base active:scale-95">
                Find Doctors
              </a>
              <a href="/register" className="px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-accent text-accent rounded-lg font-semibold hover:bg-accent hover:text-white transition text-sm sm:text-base active:scale-95">
                Get Started
              </a>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <div className="bg-secondary rounded-xl h-72 w-full flex items-center justify-center text-white text-4xl font-bold">
              🏥
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (static highlights) */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Why Choose MedCare?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-4 sm:p-6 bg-background rounded-xl text-center hover:shadow-lg transition">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">👨‍⚕️</div>
              <h3 className="text-lg sm:text-xl font-semibold text-dark mb-2">Expert Doctors</h3>
              <p className="text-sm sm:text-base text-gray-600">Access to certified medical professionals</p>
            </div>
            <div className="p-4 sm:p-6 bg-background rounded-xl text-center hover:shadow-lg transition">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📅</div>
              <h3 className="text-lg sm:text-xl font-semibold text-dark mb-2">Easy Booking</h3>
              <p className="text-sm sm:text-base text-gray-600">Book appointments in seconds</p>
            </div>
            <div className="p-4 sm:p-6 bg-background rounded-xl text-center hover:shadow-lg transition">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💬</div>
              <h3 className="text-lg sm:text-xl font-semibold text-dark mb-2">24/7 Support</h3>
              <p className="text-sm sm:text-base text-gray-600">Round the clock customer support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section (from DB) */}
      <section className="py-12 sm:py-16 bg-accent text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            {loading ? (
              <div className="col-span-1 sm:col-span-3">Loading stats…</div>
            ) : (
              <>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold mb-2">{counts.patients}</div>
                  <div className="text-base sm:text-lg opacity-90">Patients</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold mb-2">{counts.doctors}</div>
                  <div className="text-base sm:text-lg opacity-90">Verified Doctors</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold mb-2">{counts.appointments}</div>
                  <div className="text-base sm:text-lg opacity-90">Appointments</div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-dark mb-4">Ready to Book an Appointment?</h2>
          <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg">Join thousands of patients who trust MedCare for their healthcare needs</p>
          <a href="/doctors" className="inline-block px-8 sm:px-10 py-3 sm:py-4 bg-primary text-dark rounded-lg font-semibold hover:shadow-xl transition text-sm sm:text-base active:scale-95">
            Explore Doctors Now
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
