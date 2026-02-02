import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { healthRecordAPI } from "../../api/api";

export default function HealthRecords() {
  const navigate = useNavigate();
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
      const response = await healthRecordAPI.getHealthRecords();
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
        await healthRecordAPI.deleteHealthRecord(id);
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

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p>Loading health records...</p></div>;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="mb-4 px-4 py-2 bg-white border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition font-semibold text-sm"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-dark mb-2">🏥 Health Records</h1>
        <p className="text-gray-600 mb-6">View and manage all patient health records</p>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes("✓") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <input
            type="text"
            placeholder="Search by patient name or record type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
          />
        </div>

        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center text-gray-500">
            No health records found
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-dark">Patient</th>
                  <th className="px-6 py-3 text-left font-semibold text-dark">Record Type</th>
                  <th className="px-6 py-3 text-left font-semibold text-dark">Record Value</th>
                  <th className="px-6 py-3 text-left font-semibold text-dark">Date</th>
                  <th className="px-6 py-3 text-center font-semibold text-dark">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-dark">{record.patient_name || "N/A"}</td>
                    <td className="px-6 py-4">{record.record_type || "N/A"}</td>
                    <td className="px-6 py-4">{record.record_value || "N/A"}</td>
                    <td className="px-6 py-4 text-sm">{new Date(record.record_date).toLocaleDateString() || "N/A"}</td>
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

        <div className="mt-6 text-gray-600 text-sm">
          Total Records: <span className="font-bold text-dark">{filteredRecords.length}</span>
        </div>
      </div>
    </div>
  );
}
