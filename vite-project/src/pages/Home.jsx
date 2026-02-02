import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { doctorAPI, appointmentAPI, patientAPI } from "../api/api";

export default function Home() {
  const [counts, setCounts] = useState({ patients: 0, doctors: 0, appointments: 0 });
  const [loading, setLoading] = useState(true);

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
      <section className="bg-background min-h-[80vh] flex items-center py-20">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
              Your Health, <span className="text-accent">Our Priority</span>
            </h1>
            <p className="text-gray-600 mb-6 text-lg">
              Connect with trusted healthcare professionals and book appointments at your convenience. Quality healthcare is just a click away.
            </p>
            <div className="flex gap-4 flex-wrap">
              <a href="/doctors" className="px-8 py-3 bg-primary text-dark rounded-lg font-semibold hover:shadow-lg transition">
                Find Doctors
              </a>
              <a href="/register" className="px-8 py-3 border-2 border-accent text-accent rounded-lg font-semibold hover:bg-accent hover:text-white transition">
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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose MedCare?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-background rounded-xl text-center hover:shadow-lg transition">
              <div className="text-4xl mb-4">👨‍⚕️</div>
              <h3 className="text-xl font-semibold text-dark mb-2">Expert Doctors</h3>
              <p className="text-gray-600">Access to certified medical professionals</p>
            </div>
            <div className="p-6 bg-background rounded-xl text-center hover:shadow-lg transition">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-dark mb-2">Easy Booking</h3>
              <p className="text-gray-600">Book appointments in seconds</p>
            </div>
            <div className="p-6 bg-background rounded-xl text-center hover:shadow-lg transition">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-dark mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round the clock customer support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section (from DB) */}
      <section className="py-16 bg-accent text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {loading ? (
              <div className="col-span-3">Loading stats…</div>
            ) : (
              <>
                <div>
                  <div className="text-4xl font-bold mb-2">{counts.patients}</div>
                  <div className="text-lg opacity-90">Patients</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">{counts.doctors}</div>
                  <div className="text-lg opacity-90">Verified Doctors</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">{counts.appointments}</div>
                  <div className="text-lg opacity-90">Appointments</div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-dark mb-4">Ready to Book an Appointment?</h2>
          <p className="text-gray-600 mb-8 text-lg">Join thousands of patients who trust MedCare for their healthcare needs</p>
          <a href="/doctors" className="inline-block px-10 py-4 bg-primary text-dark rounded-lg font-semibold hover:shadow-xl transition">
            Explore Doctors Now
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
