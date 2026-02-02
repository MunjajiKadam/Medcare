import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-background py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
            About <span className="text-accent">MedCare</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            MedCare is a modern healthcare platform that connects patients with
            trusted doctors, making healthcare accessible, simple, and reliable.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-2xl shadow">
          <h2 className="text-2xl font-semibold text-accent mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to simplify the way patients access healthcare by
            providing a seamless platform to book appointments, consult doctors,
            and manage health needs efficiently.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow">
          <h2 className="text-2xl font-semibold text-accent mb-4">
            Our Vision
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We envision a future where quality healthcare is available to
            everyone, everywhere, powered by technology and trusted medical
            professionals.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-secondary py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-dark mb-12">
            Why Choose <span className="text-accent">MedCare</span>
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <h3 className="font-semibold text-dark mb-2">
                Trusted Doctors
              </h3>
              <p className="text-gray-600 text-sm">
                Verified and experienced medical professionals.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow text-center">
              <h3 className="font-semibold text-dark mb-2">
                Easy Appointments
              </h3>
              <p className="text-gray-600 text-sm">
                Book appointments in just a few clicks.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow text-center">
              <h3 className="font-semibold text-dark mb-2">
                Secure Platform
              </h3>
              <p className="text-gray-600 text-sm">
                Your data is protected with modern security practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-background py-20 px-4 text-center">
        <h2 className="text-3xl font-bold text-dark mb-6">
          Your Health Matters
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Join MedCare today and experience a smarter way to manage your
          healthcare needs.
        </p>
        <a
          href="/doctors"
          className="inline-block px-8 py-3 bg-primary rounded-lg font-medium hover:opacity-90"
        >
          Find Doctors
        </a>
      </section>

      <Footer />
    </>
  );
}
