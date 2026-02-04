import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { patientAPI } from "../../api/api";
import { useAuth } from "../../Authcontext/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Patients() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme } = useTheme();
  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await logout();
      navigate("/admin/login");
    }
  };
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const deletePatient = async (id, name) => {
    if (confirm(`Are you sure you want to delete patient ${name}? This action cannot be undone.`)) {
      try {
        console.log(`📤 [ADMIN PATIENTS] Deleting patient ID: ${id}`);
        await patientAPI.deletePatientAdmin(id);
        console.log("✅ [ADMIN PATIENTS] Patient deleted successfully");
        setMessage("✓ Patient deleted successfully!");
        setTimeout(() => setMessage(""), 3000);
        fetchPatients();
      } catch (error) {
        console.error("❌ [ADMIN PATIENTS] Error deleting patient:", error);
        setMessage("✗ Error: " + error.response?.data?.message);
        setTimeout(() => setMessage(""), 3000);
      }
    }
  };

  const viewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const filteredPatients = patients.filter(p =>
    (p.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center"><p className="text-gray-700 dark:text-gray-300">Loading patients...</p></div>;

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 p-6 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition font-semibold text-sm"
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

        <h1 className="text-3xl font-bold text-dark dark:text-white mb-2">👥 Patients</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Manage all registered patients</p>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes("✓") ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"}`}>
            {message}
          </div>
        )}

        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 border-2 border-accent dark:border-gray-600 rounded-lg focus:outline-none bg-white dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />
        </div>

        {filteredPatients.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center">
            <p className="text-gray-600 dark:text-gray-400">No patients found.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
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
                  <tr key={idx} className="border-b dark:border-gray-700 hover:bg-background dark:hover:bg-gray-700 transition">
                    <td className="px-6 py-4 font-semibold text-dark dark:text-white">{patient.name || "N/A"}</td>
                    <td className="px-6 py-4 dark:text-gray-300">{patient.email || "N/A"}</td>
                    <td className="px-6 py-4 dark:text-gray-300">{patient.phone || "N/A"}</td>
                    <td className="px-6 py-4 dark:text-gray-300">{patient.blood_type || "N/A"}</td>
                    <td className="px-6 py-4 text-sm dark:text-gray-300">{patient.medical_history || "None"}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button 
                          onClick={() => viewPatient(patient)}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => deletePatient(patient.id, patient.name)}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">Total Patients: {filteredPatients.length}</p>
      </div>

      {/* View Patient Modal */}
      {showModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-600 to-accent p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">👤 Patient Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:opacity-80 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Name</label>
                  <p className="text-dark dark:text-white font-semibold">{selectedPatient.name || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Email</label>
                  <p className="text-dark dark:text-white">{selectedPatient.email || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Phone</label>
                  <p className="text-dark dark:text-white">{selectedPatient.phone || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Blood Type</label>
                  <p className="text-dark dark:text-white">{selectedPatient.blood_type || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Date of Birth</label>
                  <p className="text-dark dark:text-white">{selectedPatient.date_of_birth ? new Date(selectedPatient.date_of_birth).toLocaleDateString() : "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Gender</label>
                  <p className="text-dark dark:text-white">{selectedPatient.gender || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Address</label>
                  <p className="text-dark dark:text-white">{selectedPatient.address || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Emergency Contact</label>
                  <p className="text-dark dark:text-white">{selectedPatient.emergency_contact || "N/A"}</p>
                </div>
              </div>
              
              {selectedPatient.medical_history && (
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Medical History</label>
                  <p className="text-dark dark:text-white bg-gray-100 dark:bg-gray-700 p-3 rounded">{selectedPatient.medical_history}</p>
                </div>
              )}
              
              {selectedPatient.allergies && (
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Allergies</label>
                  <p className="text-dark dark:text-white bg-red-50 dark:bg-red-900/20 p-3 rounded text-red-700 dark:text-red-300">{selectedPatient.allergies}</p>
                </div>
              )}
              
              <div className="pt-4 border-t dark:border-gray-700">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-2 bg-accent text-white rounded-lg hover:opacity-90 transition font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
