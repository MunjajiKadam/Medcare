import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { prescriptionAPI } from "../../api/api";
import { useAuth } from "../../Authcontext/AuthContext";

export default function Prescriptions() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await logout();
      navigate("/admin/login");
    }
  };
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      console.log("📤 [ADMIN PRESCRIPTIONS] Fetching prescriptions from API...");
      const response = await prescriptionAPI.getAllPrescriptionsAdmin();
      console.log("✅ [ADMIN PRESCRIPTIONS] Prescriptions received from backend:", response.data);
      setPrescriptions(response.data.prescriptions || response.data || []);
    } catch (error) {
      console.error("❌ [ADMIN PRESCRIPTIONS] Error loading prescriptions:", error);
      setMessage("Error: " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const deletePrescription = async (id) => {
    if (confirm("Are you sure you want to delete this prescription?")) {
      try {
        console.log(`📤 [ADMIN PRESCRIPTIONS] Deleting prescription ID: ${id}`);
        await prescriptionAPI.deletePrescriptionAdmin(id);
        console.log("✅ [ADMIN PRESCRIPTIONS] Prescription deleted successfully");
        setMessage("✓ Prescription deleted!");
        fetchPrescriptions();
      } catch (error) {
        console.error("❌ [ADMIN PRESCRIPTIONS] Error deleting prescription:", error);
        setMessage("✗ Error: " + error.response?.data?.message);
      }
    }
  };

  const filteredPrescriptions = prescriptions.filter(p =>
    (p.patient_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.doctor_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.medications || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p>Loading prescriptions...</p></div>;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition font-semibold text-sm"
          >
            ← Back
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold text-sm flex items-center gap-2"
          >
            <span>🚪</span>
            Logout
          </button>
        </div>

        <h1 className="text-3xl font-bold text-dark mb-2">💊 Prescriptions</h1>
        <p className="text-gray-600 mb-6">View and manage all prescriptions</p>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes("✓") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <input
            type="text"
            placeholder="Search by patient or doctor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
          />
        </div>

        {filteredPrescriptions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center text-gray-500">
            No prescriptions found
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-dark">Patient</th>
                  <th className="px-6 py-3 text-left font-semibold text-dark">Doctor</th>
                  <th className="px-6 py-3 text-left font-semibold text-dark">Medication</th>
                  <th className="px-6 py-3 text-left font-semibold text-dark">Dosage</th>
                  <th className="px-6 py-3 text-left font-semibold text-dark">Duration</th>
                  <th className="px-6 py-3 text-left font-semibold text-dark">Date Issued</th>
                  <th className="px-6 py-3 text-center font-semibold text-dark">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrescriptions.map((prescription, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-dark">{prescription.patient_name || "N/A"}</td>
                    <td className="px-6 py-4">{prescription.doctor_name || "N/A"}</td>
                    <td className="px-6 py-4">
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {prescription.medications || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">{prescription.dosage || "N/A"}</td>
                    <td className="px-6 py-4">{prescription.duration || "N/A"}</td>
                    <td className="px-6 py-4 text-sm">{new Date(prescription.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => deletePrescription(prescription.id)}
                        className="text-red-500 hover:text-red-700 font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 text-gray-600 text-sm">
          Total Prescriptions: <span className="font-bold text-dark">{filteredPrescriptions.length}</span>
        </div>
      </div>
    </div>
  );
}
