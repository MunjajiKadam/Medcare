import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";

export default function About() {
  const { theme } = useTheme();
  
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About <span className="text-purple-600 dark:text-purple-400">MedCare</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto">
            MedCare is a modern healthcare platform that connects patients with
            trusted doctors, making healthcare accessible, simple, and reliable.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 bg-background dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Our mission is to simplify the way patients access healthcare by
            providing a seamless platform to book appointments, consult doctors,
            and manage health needs efficiently.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
            Our Vision
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            We envision a future where quality healthcare is available to
            everyone, everywhere, powered by technology and trusted medical
            professionals.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-purple-600 dark:bg-purple-800 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Why Choose <span className="text-purple-200 dark:text-purple-300">MedCare</span>
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:shadow-gray-900/50 text-center border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Trusted Doctors
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Verified and experienced medical professionals.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:shadow-gray-900/50 text-center border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Easy Appointments
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Book appointments in just a few clicks.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:shadow-gray-900/50 text-center border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Secure Platform
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Your data is protected with modern security practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Your Health Matters
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Join MedCare today and experience a smarter way to manage your
          healthcare needs.
        </p>
        <a
          href="/doctors"
          className="inline-block px-8 py-3 bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600 text-white rounded-lg font-semibold shadow-lg transition active:scale-95"
        >
          Find Doctors
        </a>
      </section>

      <Footer />
    </>
  );
}
