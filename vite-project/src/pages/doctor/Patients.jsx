import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Patients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      console.log("📤 [DOCTOR PATIENTS] Fetching my patients...");
      // Simulated data for now
      const mockPatients = [
        { id: 1, name: "John Doe", age: 45, lastVisit: "2026-02-01", status: "Active", bloodType: "O+", phone: "9876543210" },
        { id: 2, name: "Jane Smith", age: 38, lastVisit: "2026-01-28", status: "Active", bloodType: "A+", phone: "9876543211" },
        { id: 3, name: "Robert Johnson", age: 55, lastVisit: "2026-01-25", status: "Active", bloodType: "B+", phone: "9876543212" },
        { id: 4, name: "Emily Davis", age: 42, lastVisit: "2026-02-02", status: "Active", bloodType: "AB+", phone: "9876543213" },
        { id: 5, name: "Michael Brown", age: 50, lastVisit: "2026-01-20", status: "Follow-up", bloodType: "O-", phone: "9876543214" },
      ];
      console.log("✅ [DOCTOR PATIENTS] Patients loaded:", mockPatients);
      setPatients(mockPatients);
    } catch (error) {
      console.error("❌ [DOCTOR PATIENTS] Error loading patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background flex items-center justify-center"><p>Loading patients...</p></div>
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

          <h1 className="text-3xl font-bold text-dark mb-2">👥 My Patients</h1>
          <p className="text-gray-600 mb-6">Total: {filteredPatients.length} patients</p>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search patients by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent"
            />
          </div>

          {filteredPatients.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-600">No patients found.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredPatients.map((patient) => (
                <div key={patient.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-dark">{patient.name}</h3>
                      <p className="text-sm text-gray-600">Age: {patient.age} | Blood Type: {patient.bloodType}</p>
                      <p className="text-sm text-gray-600">📞 {patient.phone}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                      patient.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {patient.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}</p>
                  
                  <div className="flex gap-3">
                    <button className="flex-1 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition font-semibold text-sm">
                      📋 View Record
                    </button>
                    <button className="flex-1 py-2 bg-secondary text-dark rounded-lg hover:opacity-90 transition font-semibold text-sm">
                      💊 Prescribe
                    </button>
                    <button className="flex-1 py-2 border-2 border-accent text-accent rounded-lg hover:bg-background transition font-semibold text-sm">
                      📝 Add Note
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
