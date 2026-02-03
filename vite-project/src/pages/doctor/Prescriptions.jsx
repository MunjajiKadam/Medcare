import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Prescriptions() {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      console.log("📤 [DOCTOR PRESCRIPTIONS] Fetching prescriptions...");
      // Simulated data
      const mockPrescriptions = [
        { id: 1, patient: "John Doe", medications: "Aspirin, Atorvastatin", dosage: "100mg, 20mg", duration: "30 days", date: "2026-02-01", status: "Active" },
        { id: 2, patient: "Jane Smith", medications: "Metformin", dosage: "500mg twice daily", duration: "60 days", date: "2026-01-28", status: "Active" },
        { id: 3, patient: "Robert Johnson", medications: "Lisinopril", dosage: "10mg daily", duration: "30 days", date: "2026-01-25", status: "Completed" },
        { id: 4, patient: "Emily Davis", medications: "Amoxicillin", dosage: "500mg three times", duration: "7 days", date: "2026-02-02", status: "Active" },
      ];
      console.log("✅ [DOCTOR PRESCRIPTIONS] Prescriptions loaded:", mockPrescriptions);
      setPrescriptions(mockPrescriptions);
    } catch (error) {
      console.error("❌ [DOCTOR PRESCRIPTIONS] Error loading prescriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter(rx => {
    if (filter === "all") return true;
    return rx.status.toLowerCase() === filter;
  });

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background flex items-center justify-center"><p>Loading prescriptions...</p></div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 px-4 py-2 bg-white border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition font-semibold text-sm"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold text-dark mb-2">💊 Prescriptions</h1>
          <p className="text-gray-600 mb-6">Manage and view all prescriptions</p>

          {/* Filter */}
          <div className="flex gap-3 mb-6">
            {["all", "active", "completed"].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === status
                    ? "bg-accent text-white"
                    : "bg-white text-dark border-2 border-gray-300 hover:border-accent"
                }`}
              >
                {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* New Prescription Button */}
          <button className="mb-6 px-6 py-3 bg-accent text-white rounded-lg hover:opacity-90 transition font-semibold">
            ➕ New Prescription
          </button>

          {filteredPrescriptions.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-600">No {filter !== "all" ? filter : ""} prescriptions.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredPrescriptions.map((rx) => (
                <div key={rx.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-dark">{rx.patient}</h3>
                      <p className="text-sm text-gray-600 mt-2">📅 Prescribed: {new Date(rx.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">⏱️ Duration: {rx.duration}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                      rx.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {rx.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="bg-background p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-600 mb-2">💊 Medications</p>
                    <p className="font-semibold text-dark">{rx.medications}</p>
                    <p className="text-sm text-gray-600 mt-1">Dosage: {rx.dosage}</p>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition font-semibold text-sm">
                      📋 View Details
                    </button>
                    <button className="flex-1 py-2 border-2 border-accent text-accent rounded-lg hover:bg-background transition font-semibold text-sm">
                      ✏️ Edit
                    </button>
                    <button className="flex-1 py-2 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition font-semibold text-sm">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
