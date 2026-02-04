import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { doctorAPI } from "../api/api";
import { useTheme } from "../context/ThemeContext";

export default function Services() {
  const { theme } = useTheme();
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await doctorAPI.getAllDoctors();
        const doctors = res.data.doctors || res.data || [];
        // derive specialties and counts
        const map = {};
        doctors.forEach((d) => {
          const spec = d.specialization || "General";
          if (!map[spec]) map[spec] = { count: 0, fee: 0 };
          map[spec].count += 1;
          if (d.consultation_fee) map[spec].fee += Number(d.consultation_fee || 0);
        });
        const list = Object.keys(map).map((k) => ({
          title: k,
          count: map[k].count,
          avgFee: map[k].count ? Math.round(map[k].fee / map[k].count) : null,
        }));
        if (mounted) setSpecialties(list);
      } catch (err) {
        console.error('Failed to load doctors for services', err);
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

      <section className="max-w-7xl mx-auto px-4 py-20 bg-background dark:bg-gray-900 min-h-screen">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Our <span className="text-purple-600 dark:text-purple-400">Services</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Browse available specializations and find the right doctor for your needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-3 text-center text-gray-600 dark:text-gray-400">Loading services…</div>
          ) : (
            specialties.map((service, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg dark:shadow-gray-900/50 hover:shadow-xl dark:hover:shadow-gray-900/70 transition border-t-4 border-purple-600 dark:border-purple-500"
              >
                <div className="text-5xl mb-4">🩺</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{service.count} specialist{service.count>1?"s":""} available</p>

                <div className="bg-purple-50 dark:bg-gray-700 p-3 rounded mb-4 text-center">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{service.avgFee ? `$${service.avgFee}` : 'Varies'}</span>
                </div>

                <ul className="space-y-2 mb-6">
                  <li className="text-sm text-gray-600 dark:text-gray-400">Trusted specialist care</li>
                  <li className="text-sm text-gray-600 dark:text-gray-400">Verified profiles</li>
                </ul>

                <button className="w-full py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition font-semibold">
                  Find Doctors
                </button>
              </div>
            ))
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-purple-600 dark:bg-purple-700 text-white p-12 rounded-xl text-center shadow-lg dark:shadow-gray-900/50">
          <h2 className="text-3xl font-bold mb-4">Need Help Choosing a Service?</h2>
          <p className="mb-6 text-lg opacity-95">Our specialists can guide you to the right healthcare solution</p>
          <button className="px-8 py-3 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-lg font-semibold hover:shadow-lg transition active:scale-95">
            Contact Our Team
          </button>
        </div>
      </section>

      <Footer />
    </>
  );
}
