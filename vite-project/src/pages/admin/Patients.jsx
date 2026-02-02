import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { patientAPI } from "../../api/api";

export default function Patients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      console.log("📤 [ADMIN PATIENTS] Fetching patients from API...");
      const response = await patientAPI.getAllPatients();
      console.log("✅ [ADMIN PATIENTS] Patients received from backend:", response.data);
      setPatients(response.data.patients || []);
    } catch (error) {
      console.error("❌ [ADMIN PATIENTS] Error loading patients:", error);
      setMessage("Error: " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(p =>
    (p.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p>Loading patients...</p></div>;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-white border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition font-semibold text-sm"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-dark mb-2">👥 Patients</h1>
        <p className="text-gray-600 mb-6">Manage all registered patients</p>

        {message && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {message}
          </div>
        )}

        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 border-2 border-accent rounded-lg focus:outline-none bg-white"
          />
        </div>

        {filteredPatients.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600">No patients found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-secondary text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Phone</th>
                  <th className="px-6 py-3 text-left">Blood Type</th>
                  <th className="px-6 py-3 text-left">Medical History</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient, idx) => (
                  <tr key={idx} className="border-b hover:bg-background transition">
                    <td className="px-6 py-4 font-semibold text-dark">{patient.name || "N/A"}</td>
                    <td className="px-6 py-4">{patient.email || "N/A"}</td>
                    <td className="px-6 py-4">{patient.phone || "N/A"}</td>
                    <td className="px-6 py-4">{patient.blood_type || "N/A"}</td>
                    <td className="px-6 py-4 text-sm">{patient.medical_history || "None"}</td>
                    <td className="px-6 py-4 text-center">
                      <button className="px-4 py-2 bg-accent text-white rounded hover:opacity-90 text-sm">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-6 text-center text-gray-600">Total Patients: {filteredPatients.length}</p>
      </div>
    </div>
  );
}
