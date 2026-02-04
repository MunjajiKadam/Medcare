import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { healthRecordAPI } from "../../api/api";
import { useAuth } from "../../Authcontext/AuthContext";

export default function HealthRecords() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await logout();
      navigate("/admin/login");
    }
  };
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchHealthRecords();
  }, []);

  const fetchHealthRecords = async () => {
    try {
      setLoading(true);
      console.log("📤 [ADMIN HEALTH RECORDS] Fetching health records from API...");
      const response = await healthRecordAPI.getAllHealthRecordsAdmin();
      console.log("✅ [ADMIN HEALTH RECORDS] Health records received from backend:", response.data);
      setRecords(response.data.records || response.data || []);
    } catch (error) {
      console.error("❌ [ADMIN HEALTH RECORDS] Error loading health records:", error);
      setMessage("Error: " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id) => {
    if (confirm("Are you sure you want to delete this health record?")) {
      try {
        console.log(`📤 [ADMIN HEALTH RECORDS] Deleting health record ID: ${id}`);
        await healthRecordAPI.deleteHealthRecordAdmin(id);
        console.log("✅ [ADMIN HEALTH RECORDS] Health record deleted successfully");
        setMessage("✓ Record deleted!");
        fetchHealthRecords();
      } catch (error) {
        console.error("❌ [ADMIN HEALTH RECORDS] Error deleting record:", error);
        setMessage("✗ Error: " + error.response?.data?.message);
      }
    }
  };

  const filteredRecords = records.filter(r =>
    (r.patient_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.record_type || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center"><p className="text-gray-700 dark:text-gray-300">Loading health records...</p></div>;

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-4 py-2 bg-white dark:bg-gray-800 border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white dark:hover:bg-accent transition font-semibold text-sm"
          >
            ← Back to Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold text-sm flex items-center gap-2"
          >
            <span>🚪</span>
            Logout
          </button>
        </div>

        <h1 className="text-3xl font-bold text-dark dark:text-white mb-2">🏥 Health Records</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">View and manage all patient health records</p>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes("✓") ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"}`}>
            {message}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 p-6 mb-6">
          <input
            type="text"
            placeholder="Search by patient name or record type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-accent placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
        </div>

        {filteredRecords.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 p-6 text-center text-gray-500 dark:text-gray-400">
            No health records found
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700 border-b dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-dark dark:text-white">Patient</th>
                  <th className="px-6 py-3 text-left font-semibold text-dark dark:text-white">Record Type</th>
                  <th className="px-6 py-3 text-left font-semibold text-dark dark:text-white">Record Value</th>
                  <th className="px-6 py-3 text-left font-semibold text-dark dark:text-white">Date</th>
                  <th className="px-6 py-3 text-center font-semibold text-dark dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, idx) => (
                  <tr key={idx} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 font-semibold text-dark dark:text-white">{record.patient_name || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{record.record_type || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{record.record_value || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{new Date(record.record_date).toLocaleDateString() || "N/A"}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => deleteRecord(record.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-semibold"
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

        <div className="mt-6 text-gray-600 dark:text-gray-300 text-sm">
          Total Records: <span className="font-bold text-dark dark:text-white">{filteredRecords.length}</span>
        </div>
      </div>
    </div>
  );
}
